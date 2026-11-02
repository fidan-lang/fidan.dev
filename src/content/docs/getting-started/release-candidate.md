---
title: "Stable and candidate compatibility"
description: "Select the exact compiler, LLVM helper and packages without replacing your stable installation."
summary: "Select the exact compiler, LLVM helper and packages without replacing your stable installation."
order: 15
---

# Stable and candidate compatibility

## Two distinct contracts

The publicly released **Fidan 1.1.0** provides callable reflection/invocation,
custom decorator fixes, lazy Boolean evaluation and global verbosity. The older
1.0.16 binary does not provide those APIs.

**Logical `xor` and corrected bitwise precedence are not in stable 1.1.0.**
They require the exact compiler source selected by `ci/compiler-candidate.json`.
The candidate still reports 1.1.0 until release preparation; a version string
alone cannot establish these capabilities. Website CI verifies the actual clean
checkout identity, builds with `--locked`, and executes reflection, decorator,
XOR and precedence probes before checking examples. There is no `latest` or
public-stable fallback. See the [operator migration guide](/docs/language/expressions-and-operators#precedence-and-migration).

LLVM helper/toolchain **1.1.0** uses backend protocol **8**. AI Analysis
helper/toolchain **1.0.5** uses protocol **2**. XOR uses existing MIR/runtime
operations and remains protocol-8 wire-compatible. Published LLVM package
metadata currently permits compiler `^1.1.0`; a future 2.0 release must prepare
explicitly compatible toolchain metadata rather than bypassing that check.
Because corrected precedence can change valid programs' results, **2.0.0 is the
recommended next release boundary**, not an already published or selected version.

## Isolated source build

Use a reviewed full commit, not a moving branch or `latest`. In a separate clone, check out that exact commit and run:

```bash
cargo build --release --locked -p fidan-cli
./target/release/fidan --version
```

On Windows, run `./target/release/fidan.exe`. Invoke that path explicitly; do not overwrite the system installation. Set `FIDAN_HOME` to a dedicated test directory for candidate toolchains/packages. Build/package the matching LLVM helper from the same source with `scripts/package-toolchain.ps1`; ordinary non-LLVM builds do not require LLVM.

## Packages and editors

The `args` source requires reflection, decorator and short-circuit semantics supplied by Fidan 1.1.0 or a compatible candidate. Its unreleased compatibility sentinel intentionally prevents an accidental claim that the old public compiler supports it. Local test staging replaces the constraint only in an isolated package copy after executing the actual compiler capability test. See [args](/docs/dal/args-framework).

Normal editing with the released extension does not require AI configuration. For candidate-only language APIs, point `fidan.server.path` at the isolated candidate binary and test the matching editor source. AI commands additionally need a compatible analysis toolchain/provider. Source CI pins compiler and installer revisions explicitly; see [GitHub Actions](/docs/tools/github-actions).

## Migration notes

Boolean `and`/`or` now skip the unnecessary right operand. Remove dependencies on RHS side effects. Both operands still receive static diagnostics. The formatter canonicalizes bracket slices to colon syntax while preserving range aliases as input. Normal run output stays on stdout; optional `-v` diagnostics use stderr. Review the [operators](/docs/language/expressions-and-operators) and [CLI](/docs/tools/cli) guides before migrating automation.

## Publication gates

Published 1.1.0 compiler/helper artifacts and AI Analysis 1.0.5 are separate
from the next compiler candidate. Source version metadata alone never proves
publication. DAL production readiness and launch must precede args 0.1.0
publication; its source sentinel remains until registry and compatibility gates
are approved. Website and editor publication are separate approved operations.
Existing stable artifacts must never be overwritten to add new APIs.
