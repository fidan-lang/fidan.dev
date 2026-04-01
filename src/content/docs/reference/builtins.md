---
title: "Builtins"
sidebarLabel: "Builtins"
description: "The complete top-level builtin surface: what is reserved globally, what each builtin does, and where the boundary between builtins and stdlib lives."
summary: "Every top-level builtin and the rules around it."
order: 620
---

# Builtins

Fidan keeps the global builtin surface intentionally small. If something feels larger, more specialized, or more ecosystem-like, it usually belongs under `std.*` instead.

## Complete builtin binding list

The current language-level builtin bindings are:

- `print`
- `eprint`
- `input`
- `len`
- `type`
- `string`
- `integer`
- `float`
- `boolean`
- `Shared`
- `assert`
- `assert_eq`
- `assert_ne`

These names are reserved globally by the language and the toolchain.

## Builtin functions

### `print(value...) -> nothing`

Print values to stdout followed by a newline.

```fidan
print("Hello")
print("User:", name, "Score:", score)
```

### `eprint(value...) -> nothing`

Print values to stderr followed by a newline.

```fidan
eprint("fatal:", message)
```

### `input(prompt?) -> string`

Read one line of input, optionally after showing a prompt.

```fidan
var name = input("Your name: ")
```

### `len(value) -> integer`

Return the length of a string, list, or other countable runtime value.

```fidan
assert_eq(len("Ada"), 3)
assert_eq(len([1, 2, 3]), 3)
```

### `type(value) -> string`

Return the runtime type name of a value.

```fidan
print(type(42))
print(type(["a", "b"]))
```

### Conversion helpers

#### `string(value) -> string`

Convert a value to its string representation.

#### `integer(value) -> integer`

Convert a value to an integer when possible.

#### `float(value) -> float`

Convert a value to a floating-point number when possible.

#### `boolean(value) -> boolean`

Convert a value to a boolean truth value.

```fidan
var a = string(42)
var b = integer("42")
var c = float("3.14")
var d = boolean(1)
```

### `Shared(value) -> Shared`

Create a thread-safe shared wrapper. Use this when parallel work needs to mutate or observe the same state safely.

```fidan
var counter = Shared(0)

parallel for item in [1, 2, 3, 4] {
    counter.update(action with (value oftype integer) returns integer {
        return value + 1
    })
}

print(counter.get())
```

### Assertion helpers

#### `assert(condition, message?) -> nothing`

Fail immediately when the condition is not truthy.

#### `assert_eq(left, right, message?) -> nothing`

Fail immediately when the two values are not equal.

#### `assert_ne(left, right, message?) -> nothing`

Fail immediately when the two values are equal.

```fidan
assert(score > 0)
assert_eq(name, "Ada")
assert_ne(status, "failed")
```

## Builtins vs stdlib

Use builtins for:

- simple printing
- line input
- length and runtime type inspection
- basic conversions
- core assertions
- creating `Shared` state

Use `std.*` modules for:

- file I/O and paths
- math and randomness
- regex
- string transforms
- list/queue/set helpers
- time and clocks
- parallel collection helpers
- cooperative async helpers
- richer test assertions

Example:

```fidan
use std.io as io
use std.math as math

print("Built-in output")
io.writeFile("out.txt", "Hello")
print(math.sqrt(144))
```

## Builtins that no longer exist

These are intentionally **not** top-level builtins anymore:

- `println`
- `eprintln`

Use `print` and `eprint` instead. They already write a trailing newline.

## Builtin aliases and related syntax

Some builtin-adjacent syntax is worth calling out:

- `Shared` is a builtin constructor-like value, not just a keyword in docs prose
- `Pending` and `WeakShared` are language/runtime type names, but not top-level callable builtins in the same way
- `dynamic` and `flexible` are language type aliases, not builtins

## Hover/completion behavior

The builtin metadata in the compiler is shared with the LSP, so in editors you should get:

- hover docs
- signatures
- completion entries for function-like builtins

That is why the builtin list is intentionally curated and centralized.

## Recommended style

Prefer the builtin forms for quick, direct code:

```fidan
print("Hello")
var argv_len = len(env.args())
```

Reach for `std.*` when the code becomes more domain-specific:

```fidan
use std.string as string
use std.regex as regex
```
