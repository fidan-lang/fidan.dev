---
title: "Troubleshooting"
description: "Diagnose compiler selection, packages, native linking and editor problems with bounded evidence."
summary: "Diagnose compiler selection, packages, native linking and editor problems with bounded evidence."
order: 370
---

# Troubleshooting

## Confirm the binary and source contract

Check `fidan --version`, then the executable resolved by your shell (`Get-Command fidan` on PowerShell, `command -v fidan` on Unix). For candidate-only behavior, invoke the isolated build path directly and compare its checked-out source SHA with the coordinated candidate contract. A version string alone cannot distinguish old published 1.0.16 from a source checkout retaining that package version.

Use `fidan -v check app.fdn` for lifecycle information, `-vv` for phase/resolver details and `-vvv` for targeted tracing. Put these flags before the source file. Logs go to stderr; program stdout and JSON-RPC stay separate. Existing errors and warnings remain visible without verbosity. `--trace full` is a runtime stack-report choice, not the operational logging level.

## Source diagnostics

`fidan explain --diagnostic E0203` explains an operator/type error deterministically. Use `fidan explain app.fdn --line 10` for source context. AI source explanation additionally needs the analysis helper/provider; `--diagnostic` cannot be combined with `--ai`. Start with `check --max-errors 0` to see all supported diagnostics, then address the first cause rather than suppressing downstream errors blindly.

Both operands of a short-circuit expression are statically checked. Runtime guards can prevent a dynamic invalid RHS from executing; they do not make an undefined name or known invalid type compile. String lengths and indices count Unicode scalar values, so displayed grapheme clusters can occupy more than one index.

## Package failures

Confirm registry identity, package spelling and the compiler SemVer constraint. Hyphens in a package name become underscores in its import module. New resolutions exclude yanked versions. A checksum/cache mismatch is an error; inspect the trusted registry/archive and use a deliberate `--force` repair instead of disabling checksum verification. Tokens must belong to the selected registry and possess the required scope/ownership.

The new args framework requires the candidate compiler. Its checked-in unreleased sentinel is intentional and must not be edited to claim compatibility with the old public binary. Local package staging probes the actual compiler and changes only a disposable copy.

## Native backend/link errors

Use `fidan toolchain list` and select `--backend cranelift` or `--backend llvm` explicitly to isolate selection problems. LLVM compilation needs a matching helper protocol, upstream LLVM toolchain and platform linker/runtime libraries. A published older helper cannot satisfy protocol 8. Full LLVM LTO requires the matching LLVM tools, independently of Rust's own Cargo release LTO settings.

`--target-cpu` tunes the current target; it is not a cross-OS `--target` flag. Explicit `generic` avoids host feature assumptions for distribution. An unavailable native dependency in `@extern` is a real link/load error; examples requiring private optional FFI artifacts must not be presented as standalone portable programs.

## Editor diagnostics

Restart the language server after changing `fidan.server.path`. Normal editing requires no AI credentials. Check the extension output channel for stderr lifecycle logs; protocol tracing is a separate setting. Missing imports are errors even if they are also unused. UTF-16 editor positions are translated by the LSP; do not work around non-ASCII source positions by changing the source text.

## Reporting a failure

Include the exact candidate commit/version, OS/architecture, selected backend, minimal source and exact command. Capture stdout and stderr separately. Review logs before sharing: operational diagnostics redact common credentials, but source snippets, explicit IR dumps, program output and local paths may themselves contain private information. Never include real API tokens, signed download URLs or signing keys in a bug report.
