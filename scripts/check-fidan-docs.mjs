import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
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
    }
  }
  return out;
}

function candidateBins(cwd) {
  const names =
    process.platform === "win32" ? ["fidan.exe", "fidan"] : ["fidan"];
  const candidates = [];
  if (process.env.FIDAN_BIN) candidates.push(process.env.FIDAN_BIN);
  for (const name of names) candidates.push(name);
  const sibling = path.resolve(cwd, "..", "fidan");
  for (const name of names) {
    candidates.push(path.join(sibling, "target", "debug", name));
    candidates.push(path.join(sibling, "target", "release", name));
  }
  const localMainRepo = path.resolve(cwd, "..", "..", "Rust", "Fidan");
  for (const name of names) {
    candidates.push(path.join(localMainRepo, "target", "debug", name));
    candidates.push(path.join(localMainRepo, "target", "release", name));
  }
  return candidates;
}

function resolveFidanBin(explicit, cwd) {
  const candidates = explicit
    ? [explicit, ...candidateBins(cwd)]
    : candidateBins(cwd);
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.includes(path.sep)) {
      try {
        if (statSync(candidate).isFile()) return candidate;
      } catch {
        // ignore
      }
    } else {
      const probe = spawnSync(candidate, ["--help"], { encoding: "utf8" });
      if (probe.status === 0 || probe.status === 2) return candidate;
    }
  }
  throw new Error(
    "Unable to resolve a Fidan CLI binary. Pass --fidan-bin or set FIDAN_BIN.",
  );
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
  const meta = { lang, check: "syntax", wrap: "auto" };
  for (const token of tokens.slice(1)) {
    const [key, value] = token.split("=");
    if (!value) continue;
    if (key === "check") meta.check = value;
    if (key === "wrap") meta.wrap = value;
  }
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
  return spawnSync(bin, args, { cwd, encoding: "utf8" });
}

function syntaxCheck(bin, filePath, cwd) {
  return runCommand(bin, ["format", filePath], cwd);
}

function compileCheck(bin, filePath, cwd) {
  return runCommand(bin, ["check", filePath, "--max-errors", "1"], cwd);
}

function verifyFence(bin, tempRoot, cwd, fence, verbose) {
  if (fence.info.check === "skip") {
    return { ok: true, skipped: true };
  }
  const candidates = buildCandidates(fence.code, fence.info.wrap);
  const checker = fence.info.check === "compile" ? compileCheck : syntaxCheck;
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
    if (result.status === 0) {
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
  const tempRoot = mkdtempSync(path.join(tmpdir(), "fidan-docs-check-"));
  mkdirSync(tempRoot, { recursive: true });
  try {
    const files = walkMarkdownFiles(docsRoot);
    const fences = files.flatMap(extractFences);
    let checked = 0;
    let skipped = 0;
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
      process.exit(1);
    }
    console.log(
      `Checked ${checked} Fidan code fences with ${path.basename(fidanBin)}. Skipped ${skipped}.`,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
