---
title: "LLVM AOT"
sidebarLabel: "LLVM AOT"
description: "The optional LLVM AOT backend supports native compilation, CPU tuning and full LTO."
summary: "Native compilation through the optional LLVM toolchain."
order: 440
---

# LLVM AOT

LLVM AOT is an optional native compilation backend. Fidan **1.1.0** requires
LLVM toolchain/helper **1.1.0**, backend protocol **8**, using upstream LLVM
**23.1.2**. The historical helper 1.0.6 uses protocol 5 and belongs to Fidan
1.0.16. Install only a compatible package after its distribution is available;
source metadata alone does not establish that publication has completed.

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

## Compiler/helper compatibility

Protocol 8 preserves package-module/export identity, callable metadata, optional
scalar parameters and thread-local native globals/worker snapshots. Fidan 1.1.0
rejects protocol-5/6/7 helpers. Keep compiler and LLVM helper 1.1.0 together;
existing published 1.0.16/1.0.6 artifacts remain unchanged.

The independent AI Analysis toolchain **1.0.5** retains helper protocol **2**.
It is optional and does not provide the LLVM backend. DAL production launch,
args publication, website deployment and editor publication remain separate gates.
