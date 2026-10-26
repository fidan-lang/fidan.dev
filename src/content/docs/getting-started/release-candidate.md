---
title: "Stable and candidate compatibility"
description: "Select the exact compiler, LLVM helper and packages without replacing your stable installation."
summary: "Select the exact compiler, LLVM helper and packages without replacing your stable installation."
order: 15
---

# Stable and candidate compatibility

## Two distinct contracts

The publicly released **Fidan 1.0.16** remains the stable Windows hotfix release. The upcoming source candidate adds callable metadata/invocation, custom decorator fixes, lazy Boolean evaluation and global verbosity. Do not install `latest` and assume those APIs exist.

The candidate source currently still reports package version `1.0.16`; therefore `--version` alone cannot establish compatibility. Website CI selects the full immutable compiler SHA in `ci/compiler-candidate.json`, verifies the actual clean checkout identity, builds with `--locked`, and runs a behavioral reflection/decorator probe before checking examples. The recorded SHA must be remotely available before coordinated GitHub CI can fetch it.

The proposed coordinated version overlay is recorded in the compiler's `config/release-candidate.json`. The owner has selected the 1.1.0 stable target; release publication is not yet approved or performed. The upcoming LLVM helper uses **backend protocol 8**; a previously published helper is not interchangeable merely because its package version looks familiar.

## Isolated source build

Use a reviewed full commit, not a moving branch or `latest`. In a separate clone, check out that exact commit and run:

```bash
cargo build --release --locked -p fidan-cli
./target/release/fidan --version
```

On Windows, run `./target/release/fidan.exe`. Invoke that path explicitly; do not overwrite the system installation. Set `FIDAN_HOME` to a dedicated test directory for candidate toolchains/packages. Build/package the matching LLVM helper from the same source with `scripts/package-toolchain.ps1`; ordinary non-LLVM builds do not require LLVM.

## Packages and editors

The new `args` source requires the candidate's reflection, decorator and short-circuit semantics. Its unreleased compatibility sentinel intentionally prevents an accidental claim that the old public compiler supports it. Local test staging replaces the constraint only in an isolated package copy after executing the actual compiler capability test. See [args](/docs/dal/args-framework).

Normal editing with the released extension does not require AI configuration. For candidate-only language APIs, point `fidan.server.path` at the isolated candidate binary and test the matching editor source. AI commands additionally need a compatible analysis toolchain/provider. Source CI pins compiler and installer revisions explicitly; see [GitHub Actions](/docs/tools/github-actions).

## Migration notes

Boolean `and`/`or` now skip the unnecessary right operand. Remove dependencies on RHS side effects. Both operands still receive static diagnostics. The formatter canonicalizes bracket slices to colon syntax while preserving range aliases as input. Normal run output stays on stdout; optional `-v` diagnostics use stderr. Review the [operators](/docs/language/expressions-and-operators) and [CLI](/docs/tools/cli) guides before migrating automation.

## Planned stable release order

The selected target is **Fidan 1.1.0 stable**, **LLVM helper 1.1.0** (protocol 8)
and **args 0.1.0**, with no intermediate public RC. Engineering/merge gates come
first, then stable compiler/helper artifacts, production DAL readiness and launch,
args publication, and the approved editor/website/distribution updates.
The args source sentinel remains until the compiler and registry gates are met.
Source-candidate CI still expects the actual reported source version; preparation
applies the stable versions only in an isolated release copy. Existing stable
artifacts are never overwritten to add new APIs.
