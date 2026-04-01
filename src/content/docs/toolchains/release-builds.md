---
title: "Release builds"
sidebarLabel: "Release builds"
description: "Understand what --release means in Fidan and why it is a build policy rather than only an optimization-level alias."
summary: "Release is a policy bundle, not just a single flag number."
order: 450
---

# Release builds

In Fidan, `--release` is not just shorthand for one optimization level.

## Current release policy

- aggressive optimization
- full LTO
- stripped output
- host-native CPU by default

If you need something else, the explicit flags win.
