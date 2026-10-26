---
title: "Cranelift AOT"
sidebarLabel: "Cranelift AOT"
description: "Cranelift AOT builds native binaries quickly and is the lighter native backend when you want practical AOT output without requiring the optional LLVM toolchain."
summary: "The fast native backend for development and plenty of real-world shipping."
order: 430
---

# Cranelift AOT

Cranelift AOT is the lighter native backend.

## Build example

```bash
fidan build app.fdn --backend cranelift --output app
```

## Why choose Cranelift

- fast native compile times
- no optional external LLVM toolchain required
- a native backend integrated into the standard compiler build

## Target CPU note

Cranelift supports host `native`, `generic`, and recognized CPU presets/features. An omitted CPU selects the host ISA. Specify `--target-cpu generic` for distribution; unsupported presets/features are errors. CPU tuning is not cross-OS compilation. See [target CPU](/docs/toolchains/target-cpu-and-portability).

## Typical usage

```bash
fidan build app.fdn --backend cranelift --release
```

This is a very practical default when you want:

- native binaries
- good speed
- a simpler toolchain setup
