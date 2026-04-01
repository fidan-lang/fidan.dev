---
title: "LLVM AOT"
sidebarLabel: "LLVM AOT"
description: "LLVM AOT is the highest-ceiling native backend: richer target CPU handling, the best tuning controls, and the strongest optimization path when the optional toolchain is installed."
summary: "The aggressive native backend for serious AOT builds."
order: 440
---

# LLVM AOT

LLVM AOT is the highest-ceiling native backend in the current Fidan toolchain.

## Build example

```bash
fidan build app.fdn --backend llvm --output app
```

## Why choose LLVM

- you want the most aggressive native optimization path
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
fidan toolchain add llvm --version 1.0.0-local
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
