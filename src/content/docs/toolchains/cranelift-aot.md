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
- strong runtime performance with a simpler install story

## Target CPU note

Cranelift currently treats omitted target CPU and `native` as the supported host-ISA path. Rich custom CPU plus feature specifications are currently an LLVM-only strength.

## Typical usage

```bash
fidan build app.fdn --backend cranelift --release
```

This is a very practical default when you want:

- native binaries
- good speed
- a simpler toolchain setup
