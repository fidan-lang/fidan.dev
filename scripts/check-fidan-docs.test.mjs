import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { loadTypeScript } from "./load-typescript.mjs";
import { fileURLToPath } from "node:url";
import {
  applyContext,
  validateCases,
  extractFences,
} from "./check-fidan-docs.mjs";
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
  test("unknown page selections cannot produce a vacuous backend pass", () => {
    const result = spawnSync(
      process.execPath,
      [
        "scripts/check-fidan-docs.mjs",
        "--docs-root",
        root,
        "--fidan-bin",
        bin,
        "--pages",
        "missing.md",
      ],
      { cwd, encoding: "utf8", timeout: 60000 },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unknown requested documentation page/);
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
  test("format-only, skipped and mistyped metadata cannot bypass checking", () => {
    for (const mode of [
      "skip",
      "syntax",
      "run chec=run",
      "run check=compile",
    ]) {
      assert.notEqual(check("assert_eq(1, 2)", mode).status, 0, mode);
    }
  });
  test("unknown modes fail instead of silently formatting", () => {
    const result = check('print("ok")', "rnu");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unknown.*check|Unsupported.*check/i);
  });
  test("explicit missing compiler never falls back to PATH or sibling builds", () => {
    const result = check(
      'print("ok")',
      "compile",
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
  test("output examples compare both application streams instead of only the exit code", () => {
    const file = path.join(root, "case.md");
    for (const [channel, builtin] of [
      ["stdout", "print"],
      ["stderr", "eprint"],
    ]) {
      function execute(expected) {
        writeFileSync(
          file,
          "```fidan check=run expect=" +
            channel +
            "\n" +
            builtin +
            '("observed")\n```\n\n```text\n' +
            expected +
            "\n```\n",
        );
        return spawnSync(
          process.execPath,
          [
            "scripts/check-fidan-docs.mjs",
            "--docs-root",
            root,
            "--fidan-bin",
            bin,
          ],
          { cwd, encoding: "utf8", timeout: 60000 },
        );
      }
      assert.equal(execute("observed").status, 0);
      const wrong = execute("invented");
      assert.notEqual(wrong.status, 0);
      assert(
        wrong.stderr.includes(`Documented ${channel} differs`),
        wrong.stderr,
      );
    }
  });
  test("control-flow tutorials verify output and side effects on the selected backend", () => {
    const samples = extractFences(
      path.join(cwd, "src/content/docs/language/control-flow.md"),
    ).filter((fence) => fence.info.check === "run");
    assert(samples.some((fence) => fence.info.id === "short-circuit-effects"));
    // This focused native check selects runnable tutorials. The mandatory full
    // catalog check still verifies every mode, including expected diagnostics.
    const markdown = samples
      .map((sample) => {
        const metadata = Object.entries(sample.info)
          .filter(([key]) => key !== "lang")
          .map(([key, value]) => `${key}=${value}`)
          .join(" ");
        return (
          "```fidan " +
          metadata +
          "\n" +
          sample.code +
          "\n```\n" +
          (sample.expected === undefined
            ? ""
            : "\n```text\n" + sample.expected + "```\n")
        );
      })
      .join("\n");
    writeFileSync(path.join(root, "case.md"), markdown);
    const result = spawnSync(
      process.execPath,
      [
        "scripts/check-fidan-docs.mjs",
        "--docs-root",
        root,
        "--fidan-bin",
        bin,
        "--backend",
        process.env.FIDAN_DOC_TEST_BACKEND ?? "interpreter",
      ],
      { cwd, encoding: "utf8", timeout: 60000 },
    );
    assert.equal(result.status, 0, result.stderr);
    assert(
      result.stdout.includes(`Checked ${samples.length} Fidan code fences`),
      result.stdout,
    );
  });
  test("inline test examples execute test bodies", () => {
    assert.equal(check('test "works" { assert_eq(2, 2) }', "test").status, 0);
    assert.notEqual(
      check('test "fails" { assert_eq(2, 3) }', "test").status,
      0,
    );
  });
  test("runtime-error cases require actual failure and the requested runtime diagnostic", () => {
    assert.equal(
      check('panic("expected")', "runtime-error error=R1002").status,
      0,
    );
    assert.notEqual(
      check('panic("wrong code")', "runtime-error error=R2001").status,
      0,
    );
    assert.notEqual(
      check('print("success")', "runtime-error error=R1002").status,
      0,
    );
  });
  test("context files cannot escape their isolated example", () => {
    for (const name of [
      "../escape.fdn",
      "C:/escape.fdn",
      "/escape",
      "a/../../escape",
      "a\\b",
    ]) {
      assert.throws(
        () => applyContext("", { files: { [name]: "wrong" } }, root),
        /Unsafe/,
      );
    }
    assert.equal(
      applyContext("assert_eq(value, 1)", { before: "var value = 1" }, root),
      "var value = 1\nassert_eq(value, 1)\n",
    );
  });
  test("case catalogs reject malformed argv and context data", () => {
    assert.throws(
      () =>
        validateCases({ contexts: {}, examples: { bad: { argv: "--help" } } }),
      /argv/,
    );
    assert.throws(
      () =>
        validateCases({
          contexts: { bad: { files: { "a.fdn": 42 } } },
          examples: {},
        }),
      /files/,
    );
    assert.throws(
      () =>
        validateCases({
          contexts: { bad: { package: "unknown" } },
          examples: {},
        }),
      /Unknown/,
    );
    writeFileSync(
      path.join(root, "invalid.md"),
      "```fidan check=compile expect=stdout\nprint(1)\n```",
    );
    assert.throws(
      () => extractFences(path.join(root, "invalid.md")),
      /requires run/,
    );
    rmSync(path.join(root, "invalid.md"));
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
        "compile",
        process.env.FIDAN_INCOMPATIBLE_BIN,
      );
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        /incompatible compiler|candidate.*capabilit/i,
      );
    },
  );
  test("landing-page concurrency program executes with the actual candidate", () => {
    const { heroSnippet } = loadTypeScript(
      new URL("../src/lib/data/site.ts", import.meta.url),
    );
    const file = path.join(root, "landing.fdn");
    writeFileSync(file, heroSnippet);
    for (const threshold of ["0", "1"]) {
      const result = spawnSync(
        bin,
        ["run", file, "--jit-threshold", threshold],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 30000,
          windowsHide: true,
          env: { ...process.env, FIDAN_HOME: path.join(root, ".fidan") },
        },
      );
      assert.equal(result.status, 0, result.error || result.stderr);
      const lines = result.stdout.trim().split(/\r?\n/);
      assert.deepEqual(lines.slice(0, 2).sort(), [
        "native work",
        "real threads",
      ]);
      assert.deepEqual(lines.slice(2), [
        "cooperative scheduling",
        "Compiler-grounded tooling.",
      ]);
    }
  });
} finally {
  // Tests are registered synchronously; cleanup is deferred until test completion.
  process.on("exit", () => rmSync(root, { recursive: true, force: true }));
}
