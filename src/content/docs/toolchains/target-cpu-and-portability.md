---
title: "Target CPU and portability"
sidebarLabel: "Target CPU"
description: "Choose between portable binaries and host-tuned output without guessing what the toolchain does under the hood."
summary: "Portable by default, aggressive when you ask for it."
order: 460
---

# Target CPU and portability

Portable output is the default.

## Default behavior

If you do not specify a target CPU, builds stay portable. That is the right
default for binaries that may run on other machines.

## Release behavior

`--release` changes the default CPU choice to `native`, unless you explicitly
override it.

```bash
fidan build app.fdn --release --target-cpu generic
```
