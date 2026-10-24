import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const cwd = fileURLToPath(new URL("../", import.meta.url));
const bin = process.env.FIDAN_BIN;
assert(bin, "Run with the exact candidate FIDAN_BIN; no PATH fallback");
mkdirSync(path.join(cwd, "target"), { recursive: true });
const root = mkdtempSync(path.join(cwd, "target", "docs-regression-"));
function check(code, mode, selected = bin) {
  writeFileSync(
    path.join(root, "case.md"),
    "```fidan check=" + mode + " wrap=none\n" + code + "\n```\n",
  );
  return spawnSync(
    process.execPath,
    [
      "scripts/check-fidan-docs.mjs",
      "--docs-root",
      root,
      "--fidan-bin",
      selected,
    ],
    { cwd, encoding: "utf8", timeout: 60000 },
  );
}
try {
  test("expected-error examples require the actual diagnostic and a failing compile", () => {
    assert.equal(check("1.5 & 2.0", "error error=E0203").status, 0);
    assert.notEqual(check("1.5 & 2.0", "error error=E0304").status, 0);
    assert.notEqual(check("print(1)", "error error=E0203").status, 0);
  });
  test("new fences must explicitly declare their validation mode", () => {
    writeFileSync(path.join(root, "case.md"), '```fidan\nprint("ok")\n```\n');
    const result = spawnSync(
      process.execPath,
      ["scripts/check-fidan-docs.mjs", "--docs-root", root, "--fidan-bin", bin],
      { cwd, encoding: "utf8", timeout: 60000 },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /explicitly declare/);
  });
  test("unknown modes fail instead of silently formatting", () => {
    const result = check('print("ok")', "rnu");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unknown.*check|Unsupported.*check/i);
  });
  test("explicit missing compiler never falls back to PATH or sibling builds", () => {
    const result = check(
      'print("ok")',
      "syntax",
      path.join(root, "missing-compiler"),
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /explicit|selected|not found|ENOENT/i);
  });
  test("compile really typechecks while run really executes assertions", () => {
    assert.notEqual(
      check('var x oftype integer = "wrong"', "compile").status,
      0,
    );
    assert.notEqual(check("assert_eq(1, 2)", "run").status, 0);
    const valid = check("assert_eq(2 + 3, 5)", "run");
    assert.equal(valid.status, 0, valid.stderr);
  });
  test(
    "published incompatible compiler is rejected clearly",
    {
      skip: process.env.FIDAN_INCOMPATIBLE_BIN
        ? false
        : "set FIDAN_INCOMPATIBLE_BIN to the released negative-control executable",
    },
    () => {
      const result = check(
        'print("ok")',
        "syntax",
        process.env.FIDAN_INCOMPATIBLE_BIN,
      );
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /incompatible compiler|candidate.*capabilit/i,
      );
    },
  );
} finally {
  // Tests are registered synchronously; cleanup is deferred until test completion.
  process.on("exit", () => rmSync(root, { recursive: true, force: true }));
}
