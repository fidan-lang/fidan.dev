// Render documentation from compiled compiler-owned metadata; never copy a signature table.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { referenceBlock } from "./reference-block.mjs";

function cell(value) {
  return String(value ?? "")
    .replaceAll("|", "&#124;")
    .replaceAll(/\r?\n/g, " ");
}
const code = (value) => "`" + cell(value).replaceAll("`", "&#96;") + "`";
function table(headers, rows) {
  return (
    "<!-- prettier-ignore -->\n" +
    [
      "| " + headers.join(" | ") + " |",
      "| " + headers.map(() => "---").join(" | ") + " |",
      ...rows.map((row) => "| " + row.join(" | ") + " |"),
    ].join("\n")
  );
}
export function blocks(catalog) {
  const result = new Map();
  for (const module of catalog.modules) {
    if (!/^[a-z][a-z0-9_]*$/.test(module.name))
      throw new Error("Unsafe module name");
    if (
      module.members.some(
        (member) =>
          typeof member.signature !== "string" || !member.signature.trim(),
      )
    )
      throw new Error(`Missing signature metadata: ${module.name}`);
    const names = module.members.flatMap((member) => member.names);
    if (
      new Set(names).size !== names.length ||
      module.exports.some((name) => !names.includes(name)) ||
      names.some((name) => !module.exports.includes(name))
    )
      throw new Error(`Metadata/export mismatch: ${module.name}`);
    result.set(
      `stdlib/${module.name}.md`,
      table(
        ["Signature", "Aliases", "Contract"],
        module.members.map((member) => [
          code(member.signature),
          member.names.slice(1).map(code).join(", ") || "—",
          cell(member.doc),
        ]),
      ),
    );
  }
  result.set(
    "reference/builtins.md",
    table(
      ["Builtin signature", "Contract"],
      catalog.builtins.map((member) => [
        code(member.signature),
        cell(member.doc),
      ]),
    ),
  );
  result.set(
    "language/variables-and-types.md",
    table(
      ["Additional type spelling", "Shape", "Meaning"],
      catalog.types.map((member) => [
        code(member.name),
        code(member.signature),
        cell(member.doc),
      ]),
    ),
  );
  result.set(
    "reference/receiver-methods.md",
    catalog.receivers
      .filter((receiver) => receiver.members.length)
      .map(
        (receiver) =>
          "## " +
          receiver.name +
          "\n\n" +
          table(
            ["Member", "Aliases", "Property form"],
            receiver.members.map((member) => [
              code(member.signature),
              member.names.slice(1).map(code).join(", ") || "—",
              member.has_field
                ? code(receiver.name + "." + member.names[0])
                : "—",
            ]),
          ),
      )
      .join("\n\n"),
  );
  return result;
}
export function synchronize(catalog, docsRoot, write = false) {
  const stale = [];
  for (const [relative, body] of blocks(catalog)) {
    const file = path.join(docsRoot, relative);
    const source = readFileSync(file, "utf8");
    const expected = referenceBlock("compiler-api", body);
    const pattern =
      /<!-- compiler-api:start -->[\s\S]*?<!-- compiler-api:end -->/;
    if (!pattern.test(source))
      throw new Error(`Missing compiler API block: ${relative}`);
    if (!source.includes(expected)) {
      stale.push(relative);
      if (write) writeFileSync(file, source.replace(pattern, expected));
    }
  }
  return stale;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const catalogPath = process.argv[2];
  if (!catalogPath)
    throw new Error("Pass the compiled documentation_catalog JSON path");
  const stale = synchronize(
    JSON.parse(readFileSync(catalogPath, "utf8")),
    path.resolve("src/content/docs"),
    process.argv.includes("--write"),
  );
  if (stale.length && !process.argv.includes("--write"))
    throw new Error(`Compiler API docs drift: ${stale.join(", ")}`);
  console.log(
    `Verified ${blocks(JSON.parse(readFileSync(catalogPath, "utf8"))).size} compiler API documentation blocks`,
  );
}
