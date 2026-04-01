---
title: "LLVM AOT"
sidebarLabel: "LLVM AOT"
description: "Use the LLVM backend for the most aggressive native optimization path and deeper target-CPU tuning control."
summary: "The highest-ceiling native backend in the current toolchain."
order: 440
---

# LLVM AOT

LLVM AOT is the highest-ceiling native backend in the current Fidan toolchain.

## Build example

```bash
fidan build app.fdn --backend llvm -o app
```

## Native CPU tuning

LLVM currently supports:

- `generic`
- `native`
- explicit CPU names
- explicit CPU plus feature specs such as `znver4,+avx2,-avx512f`
