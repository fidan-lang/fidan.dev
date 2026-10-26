import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  rmSync,
  existsSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
const root = path.resolve(import.meta.dirname, "..");
const setup = path.resolve(
  process.env.FIDAN_SETUP_ROOT || path.join(root, "../fidan-actions"),
);
test("args CI handoff rejects repository and SHA substitution before producing outputs", () => {
  const scratch = mkdtempSync(path.join(os.tmpdir(), "fidan-doc-dependency-"));
  const baseline = JSON.parse(
    readFileSync(path.join(root, "ci/compiler-candidate.json"), "utf8"),
  );
  try {
    for (const patch of [
      null,
      { args_repository: 'other-org/args"; malicious-command' },
      { args_repository: "fidan-lang/args\n" },
      { args_sha: baseline.args_sha + "\n" },
      { args_sha: "main" },
      { dal_repository: "other-org/dal" },
      { dal_sha: "main" },
      { compiler_repository: "other-org/fidan" },
      { compiler_sha: "main" },
    ]) {
      const file = path.join(scratch, "candidate.json"),
        output = path.join(scratch, "outputs");
      rmSync(output, { force: true });
      writeFileSync(file, JSON.stringify({ ...baseline, ...patch }));
      const result = spawnSync(
        process.execPath,
        ["scripts/verify-doc-dependencies.mjs", file, setup],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 20000,
          env: { ...process.env, GITHUB_OUTPUT: output },
        },
      );
      if (patch === null) {
        assert.equal(result.status, 0, result.stderr);
        assert.match(
          readFileSync(output, "utf8"),
          /args_repository=fidan-lang\/args/,
        );
      } else {
        assert.notEqual(result.status, 0, JSON.stringify(patch));
        assert.equal(
          existsSync(output),
          false,
          "invalid contracts must not influence checkout outputs",
        );
      }
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
