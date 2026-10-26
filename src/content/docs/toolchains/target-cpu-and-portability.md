---
title: "Target CPU and portability"
sidebarLabel: "Target CPU"
description: "How Fidan chooses `generic`, `native`, or custom CPU specs, and how portability and feature strings interact with LLVM and Cranelift."
summary: "Choose a CPU policy explicitly for distribution."
order: 460
---

# Target CPU and portability

CPU tuning is backend-specific. Use an explicit `generic` policy when preparing portable distribution artifacts. This does not enable cross-OS or cross-architecture compilation.

## Default behavior

An omitted CPU uses the backend default: LLVM uses `generic`; Cranelift selects the host ISA. For reproducible portable builds, specify the policy:

```bash
fidan build app.fdn --target-cpu generic
```

`--release` selects `native` unless explicitly overridden. CPU tuning does not supply a target sysroot, cross-linker or target runtime.

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

Cranelift supports `generic`, host `native`, and recognized CPU presets/features. Unsupported CPU or feature names produce an actionable error. Its accepted preset names/features differ from LLVM; validate the chosen backend rather than assuming their vocabularies are identical.

## Recommended usage

Use `generic` when:

- the binary may run on a different machine
- you are publishing a broad release artifact

Use `native` when:

- the build is for the current machine only
- you are benchmarking
- you want the most aggressive local performance
