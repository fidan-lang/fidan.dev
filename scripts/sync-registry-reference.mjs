import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { referenceBlock } from "./reference-block.mjs";
// Only the explicit literal .route declarations used by DAL are accepted. If
// routing becomes dynamic, fail rather than silently claim partial coverage.
export function registryRoutes(root) {
  const routes = [];
  const directory = path.join(root, "crates/dal-server/src/routes");
  for (const file of readdirSync(directory)
    .filter((name) => name.endsWith(".rs"))
    .sort()) {
    const source = readFileSync(path.join(directory, file), "utf8").split(
      "#[cfg(test)]",
    )[0];
    const matches = [
      ...source.matchAll(
        /\.route\(\s*"([^"]+)"\s*,\s*(get|post|put|patch|delete)\(/g,
      ),
    ];
    if (matches.length !== [...source.matchAll(/\.route\(/g)].length)
      throw new Error(`Unsupported route declaration: ${file}`);
    for (const match of matches)
      routes.push({
        method: match[2].toUpperCase(),
        path: match[1],
        source: file,
      });
  }
  if (!routes.length) throw new Error("No registry routes found");
  return routes.sort(
    (a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method),
  );
}
export function renderRoutes(routes) {
  return (
    "<!-- prettier-ignore -->\n| Method | Path | Server source |\n| --- | --- | --- |\n" +
    routes
      .map(
        (route) =>
          `| ${route.method} | \`${route.path}\` | \`${route.source}\` |`,
      )
      .join("\n")
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!process.argv[2]) throw new Error("Select the exact DAL source checkout");
  const file = "src/content/docs/dal/registry-and-authentication.md";
  const source = readFileSync(file, "utf8");
  const expected = referenceBlock(
    "dal-routes",
    renderRoutes(registryRoutes(path.resolve(process.argv[2]))),
  );
  const pattern = /<!-- dal-routes:start -->[\s\S]*?<!-- dal-routes:end -->/;
  if (!pattern.test(source)) throw new Error("Missing registry route block");
  if (!source.includes(expected)) {
    if (!process.argv.includes("--write"))
      throw new Error(
        "Registry route documentation differs from the actual server",
      );
    writeFileSync(file, source.replace(pattern, expected));
  }
  console.log(
    `Verified ${registryRoutes(path.resolve(process.argv[2])).length} registry method/path contracts`,
  );
}
