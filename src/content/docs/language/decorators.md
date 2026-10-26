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

```fidan check=compile
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

```fidan check=compile
@deprecated("Use parse_user_v2 instead")
action parse_user_v1 with (text oftype string) returns dynamic {
    return text
}
```

The upcoming compiler includes a supplied constant String message in `W2005`.
`@deprecated` without arguments keeps the default warning. Compiler attributes
never call user code to obtain metadata: a runtime-computed message is a compile
time error. `@precompile` and `@unsafe` take no arguments; extra arguments are
rejected rather than ignored. `@extern` retains its specialized literal arguments.

## `@extern`

Bridge to native code through a declared foreign action:

```fidan check=compile
@extern("./mylib.dll", symbol = "add_i64")
action add_native with (a oftype integer, b oftype integer) returns integer
```

## `@unsafe`

Use `@unsafe` to mark an intentionally unsafe boundary, especially boxed Fidan ABI externs:

```fidan check=compile
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

## User-defined decorators in the upcoming compiler

Custom decorators receive the action value and execute at its declaration during
ordered module initialization, after imported modules and preceding statements.
They are ordinary callable values, including imported actions and closures.
Computed and named arguments use normal call checking and evaluate once in source
order. Nested declarations apply their decorators whenever that declaration runs.

```fidan check=run
var applications = 0
action validate_action with (certain callback oftype action) returns action {
    applications += 1
    assert(len(callback.parameters) == 1)
    return callback
}

@validate_action
action greet with (optional name oftype string = "Dal") returns string {
    return "Hello, " + name
}

assert_eq(greet("Ada"), "Hello, Ada")
assert_eq(greet.invoke(["Ada"]), "Hello, Ada")
assert_eq(applications, 1)
```

A returned action replaces the current callable; returning `nothing` retains it
for compatible side-effect decorators. Other return values are rejected. Stacked
decorators apply in declaration order, with each receiving the preceding callable;
this is deliberately different from Python's reverse application order. Reserved
compiler decorator spellings remain compiler-controlled even if an ordinary
symbol has the same name. `@gpu` remains reserved and is rejected.

This is a coordinated future-compiler capability. The published 1.0.16 compiler
must not be assumed to implement custom decorator replacement or callable
reflection merely because an editor extension recognizes the syntax.

## Receiver methods

A replacement for a decorated receiver method must preserve the implicit receiver as its first callback parameter, followed by the declared arguments. The caller still uses `instance.method(...)`; it does not manually pass `this`. Captured local closures remain normal callables. Replacement return values are checked through the original action contract; decoration is not permission to bypass typed returns.
