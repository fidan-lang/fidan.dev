---
title: "Decorators"
sidebarLabel: "Decorators"
description: "The practical guide to action decorators in real code: precompile, deprecation, extern interop, and unsafe boundaries."
summary: "Use decorators intentionally, not as magical metadata dust."
order: 160
---

# Decorators

Decorators annotate actions with compiler- or runtime-relevant intent.

## Current decorators

Implemented:

- `@precompile`
- `@deprecated`
- `@extern`
- `@unsafe`

Reserved:

- `@gpu`

## `@precompile`

Use `@precompile` when you want eager JIT compilation before the first hot-path call:

```fidan
@precompile
action hot_inner_loop with (certain n oftype integer) returns integer {
    var sum = 0
    for i in 0..n {
        sum += i
    }
    return sum
}
```

## `@deprecated`

Mark an action as deprecated and help callers move:

```fidan
@deprecated("Use parse_user_v2 instead")
action parse_user_v1 with (text oftype string) returns dynamic {
    return text
}
```

## `@extern`

Bridge to native code through a declared foreign action:

```fidan
@extern("./mylib.dll", symbol = "add_i64")
action add_native with (a oftype integer, b oftype integer) returns integer
```

## `@unsafe`

Use `@unsafe` to mark an intentionally unsafe boundary, especially boxed Fidan ABI externs:

```fidan
@unsafe
@extern("./mylib.dll", symbol = "echo_boxed", abi = "fidan")
action echo_boxed with (text oftype string) returns string
```

## Reserved `@gpu`

`@gpu` is reserved only. It is not implemented today.

## Best practice

- keep decorators close to the action they affect
- use deprecation messages that tell users where to move
- treat `@unsafe` as a real boundary marker, not decoration
- do not combine decorators in ways the compiler explicitly rejects
