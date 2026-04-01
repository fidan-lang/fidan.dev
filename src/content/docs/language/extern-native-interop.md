---
title: "Extern and native interop"
sidebarLabel: "Extern interop"
description: "Use `@extern` for native scalar ABI calls or boxed Fidan ABI calls, understand the constraints, and keep interop explicit."
summary: "Native libraries are a real first-class integration path in Fidan."
order: 170
---

# Extern and native interop

`@extern` is Fidan's bridge to native libraries.

## Native scalar ABI example

```fidan
@extern("./mylib.dll", symbol = "add_i64")
action add_native with (a oftype integer, b oftype integer) returns integer
```

## Mixed native values

The native ABI supports scalar/native-handle style values such as:

- `integer`
- `float`
- `boolean`
- `handle`
- `nothing` as a return

## Boxed Fidan ABI example

For richer runtime values, use the boxed Fidan ABI and mark the boundary unsafe:

```fidan
@unsafe
@extern("./mylib.dll", symbol = "echo_boxed", abi = "fidan")
action echo_boxed with (text oftype string) returns string
```

## Important rules

- `@extern` actions are top-level
- they omit a body
- `@precompile` cannot be combined with `@extern`
- `parallel action` cannot be combined with `@extern`
- `abi = "fidan"` requires `@unsafe`

## Link-time note for AOT

For AOT builds, you may need explicit link metadata:

```fidan
@extern("./mylib.dll", symbol = "add_i64", link = "./mylib.lib")
action add_native with (a oftype integer, b oftype integer) returns integer
```

That lets the AOT build resolve the native import library at link time.

## Why this matters

Fidan is intended to live in native environments, not behind a sandbox wall. `@extern` is a practical language feature, not a bolted-on afterthought.
