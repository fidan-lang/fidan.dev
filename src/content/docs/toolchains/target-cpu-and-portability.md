---
title: "Target CPU and portability"
sidebarLabel: "Target CPU"
description: "How Fidan chooses `generic`, `native`, or custom CPU specs, and how portability and feature strings interact with LLVM and Cranelift."
summary: "Portable by default, host-tuned when you ask for it."
order: 460
---

# Target CPU and portability

Fidan defaults to portable builds, then lets you opt into host tuning.

## Default behavior

If you do not specify a target CPU, builds stay portable:

```bash
fidan build app.fdn
```

That means the default CPU choice is effectively `generic`.

## `native`

Use host tuning explicitly:

```bash
fidan build app.fdn --target-cpu native
```

In the LLVM backend, `native` resolves to:

- the actual host CPU name
- the actual host CPU feature string

That is the correct “compile for this exact machine” behavior.

## `--release`

`--release` changes the default CPU choice to `native`, unless you override it:

```bash
fidan build app.fdn --release --target-cpu generic
```

## Custom CPU names

You can pass a backend-specific CPU name:

```bash
fidan build app.fdn --target-cpu znver4
```

## CPU plus explicit features

The LLVM backend also supports CPU plus feature toggles:

```bash
fidan build app.fdn --target-cpu znver4,+avx2,-avx512f
```

You can also override host features on top of native detection:

```bash
fidan build app.fdn --target-cpu native,-avx512f
```

## Backend notes

### LLVM

LLVM has the richer target-CPU implementation today:

- `generic`
- `native`
- custom CPU names
- custom feature strings

### Cranelift

Cranelift currently treats:

- omitted target CPU
- `native`

as the supported host-ISA path, and rejects richer custom CPU names for now.

## Recommended usage

Use `generic` when:

- the binary may run on a different machine
- you are publishing a broad release artifact

Use `native` when:

- the build is for the current machine only
- you are benchmarking
- you want the most aggressive local performance
