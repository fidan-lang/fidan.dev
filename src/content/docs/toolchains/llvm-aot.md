---
title: "LLVM AOT"
sidebarLabel: "LLVM AOT"
description: "The optional LLVM AOT backend supports native compilation, CPU tuning and full LTO."
summary: "Native compilation through the optional LLVM toolchain."
order: 440
---

# LLVM AOT

LLVM AOT is an optional native compilation backend. The current release toolchain
uses LLVM 23.1.2 and helper 1.0.6; supported language/runtime behavior still
needs backend-specific regression coverage.

## Build example

```bash
fidan build app.fdn --backend llvm --output app
```

## Why choose LLVM

- you want LLVM optimization and full-LTO controls
- you need richer target CPU handling
- you want CPU plus feature-string tuning

## Target CPU support

LLVM currently supports:

- `generic`
- `native`
- explicit CPU names
- explicit CPU plus feature specs such as `znver4,+avx2,-avx512f`

## Optional toolchain

LLVM is the heavier optional toolchain. Manage it with:

```bash
fidan toolchain available
fidan toolchain add llvm
fidan toolchain list
```

## Typical release usage

```bash
fidan build app.fdn --backend llvm --release
```

Portable override:

```bash
fidan build app.fdn --backend llvm --release --target-cpu generic
```

## Relaunch audit branch compatibility

The published LLVM 23.1.2 toolchain and helper 1.0.6 belong to the released
compiler contract. The Dal relaunch source branch introduces internal LLVM backend protocol 8
for package-module/export identity, callable metadata and optional scalar parameter
ABI support, plus thread-local native global ownership and worker snapshots. It rejects older protocol 5/6/7 helpers.
It requires a future owner-approved compiler/helper patch pair. Do not overwrite
published 1.0.16/1.0.6 artifacts or mix an audit compiler with an older helper. The
private audit helper is test evidence, not an available public release.
