---
title: "Build vs run vs release"
sidebarLabel: "Build vs run"
description: "Choose the right workflow for editing, testing, native builds, and release-grade binaries."
summary: "Understand the difference between edit-time execution and shipping builds."
order: 30
---

# Build vs run vs release

Fidan gives you more than one execution path because editing code and shipping
code are not the same task.

## `fidan run`

Use `run` when:

- you are iterating on code quickly
- you want fast feedback
- you care more about edit speed than final binary output

```bash
fidan run app.fdn
```

## `fidan build`

Use `build` when:

- you want a native executable
- you need to compare AOT backends
- you want an artifact you can run repeatedly

```bash
fidan build app.fdn -o app
```

## `--release`

In Fidan, `--release` is a build policy, not just an optimization-number alias.

Current release behavior includes:

- aggressive optimization
- full LTO
- stripped output
- host-native CPU targeting by default

If you need portability, override the CPU target explicitly:

```bash
fidan build app.fdn --release --target-cpu generic
```

Read more in [Release builds](/docs/toolchains/release-builds) and
[Target CPU and portability](/docs/toolchains/target-cpu-and-portability).
