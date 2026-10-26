---
title: "Release builds"
sidebarLabel: "Release builds"
description: "What `--release` means in Fidan, which flags it implies, and when to override parts of the policy for portability or debugging."
summary: "Release is a policy bundle, not just `O3`."
order: 450
---

# Release builds

In Fidan, `--release` is not just a thin alias for a single optimization level.

## What `--release` means

When you pass `--release`, Fidan applies an aggressive performance policy **unless** you override parts of it explicitly.

Default implied behavior:

- `--opt O3`
- `--lto full`
- `--strip all`
- `--target-cpu native`

## Explicit overrides still win

If you need a different combination, your explicit flags win over the preset:

```bash
fidan build app.fdn --release --target-cpu generic
fidan build app.fdn --release --strip off
fidan build app.fdn --release --opt O2
```

## When to use `--release`

Use it for:

- final binaries
- benchmarks
- shipping CLI tools
- testing realistic AOT performance

## When not to use it

Skip it when you need:

- portable binaries across unknown machines
- easier binary debugging and symbol inspection
- quick experimental AOT compiles where throughput matters more than final code quality

## Typical patterns

Host-tuned release build:

```bash
fidan build src/main.fdn --release --output build/app
```

Portable release build:

```bash
fidan build src/main.fdn --release --target-cpu generic --output build/app
```

LLVM release build:

```bash
fidan build src/main.fdn --release --backend llvm
```

Cranelift release build:

```bash
fidan build src/main.fdn --release --backend cranelift
```

## Optimization is a policy, not a speed guarantee

The CLI accepts `O0`, `O1`, `O2`, `O3`, `Os` and `Oz`. Higher optimization levels enable different compiler/backend policies; `O3` is not guaranteed to make every program faster than `O2`. Measure representative workloads. Cranelift maps both size modes to SpeedAndSize. With LLVM 23, both use the O2 pipeline with `optsize` function attributes, and Oz also sets `minsize`. They retain a real size policy rather than referring to removed LLVM pass-pipeline spellings. Cranelift and LLVM do not implement identical native pass pipelines. Full LTO is an LLVM capability; selecting a preset does not create LLVM LTO inside Cranelift.
