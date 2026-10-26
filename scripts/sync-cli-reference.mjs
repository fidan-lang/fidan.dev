import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { referenceBlock } from "./reference-block.mjs";
export function catalog(binary) {
  const pages = [];
  function visit(args) {
    const result = spawnSync(binary, [...args, "--help"], {
      encoding: "utf8",
      timeout: 20000,
      windowsHide: true,
      env: { ...process.env, NO_COLOR: "1" },
    });
    if (result.error || result.status !== 0)
      throw new Error(`CLI help failed: ${args.join(" ")}`);
    const help = result.stdout
      .replaceAll("\r\n", "\n")
      .replaceAll("fidan.exe", "fidan")
      .replace(/[ \t]+$/gm, "")
      .trim();
    pages.push({ command: ["fidan", ...args].join(" "), help });
    const commands = help
      .split("\n\n")
      .find((section) => section.startsWith("Commands:\n"));
    for (const match of (commands ?? "").matchAll(/^  ([a-z][a-z-]*)\s+/gm))
      if (match[1] !== "help") visit([...args, match[1]]);
  }
  visit([]);
  return pages;
}
export function render(pages) {
  return pages
    .map((item) => `## ${item.command}\n\n\`\`\`text\n${item.help}\n\`\`\``)
    .join("\n\n");
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (!process.argv[2]) throw new Error("Select the actual compiler binary");
  const file = "src/content/docs/reference/cli-options.md";
  const source = readFileSync(file, "utf8");
  const expected = referenceBlock(
    "cli-help",
    render(catalog(path.resolve(process.argv[2]))),
  );
  const pattern = /<!-- cli-help:start -->[\s\S]*?<!-- cli-help:end -->/;
  if (!pattern.test(source)) throw new Error("Missing CLI reference block");
  if (!source.includes(expected)) {
    if (!process.argv.includes("--write"))
      throw new Error(
        "CLI reference differs from the actual compiler --help contract",
      );
    writeFileSync(file, source.replace(pattern, expected));
  }
  console.log("Verified complete CLI help tree");
}
