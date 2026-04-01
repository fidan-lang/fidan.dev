---
title: "Extern and native interop"
sidebarLabel: "Extern interop"
description: "Call native code through @extern and keep performance-sensitive boundaries explicit."
summary: "Fidan does not wall you off from native libraries."
order: 170
---

# Extern and native interop

`@extern` is the bridge from Fidan into native code.

```fidan
@extern("kernel32", "GetTickCount64")
action get_tick_count returns integer
```

## Why it matters

Fidan is meant to be practical in native environments. That means interop is a
real feature, not an afterthought.

## Important rules

- `@extern` actions are top-level
- they omit a normal body
- `@precompile` does not combine with `@extern`
- AOT builds may need explicit link inputs for the native import library
