---
title: "Toolchains"
sidebarLabel: "Overview"
description: "Understand the interpreter, JIT, Cranelift AOT, LLVM AOT, optional helper toolchains, and the release-build behavior that ties them together."
summary: "Different execution modes, optional helpers, one language story."
order: 400
---

# Toolchains

Fidan has multiple execution modes because development and shipping have
different priorities.

## Current modes

- interpreter
- interpreter plus JIT
- Cranelift AOT
- LLVM AOT

## Optional helper toolchains

Some capabilities are distributed as versioned toolchain packages rather than baked into the main binary:

- `llvm` provides the helper and payload needed by `fidan build --backend llvm`
- `ai-analysis` provides the helper used by AI explain, AI fix, AI improve, and MCP mode

Manage them with:

```bash
fidan toolchain available
fidan toolchain add llvm
fidan toolchain add ai-analysis
fidan toolchain list
```

Installed toolchains can also register `fidan exec` namespaces. Today the AI analysis toolchain registers `fidan exec ai`.

## The important rule

The language surface should stay coherent across all of them. If one backend
gets better metadata, typing, or stdlib understanding, the others should not be
left behind for no reason.

The same rule applies to AI tooling. The AI helper consumes compiler-provided context instead of inventing a separate model of the language.
