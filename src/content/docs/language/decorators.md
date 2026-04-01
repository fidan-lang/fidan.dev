---
title: "Decorators"
sidebarLabel: "Decorators"
description: "Use language decorators like @extern, @deprecated, and @precompile intentionally."
summary: "Decorators annotate intent without bloating the core syntax."
order: 160
---

# Decorators

Current decorators and reserved annotations:

- `@precompile`
- `@deprecated`
- `@extern`
- `@unsafe`
- reserved `@gpu`

## `@precompile`

Use when you want eager JIT compilation before the first hot-path call.

## `@deprecated`

Use when a callable still exists but callers should migrate away.

## `@extern`

Use to bind native functions from external libraries.

## `@unsafe`

Use to acknowledge an unsafe boundary, especially around native interop.
