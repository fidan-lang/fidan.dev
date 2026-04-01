---
title: "JIT"
sidebarLabel: "JIT"
description: "Use the Cranelift-backed JIT path to accelerate eligible code without committing to a full AOT build."
summary: "A bridge between the interpreter loop and native output."
order: 420
---

# JIT

Fidan's JIT path uses Cranelift to accelerate eligible code while keeping the
editing loop close to the interpreter.

## Why it exists

Some code is hot enough to benefit from native compilation, but not important
enough yet to justify a full binary build on every iteration.

## Useful CLI control

```bash
fidan run app.fdn --jit-threshold 500
```

Set the threshold lower to compile earlier, or to `0` to disable JIT for a
run where you want pure interpreted behavior.
