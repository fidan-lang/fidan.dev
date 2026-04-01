---
title: "libfidan embedding"
sidebarLabel: "libfidan embedding"
description: "Embed Fidan into a host process with the shipped `libfidan` artifacts instead of treating the CLI as the only integration surface."
summary: "Fidan is embeddable, not just executable."
order: 470
---

# libfidan embedding

Fidan is not only about the CLI. It also has an embedding story through `libfidan`.

## What ships in release archives

Stable release archives include:

- the platform `libfidan` shared library
- the platform `libfidan` static library
- `include/fidan.h`
- a tiny C embedding example

## Basic embedding model

The current C-facing contract is:

- create a VM with `fidan_vm_new()`
- evaluate source or a file with `fidan_eval()` / `fidan_eval_file()`
- inspect results through `fidan_value_*` helpers
- free returned values with `fidan_value_free()`

## Result convention

The initial embedding slice returns the top-level `result` binding when the program defines one. If no `result` binding exists, a successful run returns `nothing`.

## Rust wrapper

For Rust hosts built from source, the workspace also includes:

- `crates/fidan-embed`

That crate wraps the raw C ABI with safer Rust `Vm` and `Value` types.
