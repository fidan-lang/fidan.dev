---
title: "JIT"
sidebarLabel: "JIT"
description: "Fidan's Cranelift-backed JIT accelerates hot paths during `run` while preserving interpreter fallback for unsupported or cold code."
summary: "The bridge between fast iteration and native execution."
order: 420
---

# JIT

Fidan's JIT path is integrated into `fidan run`.

## Mental model

The execution story is:

1. start in the interpreter
2. count calls to hot functions
3. compile eligible hot paths with Cranelift
4. keep interpreter fallback available when needed

## Control flag

```bash
fidan run app.fdn --jit-threshold 500
```

Meaning:

- `500` = compile after roughly 500 calls
- lower numbers = compile earlier
- `0` = disable JIT for that run

## `@precompile`

Use `@precompile` to request eager compilation of a specific action:

```fidan
@precompile
action hot_inner_loop with (certain n oftype integer) returns integer {
    var sum = 0
    for i in 0..n {
        sum += i
    }
    return sum
}
```

## Why it exists

The JIT is useful when:

- the interpreter is perfect for iteration, but one region is clearly hot
- you want native execution without doing a full `build`
- you want the safety of interpreter fallback instead of committing to one codegen backend for the entire app

## Not the same as AOT

JIT:

- happens during `run`
- optimizes hot paths dynamically
- keeps interpretation available

AOT:

- happens during `build`
- emits a native binary ahead of time
- picks a backend explicitly or through `auto`
