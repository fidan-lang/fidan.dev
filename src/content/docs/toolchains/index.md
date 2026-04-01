---
title: "Toolchains"
sidebarLabel: "Overview"
description: "Understand the interpreter, JIT, Cranelift AOT, LLVM AOT, and the release-build behavior that ties them together."
summary: "Different execution modes, one language story."
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

## The important rule

The language surface should stay coherent across all of them. If one backend
gets better metadata, typing, or stdlib understanding, the others should not be
left behind for no reason.
