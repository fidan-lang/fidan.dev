import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadTypeScript } from "./load-typescript.mjs";
const renderer = loadTypeScript(
  new URL("../src/lib/utils/markdown.ts", import.meta.url),
);
export function pages(root) {
  const result = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...pages(file));
    else if (entry.isFile() && entry.name.endsWith(".md")) result.push(file);
  }
  return result.sort();
}
export function checkDocumentation(root, staticRoot) {
  const routes = new Map();
  for (const file of pages(root)) {
    const source = readFileSync(file, "utf8");
    for (const field of ["title", "description", "summary", "order"])
      if (!new RegExp(`^${field}: .+`, "m").test(source))
        throw new Error(`Missing ${field}: ${file}`);
    const slug = path
      .relative(root, file)
      .split(path.sep)
      .join("/")
      .replace(/\.md$/, "")
      .replace(/(?:^|\/)index$/, "");
    const route = "/docs" + (slug ? "/" + slug : "");
    if (routes.has(route)) throw new Error(`Duplicate route ${route}`);
    const html = renderer.renderMarkdown(
      source.replace(/^---[\s\S]*?---\s*/, ""),
    );
    const ids = [...html.matchAll(/(?:^|\s)id="([^"]+)"/g)].map(
      (match) => match[1],
    );
    if (new Set(ids).size !== ids.length)
      throw new Error(`Duplicate rendered anchor: ${file}`);
    for (const item of renderer.collectToc(
      source.replace(/^---[\s\S]*?---\s*/, ""),
    ))
      if (!ids.includes(item.id))
        throw new Error(
          `TOC points to missing rendered anchor ${item.id}: ${file}`,
        );
    routes.set(route, { file, html, ids: new Set(ids) });
  }
  let links = 0;
  for (const [route, page] of routes) {
    for (const match of page.html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (/^(?:mailto:|data:)/.test(href)) continue;
      const url = new URL(href, "https://fidan.dev" + route);
      if (!["fidan.dev", "docs.fidan.dev"].includes(url.hostname)) continue;
      const targetPath =
        (url.hostname === "docs.fidan.dev" ? "/docs" : "") +
        url.pathname.replace(/\/$/, "");
      if (targetPath.startsWith("/docs")) {
        const target = routes.get(targetPath);
        if (!target)
          throw new Error(
            `Missing documentation route ${href} in ${page.file}`,
          );
        if (url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1))))
          throw new Error(
            `Missing documentation anchor ${href} in ${page.file}`,
          );
        links++;
      } else if (
        /\.(?:svg|png|jpg|webp|txt|pdf)$/.test(targetPath) &&
        !existsSync(path.join(staticRoot, targetPath.slice(1)))
      )
        throw new Error(`Missing local asset ${href}`);
    }
  }
  return { pages: routes.size, links };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  console.log(
    JSON.stringify(
      checkDocumentation(
        path.resolve("src/content/docs"),
        path.resolve("static"),
      ),
    ),
  );
