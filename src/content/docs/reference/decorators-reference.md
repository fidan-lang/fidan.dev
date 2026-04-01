---
title: "Decorators reference"
sidebarLabel: "Decorators"
description: "Every compiler-known decorator, what it means, what combinations are valid, and which spellings are reserved but not implemented."
summary: "The full decorator surface and its rules."
order: 630
---

# Decorators reference

Decorators are action-level annotations that affect compilation, diagnostics, or foreign interop.

## Current built-in decorators

Implemented today:

- `@precompile`
- `@deprecated`
- `@extern`
- `@unsafe`

Reserved spelling:

- `@gpu`

## General rules

- decorators appear immediately above an action
- multiple decorators can be stacked
- some combinations are intentionally forbidden
- unknown decorators are diagnosed by the compiler

Example:

```fidan
@deprecated("Use parse_user_v2 instead")
action parse_user with (source oftype string) returns dynamic {
    return source
}
```

## `@precompile`

### Meaning

Request eager JIT compilation of an action before the first hot-path call.

### When to use it

Use `@precompile` when:

- startup-time warmup matters
- you know an action will be hot immediately
- you want to avoid the first-call JIT threshold delay

### Example

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

### Notes

- `@precompile` is about runtime/JIT behavior, not AOT build selection
- it cannot be combined with `@extern`

## `@deprecated`

### Meaning

Mark an action as deprecated so callers receive a warning and can migrate before removal.

### Example

```fidan
@deprecated("Use fibonacci_fast instead")
action fibonacci_old with (certain n oftype integer) returns integer {
    return n
}
```

### Recommended usage

Include a short migration hint in the message:

- replacement action name
- expected removal timing if relevant
- behavior difference if the replacement is not drop-in

## `@extern`

### Meaning

Declare a foreign action imported from a native library.

### Example

```fidan
@extern("./mylib.dll", symbol = "add_i64")
action add_native with (a oftype integer, b oftype integer) returns integer
```

### Common arguments

- library path
- `symbol = "..."`
- `abi = "fidan"` for boxed Fidan ABI interop
- `link = "..."` for AOT link-time import libraries

### Constraints

- `@extern` actions must be top-level
- `@extern` actions omit the body
- `@precompile` cannot be combined with `@extern`
- `parallel action` cannot be combined with `@extern`
- native ABI is intended for scalar/native-handle values

## `@unsafe`

### Meaning

Acknowledge an intentionally unsafe boundary, usually around boxed Fidan ABI interop.

### Typical use

```fidan
@unsafe
@extern("./mylib.dll", symbol = "echo_boxed", abi = "fidan")
action echo_boxed with (text oftype string) returns string
```

### Why it exists

The boxed Fidan ABI crosses a lower-level trust boundary than ordinary Fidan code. Requiring `@unsafe` makes that choice explicit in source.

## `@gpu`

### Meaning today

`@gpu` is reserved only. It is **not** implemented.

### Why reserve it

The spelling is held for future offload/GPU work so early ecosystem code does not claim it for unrelated meanings.

## Valid and invalid combinations

### Valid

```fidan
@deprecated("Use v2")
action old_api returns nothing {
}
```

```fidan
@precompile
action hot_path returns integer {
    return 1
}
```

```fidan
@unsafe
@extern("./mylib.dll", symbol = "do_boxed", abi = "fidan")
action do_boxed with (value oftype string) returns string
```

### Invalid

`@precompile` with `@extern`:

```fidan
@precompile
@extern("./mylib.dll", symbol = "native")
action native_call returns integer
```

`parallel action` with `@extern`:

```fidan
@extern("./mylib.dll", symbol = "native")
parallel action native_call returns integer
```

Boxed Fidan ABI without `@unsafe`:

```fidan
@extern("./mylib.dll", symbol = "echo_boxed", abi = "fidan")
action echo_boxed with (value oftype string) returns string
```

## Best practices

- keep decorator stacks short and explicit
- treat `@unsafe` like a real warning sign, not decorative boilerplate
- add migration text to `@deprecated`
- use `@precompile` only where startup JIT latency is actually visible
- document the native ABI expectations near `@extern` declarations

## Tooling support

The compiler, LSP, and docs share decorator metadata, so the current built-in decorator set is reflected consistently in:

- hover docs
- completion
- diagnostics for unknown/reserved spellings

That shared metadata is also why this page intentionally documents only the compiler-known decorators, not imagined future annotations.
