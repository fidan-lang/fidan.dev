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
    cases: "ci/doc-examples.json",
    argsRoot: process.env.FIDAN_ARGS_ROOT || "",
    receipt: "",
    backend: "interpreter",
    jitThreshold: "0",
    pages: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--docs-root") {
      out.docsRoot = argv[++i];
    } else if (arg === "--fidan-bin") {
      out.fidanBin = argv[++i];
    } else if (arg === "--args-root") {
      out.argsRoot = argv[++i];
    } else if (arg === "--receipt") {
      out.receipt = argv[++i];
    } else if (arg === "--backend") {
      out.backend = argv[++i];
    } else if (arg === "--jit-threshold") {
      out.jitThreshold = argv[++i];
    } else if (arg === "--pages") {
      out.pages = argv[++i].split(",");
    } else if (arg === "--cases") {
      out.cases = argv[++i];
    } else if (arg === "--verbose") {
      out.verbose = true;
    } else {
      throw new Error(`Unknown documentation checker option: ${arg}`);
    }
  }
  if (!["interpreter", "cranelift", "llvm"].includes(out.backend))
    throw new Error("Unsupported docs backend");
  if (!/^(0|[1-9][0-9]*)$/.test(out.jitThreshold))
    throw new Error("Invalid docs JIT threshold");
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
      "Fidan fences must explicitly declare check=compile/run/test/error/runtime-error",
    );
  const meta = { lang, check: "compile", wrap: "none" };
  const seen = new Set();
  for (const token of tokens.slice(1)) {
    const [key, value, extra] = token.split("=");
    if (
      !value ||
      extra !== undefined ||
      !["check", "wrap", "error", "context", "id", "expect"].includes(key) ||
      seen.has(key)
    )
      throw new Error(`Invalid or duplicate fence metadata: ${token}`);
    seen.add(key);
    if (key === "check") meta.check = value;
    if (key === "wrap") meta.wrap = value;
    if (key === "error") meta.error = value;
    if (key === "context") meta.context = value;
    if (key === "id") meta.id = value;
    if (key === "expect") meta.expect = value;
  }
  if (
    !["compile", "run", "test", "runtime-error", "error"].includes(meta.check)
  )
    throw new Error(`Unknown fence check mode: ${meta.check}`);
  if (meta.expect && !["run", "test"].includes(meta.check))
    throw new Error("Expected output requires run or test mode");
  if (meta.check === "error" && !/^E[0-9]{4}$/.test(meta.error ?? ""))
    throw new Error("Expected-error fence requires error=E....");
  if (meta.check === "runtime-error" && !/^R[0-9]{4}$/.test(meta.error ?? ""))
    throw new Error("Runtime-error fence requires error=R....");
  if (!["none", "main"].includes(meta.wrap))
    throw new Error(`Unknown fence wrap mode: ${meta.wrap}`);
  if (meta.error && !["error", "runtime-error"].includes(meta.check))
    throw new Error("Diagnostic code requires an expected-error mode");
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
    let expected;
    if (info.expect) {
      if (!["stdout", "stderr"].includes(info.expect))
        throw new Error("Unknown expected output channel");
      const output =
        /^\s*```text(?: expect=(?:stdout|stderr))?\r?\n([\s\S]*?)^```/m.exec(
          source.slice(regex.lastIndex),
        );
      if (!output || output.index !== 0)
        throw new Error(`Expected adjacent text output: ${filePath}:${line}`);
      expected = output[1].replaceAll("\r\n", "\n");
    }
    fences.push({
      filePath,
      expected,
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
  throw new Error(`Unknown context wrapper: ${wrapMode}`);
}

function runCommand(bin, args, cwd, options = {}) {
  const result = spawnSync(bin, args, {
    cwd,
    encoding: "utf8",
    timeout: 20000,
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
    input: options.input ?? "",
    env: {
      ...process.env,
      ...options.env,
      FIDAN_HOME: options.toolchainHome ?? path.join(cwd, ".fidan"),
    },
  });
  if (result.error) result.stderr = String(result.error);
  return result;
}

function compileCheck(bin, filePath, cwd) {
  return runCommand(bin, ["check", filePath, "--max-errors", "1"], cwd);
}

function runtimeCheck(bin, filePath, cwd, scenario = {}) {
  if (scenario.backend && scenario.backend !== "interpreter") {
    const executable = path.join(
      cwd,
      process.platform === "win32" ? "example.exe" : "example",
    );
    const args = [
      "build",
      filePath,
      "--backend",
      scenario.backend,
      "--output",
      executable,
    ];
    if (scenario.backend === "llvm") args.push("--lto", "full");
    const built = runCommand(bin, args, cwd, {
      toolchainHome: process.env.FIDAN_HOME,
    });
    if (built.status !== 0) return built;
    return runCommand(executable, scenario.argv ?? [], cwd, scenario);
  }
  return runCommand(
    bin,
    [
      "run",
      filePath,
      "--jit-threshold",
      scenario.jitThreshold ?? "0",
      "--",
      ...(scenario.argv ?? []),
    ],
    cwd,
    scenario,
  );
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

function applyContext(code, context, root) {
  for (const [relative, text] of Object.entries(context.files ?? {})) {
    if (
      !relative ||
      path.isAbsolute(relative) ||
      relative.includes("\\") ||
      relative
        .split("/")
        .some(
          (part) =>
            !part || part === "." || part === ".." || part.includes(":"),
        )
    )
      throw new Error("Unsafe documentation fixture path");
    const file = path.join(root, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  return [context.before ?? "", code, context.after ?? ""].join("\n");
}

function verifyFence(bin, tempRoot, cwd, fence, verbose, cases, options) {
  const scenario = {
    ...cases.examples[fence.info.id],
    backend: options.backend,
    jitThreshold: options.jitThreshold,
  };
  if (fence.info.id && !Object.hasOwn(cases.examples, fence.info.id))
    throw new Error(`Unknown example id: ${fence.info.id}`);
  const context = cases.contexts[fence.info.context] ?? {};
  if (fence.info.context && !Object.hasOwn(cases.contexts, fence.info.context))
    throw new Error(`Unknown context: ${fence.info.context}`);
  const isolated = mkdtempSync(path.join(tempRoot, "example-"));
  const code = applyContext(fence.code, context, isolated);
  const candidates = buildCandidates(code, fence.info.wrap);
  const checker = {
    compile: compileCheck,
    error: compileCheck,
    run: runtimeCheck,
    "runtime-error": runtimeCheck,
    test: (bin, file, cwd) => runCommand(bin, ["test", file], cwd),
  }[fence.info.check];
  const failures = [];
  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const tempFile = path.join(
      isolated,
      `snippet-${Math.random().toString(36).slice(2)}.fdn`,
    );
    writeFileSync(tempFile, `${candidate}\n`, "utf8");
    const result = checker(bin, tempFile, isolated, scenario);
    if (verbose) {
      process.stdout.write(
        `checked ${path.relative(cwd, fence.filePath)}:${fence.line} with candidate ${i + 1} -> ${result.status}\n`,
      );
    }
    if (
      fence.info.check === "runtime-error"
        ? result.status !== null &&
          result.status !== 0 &&
          new RegExp(`(?:^|\\n)error\\s+(?:\\[)?${fence.info.error}\\b`).test(
            result.stderr || "",
          )
        : fence.info.check === "error"
          ? result.status !== null &&
            result.status !== 0 &&
            new RegExp(`(?:^|\\n)error\\[${fence.info.error}\\]:`).test(
              result.stderr || "",
            )
          : result.status === 0
    ) {
      const observed = (result[fence.info.expect] ?? "").replaceAll(
        "\r\n",
        "\n",
      );
      if (fence.expected !== undefined && observed !== fence.expected) {
        return {
          ok: false,
          failures: [
            {
              stderr: `Documented ${fence.info.expect} differs. Expected ${JSON.stringify(fence.expected)}, got ${JSON.stringify(observed)}`,
              candidate,
            },
          ],
        };
      }
      return { ok: true };
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

function walkSourceFiles(root) {
  const result = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.isSymbolicLink())
      throw new Error("Package fixture must not contain symlinks");
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...walkSourceFiles(file));
    else if (entry.isFile() && file.endsWith(".fdn")) result.push(file);
  }
  return result.sort();
}
function validateCases(cases) {
  for (const name of ["contexts", "examples"]) {
    if (
      !cases[name] ||
      typeof cases[name] !== "object" ||
      Array.isArray(cases[name])
    )
      throw new Error("Invalid documentation case catalog");
  }
  for (const context of Object.values(cases.contexts)) {
    if (
      !context ||
      typeof context !== "object" ||
      Array.isArray(context) ||
      Object.keys(context).some(
        (key) => !["before", "after", "files", "package"].includes(key),
      )
    )
      throw new Error("Invalid context fields");
    if (context.package !== undefined && context.package !== "args")
      throw new Error("Unknown package fixture");
    for (const key of ["before", "after"])
      if (context[key] !== undefined && typeof context[key] !== "string")
        throw new Error("Invalid context text");
    if (
      context.files !== undefined &&
      (!context.files ||
        typeof context.files !== "object" ||
        Array.isArray(context.files) ||
        Object.values(context.files).some((value) => typeof value !== "string"))
    )
      throw new Error("Invalid context files");
  }
  for (const example of Object.values(cases.examples)) {
    if (
      !example ||
      typeof example !== "object" ||
      Array.isArray(example) ||
      Object.keys(example).some(
        (key) => !["argv", "input", "env"].includes(key),
      )
    )
      throw new Error("Invalid example fields");
    if (
      example.argv !== undefined &&
      (!Array.isArray(example.argv) ||
        example.argv.some((value) => typeof value !== "string"))
    )
      throw new Error("Invalid example argv");
    if (example.input !== undefined && typeof example.input !== "string")
      throw new Error("Invalid example input");
    if (
      example.env !== undefined &&
      (!example.env ||
        typeof example.env !== "object" ||
        Array.isArray(example.env) ||
        Object.values(example.env).some((value) => typeof value !== "string"))
    )
      throw new Error("Invalid example environment");
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const docsRoot = path.resolve(cwd, options.docsRoot);
  const fidanBin = resolveFidanBin(options.fidanBin, cwd);
  mkdirSync(path.join(cwd, "target"), { recursive: true });
  const tempRoot = mkdtempSync(path.join(cwd, "target", "fidan-docs-check-"));
  try {
    verifyCapabilities(fidanBin, tempRoot, tempRoot);
    const cases = JSON.parse(
      readFileSync(path.resolve(cwd, options.cases), "utf8"),
    );
    validateCases(cases);
    let files = walkMarkdownFiles(docsRoot);
    if (options.pages.length) {
      for (const page of options.pages)
        if (
          !files.some(
            (file) =>
              path.relative(docsRoot, file).split(path.sep).join("/") === page,
          )
        )
          throw new Error(`Unknown requested documentation page: ${page}`);
      files = files.filter((file) =>
        options.pages.includes(
          path.relative(docsRoot, file).split(path.sep).join("/"),
        ),
      );
    }
    const fences = files.flatMap(extractFences);
    for (const [name, context] of Object.entries(cases.contexts)) {
      if (
        context.package === "args" &&
        fences.some((fence) => fence.info.context === name)
      ) {
        if (!options.argsRoot)
          throw new Error(
            "args examples require --args-root / FIDAN_ARGS_ROOT pointing to the exact reviewed package source",
          );
        const source = path.resolve(cwd, options.argsRoot, "src");
        context.files = Object.fromEntries(
          walkSourceFiles(source).map((file) => [
            "args/" + path.relative(source, file).split(path.sep).join("/"),
            readFileSync(file, "utf8"),
          ]),
        );
        if (!Object.hasOwn(context.files, "args/init.fdn"))
          throw new Error("Selected args source has no canonical entry");
      }
    }
    let checked = 0;
    const modes = {
      compile: 0,
      run: 0,
      test: 0,
      "runtime-error": 0,
      error: 0,
    };
    const failures = [];
    const receipt = [];
    for (const fence of fences) {
      const result = verifyFence(
        fidanBin,
        tempRoot,
        cwd,
        fence,
        options.verbose,
        cases,
        options,
      );
      receipt.push({
        file: path.relative(cwd, fence.filePath).split(path.sep).join("/"),
        line: fence.line,
        mode: fence.info.check,
        context: fence.info.context ?? null,
        outputChecked: fence.expected !== undefined,
        passed: result.ok,
      });
      checked += 1;
      modes[fence.info.check] += 1;
      if (!result.ok) {
        failures.push({ fence, failures: result.failures });
      }
    }
    if (options.receipt)
      writeFileSync(
        path.resolve(cwd, options.receipt),
        JSON.stringify(
          {
            compiler: fidanBin,
            backend: options.backend,
            jitThreshold: options.jitThreshold,
            examples: receipt,
          },
          null,
          2,
        ) + "\n",
      );
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
        `Checked ${checked} Fidan code fences, failed ${failures.length}.`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(
      `Checked ${checked} Fidan code fences with ${path.basename(fidanBin)}. Modes: ${JSON.stringify(modes)}.`,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main();

export { extractFences, compileCheck, runCommand, applyContext, validateCases };
