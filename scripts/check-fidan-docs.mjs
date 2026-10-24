import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const out = {
    docsRoot: "src/content/docs",
    fidanBin: process.env.FIDAN_BIN || "",
    verbose: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--docs-root") {
      out.docsRoot = argv[++i];
    } else if (arg === "--fidan-bin") {
      out.fidanBin = argv[++i];
    } else if (arg === "--verbose") {
      out.verbose = true;
    } else {
      throw new Error(`Unknown documentation checker option: ${arg}`);
    }
  }
  return out;
}

function resolveFidanBin(explicit, cwd) {
  if (!explicit)
    throw new Error(
      "Select the compiler candidate explicitly with --fidan-bin or FIDAN_BIN; PATH/latest fallback is disabled.",
    );
  const selected = path.resolve(cwd, explicit);
  if (!statSync(selected).isFile())
    throw new Error("Selected compiler is not a regular file");
  return selected;
}

function walkMarkdownFiles(root) {
  const results = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results.sort();
}

function parseFenceInfo(info) {
  const tokens = info.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;
  const lang = tokens[0].toLowerCase();
  if (lang !== "fidan" && lang !== "fdn") return null;
  if (!tokens.some((token) => token.startsWith("check=")))
    throw new Error(
      "Fidan fences must explicitly declare check=syntax/compile/run/error/skip",
    );
  const meta = { lang, check: "syntax", wrap: "auto" };
  for (const token of tokens.slice(1)) {
    const [key, value] = token.split("=");
    if (!value) continue;
    if (key === "check") meta.check = value;
    if (key === "wrap") meta.wrap = value;
    if (key === "error") meta.error = value;
  }
  if (!["syntax", "compile", "run", "error", "skip"].includes(meta.check))
    throw new Error(`Unknown fence check mode: ${meta.check}`);
  if (meta.check === "error" && !/^E[0-9]{4}$/.test(meta.error ?? ""))
    throw new Error("Expected-error fence requires error=E....");
  if (!["auto", "none", "main"].includes(meta.wrap))
    throw new Error(`Unknown fence wrap mode: ${meta.wrap}`);
  if (meta.check !== "syntax" && meta.wrap === "auto") meta.wrap = "none";
  return meta;
}

function extractFences(filePath) {
  const source = readFileSync(filePath, "utf8");
  const regex = /^```([^\n]*)\r?\n([\s\S]*?)^```\s*$/gm;
  const fences = [];
  let match;
  while ((match = regex.exec(source)) !== null) {
    const info = parseFenceInfo(match[1] || "");
    if (!info) continue;
    const before = source.slice(0, match.index);
    const line = before.split(/\r?\n/).length;
    fences.push({
      filePath,
      line,
      info,
      code: (match[2] || "").replace(/\s+$/, ""),
      index: fences.length + 1,
    });
  }
  return fences;
}

function indent(code) {
  return code
    .split(/\r?\n/)
    .map((line) => (line.length > 0 ? `    ${line}` : ""))
    .join("\n");
}

function buildCandidates(code, wrapMode) {
  const normalized = code.trim();
  if (wrapMode === "none") return [normalized];
  if (wrapMode === "main") {
    return [`action main returns nothing {\n${indent(normalized)}\n}`];
  }
  return [
    normalized,
    `action main returns nothing {\n${indent(normalized)}\n}`,
  ];
}

function runCommand(bin, args, cwd) {
  const result = spawnSync(bin, args, {
    cwd,
    encoding: "utf8",
    timeout: 20000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.error) result.stderr = String(result.error);
  return result;
}

function syntaxCheck(bin, filePath, cwd) {
  return runCommand(bin, ["format", filePath], cwd);
}

function compileCheck(bin, filePath, cwd) {
  return runCommand(bin, ["check", filePath, "--max-errors", "1"], cwd);
}

function runtimeCheck(bin, filePath, cwd) {
  return runCommand(bin, ["run", filePath, "--jit-threshold", "0"], cwd);
}

// Capability checks intentionally test behavior: the source candidate still has
// the old package version, so a --version check alone cannot establish support.
function verifyCapabilities(bin, tempRoot, cwd) {
  if (process.env.FIDAN_EXPECTED_VERSION) {
    const version = runCommand(bin, ["--version"], cwd);
    if (
      version.status !== 0 ||
      version.stdout.trim() !== `fidan ${process.env.FIDAN_EXPECTED_VERSION}`
    )
      throw new Error(
        "Incompatible compiler version: selected candidate contract does not match binary",
      );
  }
  const probe = path.join(tempRoot, "compiler-contract.fdn");
  writeFileSync(
    probe,
    `action increment with (certain value oftype integer) returns integer { return value + 1 }
var callback oftype action = increment
assert_eq(callback.parameters[0]["name"], "value")
assert_eq(callback.invoke([4]), 5)
action replacement with (certain value oftype integer) returns integer { return value + 2 }
action replace_action with (certain callback oftype action) returns action { return replacement }
@replace_action
action decorated with (certain value oftype integer) returns integer { return value + 1 }
assert_eq(decorated(4), 6)
`,
    "utf8",
  );
  const result = runtimeCheck(bin, probe, cwd);
  if (result.status !== 0)
    throw new Error(
      `Incompatible compiler candidate: callable reflection/invocation and decorator replacement capability check failed. Select the exact ci/compiler-candidate.json source commit.\n${result.stderr || result.stdout}`,
    );
}

function verifyFence(bin, tempRoot, cwd, fence, verbose) {
  if (fence.info.check === "skip") {
    return { ok: true, skipped: true };
  }
  const candidates = buildCandidates(fence.code, fence.info.wrap);
  const checker = {
    compile: compileCheck,
    error: compileCheck,
    run: runtimeCheck,
    syntax: syntaxCheck,
  }[fence.info.check];
  const failures = [];
  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const tempFile = path.join(
      tempRoot,
      `snippet-${Math.random().toString(36).slice(2)}.fdn`,
    );
    writeFileSync(tempFile, `${candidate}\n`, "utf8");
    const result = checker(bin, tempFile, cwd);
    if (verbose) {
      process.stdout.write(
        `checked ${path.relative(cwd, fence.filePath)}:${fence.line} with candidate ${i + 1} -> ${result.status}\n`,
      );
    }
    if (
      fence.info.check === "error"
        ? result.status !== null &&
          result.status !== 0 &&
          new RegExp(`(?:^|\\n)error\\[${fence.info.error}\\]:`).test(
            result.stderr || "",
          )
        : result.status === 0
    ) {
      return { ok: true, skipped: false };
    }
    failures.push({
      stdout: result.stdout,
      stderr: result.stderr,
      status: result.status,
      candidate,
    });
  }
  return { ok: false, failures };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const docsRoot = path.resolve(cwd, options.docsRoot);
  const fidanBin = resolveFidanBin(options.fidanBin, cwd);
  mkdirSync(path.join(cwd, "target"), { recursive: true });
  const tempRoot = mkdtempSync(path.join(cwd, "target", "fidan-docs-check-"));
  try {
    verifyCapabilities(fidanBin, tempRoot, cwd);
    const files = walkMarkdownFiles(docsRoot);
    const fences = files.flatMap(extractFences);
    let checked = 0;
    let skipped = 0;
    const modes = { syntax: 0, compile: 0, run: 0, error: 0 };
    const failures = [];
    for (const fence of fences) {
      const result = verifyFence(
        fidanBin,
        tempRoot,
        cwd,
        fence,
        options.verbose,
      );
      if (result.skipped) {
        skipped += 1;
        continue;
      }
      checked += 1;
      modes[fence.info.check] += 1;
      if (!result.ok) {
        failures.push({ fence, failures: result.failures });
      }
    }
    if (failures.length > 0) {
      for (const failure of failures) {
        const rel = path.relative(cwd, failure.fence.filePath);
        console.error(
          `Docs snippet check failed: ${rel}:${failure.fence.line} (${failure.fence.info.check})`,
        );
        const last = failure.failures.at(-1);
        if (last?.stderr) console.error(last.stderr.trim());
        else if (last?.stdout) console.error(last.stdout.trim());
        console.error("--- snippet ---");
        console.error(failure.fence.code.trim());
        console.error("--------------");
      }
      console.error(
        `Checked ${checked} Fidan code fences, skipped ${skipped}, failed ${failures.length}.`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(
      `Checked ${checked} Fidan code fences with ${path.basename(fidanBin)}. Skipped ${skipped}. Modes: ${JSON.stringify(modes)}.`,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main();

export { extractFences, compileCheck, runCommand };
