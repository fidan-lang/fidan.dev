import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkDocumentation } from "./check-documentation.mjs";
import { blocks, synchronize } from "./sync-api-reference.mjs";
import {
  catalog as cliCatalog,
  render as renderCli,
} from "./sync-cli-reference.mjs";
const header =
  '---\ntitle: "Test"\ndescription: "Test"\nsummary: "Test"\norder: 1\n---\n';
test("real renderer anchors and routes are validated, not guessed from source text", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "fidan-doc-links-"));
  try {
    writeFileSync(
      path.join(root, "index.md"),
      header + "# Page\n\n## Callable `.invoke()`\n\n[valid](#callable-invoke)",
    );
    assert.equal(checkDocumentation(root, root).pages, 1);
    writeFileSync(
      path.join(root, "index.md"),
      header + "# Page\n\n[wrong](/docs/missing)",
    );
    assert.throws(
      () => checkDocumentation(root, root),
      /Missing documentation route/,
    );
    writeFileSync(
      path.join(root, "index.md"),
      header + "# Page\n\n[wrong](#missing)",
    );
    assert.throws(
      () => checkDocumentation(root, root),
      /Missing documentation anchor/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test("API docs fail closed for missing aliases, signatures and managed blocks", () => {
  const catalog = {
    modules: [
      {
        name: "example",
        exports: ["canonical", "alias"],
        members: [
          {
            names: ["canonical", "alias"],
            signature: "canonical(value)",
            doc: "Contract",
          },
        ],
      },
    ],
    builtins: [],
    types: [],
    receivers: [],
  };
  const root = mkdtempSync(path.join(os.tmpdir(), "fidan-doc-api-"));
  try {
    for (const [relative] of blocks(catalog)) {
      const file = path.join(root, relative);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(
        file,
        "<!-- compiler-api:start -->\n<!-- compiler-api:end -->",
      );
    }
    assert(synchronize(catalog, root).length > 0);
    synchronize(catalog, root, true);
    assert.deepEqual(synchronize(catalog, root), []);
    catalog.modules[0].members[0].signature = "canonical(value, other)";
    assert.deepEqual(synchronize(catalog, root), ["stdlib/example.md"]);
    catalog.modules[0].members[0].names.pop();
    assert.throws(() => blocks(catalog), /Metadata\/export mismatch/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("managed references remain byte-stable through Markdown formatting", async () => {
  const { format } = await import("prettier");
  const { referenceBlock } = await import("./reference-block.mjs");
  for (const body of [
    "<!-- prettier-ignore -->\n| API | Meaning |\n| --- | --- |\n| `call()` | Contract |",
    "## fidan\n\n```text\nUsage: fidan [OPTIONS] <COMMAND>\n```",
    renderCli(cliCatalog(process.env.FIDAN_BIN)),
  ]) {
    const block = referenceBlock("compiler-api", body);
    const formatted = await format("# Reference\n\n" + block + "\n", {
      parser: "markdown",
    });
    assert(formatted.includes(block), formatted);
  }
});

test("real CLI reference traverses every command family instead of the first help row", () => {
  assert(process.env.FIDAN_BIN, "Select the actual compiler candidate");
  const commands = cliCatalog(process.env.FIDAN_BIN).map(
    (page) => page.command,
  );
  for (const command of [
    "fidan run",
    "fidan build",
    "fidan exec",
    "fidan dal search",
    "fidan self current",
    "fidan toolchain add",
  ])
    assert(commands.includes(command), `Missing command: ${command}`);
  assert(!commands.some((command) => command.endsWith(" help")));
});
