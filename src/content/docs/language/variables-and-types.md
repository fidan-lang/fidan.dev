---
title: "Variables and types"
sidebarLabel: "Variables and types"
description: "Learn how Fidan handles inference, explicit annotations, const variables, typed containers, tuples, nullability, and the readable `oftype` style."
summary: "The real type surface, from simple locals to `Shared oftype integer`."
order: 110
---

# Variables and types

Fidan is statically typed, but it tries hard not to make you annotate everything.

## Basic declarations

```fidan
var count = 42
var name = "Ada"
var active = true
var ratio = 3.14
```

In ordinary local code, inference should carry most of the load.

## Explicit annotations

Use `oftype` when the type matters to the reader or the compiler cannot infer exactly what you want:

```fidan
var count oftype integer = 42
var name oftype string = "Ada"
var maybe_user oftype dynamic = nothing
```

The parser also accepts `->` as a type annotation introducer:

```fidan
var count -> integer
```

The formatter generally prefers `oftype`.

## `const var`

Immutable declarations use `const var`:

```fidan
const var retries = 3
const var host = "127.0.0.1"
```

This is especially useful for:

- configuration constants
- discriminants or mode selectors
- values used in dead-code analysis like `if false`

## Default initialization

Variables without an initializer default to `nothing`:

```fidan
var name oftype string
```

That is legal, but you then need to handle the possibly-null value correctly before dereferencing or performing unsafe operations on it.

## Core scalar types

The main scalar/value types you will see most often are:

- `integer`
- `float`
- `string`
- `boolean`
- `nothing`
- `dynamic`

`dynamic` is the escape hatch when a value is intentionally not statically specific.

### `dynamic` alias

`flexible` is accepted as a synonym for `dynamic`:

```fidan
var value oftype flexible = 42
```

The formatter normalizes this to `dynamic`.

## Typed containers and wrappers

Fidan uses chained `oftype` rather than angle brackets:

```fidan
var scores oftype list oftype integer = [1, 2, 3]
var names oftype list oftype string
var lookup oftype dict oftype string oftype integer
var counter oftype Shared oftype integer = Shared(0)
var handle oftype Pending oftype string
```

This is the current generic-like style. Fidan does **not** currently use forms like `list<int>` or `list[int]`.

## Tuples

Tuple values:

```fidan
var pair = ("Ada", 37)
```

Tuple destructuring:

```fidan
var (name, age) = pair
```

Tuple types:

```fidan
var pair oftype (string, integer)
var anything_tuple oftype tuple
```

`tuple` by itself is the untyped tuple keyword; `(T1, T2)` is the explicit element-typed tuple form.

## Lists and dicts

```fidan
var nums = [1, 2, 3]
var user = {"name": "Ada", "age": 37}
```

You can make the intended type explicit when the literal shape alone is not enough:

```fidan
var ids oftype list oftype integer = []
var scores_by_name oftype dict oftype string oftype integer = {}
```

## `certain`, `optional`, and nullability

These keywords apply to **parameters**, not ordinary local variables, but they matter to how types flow through code:

- plain parameter: required, but may still be `nothing`
- `certain`: required and non-null by contract
- `optional`: may be omitted and can have a default

Example:

```fidan
action greet with (
    certain name oftype string,
    optional title oftype string = "Engineer",
    age oftype integer
) returns string {
    return "{title} {name} ({age})"
}
```

## Type inference rules of thumb

Inference works well for:

- literal assignments
- arithmetic chains
- obvious list/dict literals
- return values from typed actions
- builtin conversions like `integer("42")`

You should still annotate when:

- the value starts at `nothing`
- a public API should be explicit
- a container would otherwise become too loose
- you want to document intent, not just satisfy the compiler

## Builtin conversions

Top-level conversion helpers:

- `string(value)`
- `integer(value)`
- `float(value)`
- `boolean(value)`
- `type(value)`

Example:

```fidan
var port = integer("8080")
var banner = string(port)
print(type(port))
```

## Runtime wrappers

### `Shared`

Use `Shared` for values that need safe mutation across real parallel work:

```fidan
var counter = Shared(0)
counter.set(10)
print(counter.get())
```

### `Pending`

`Pending` is the runtime handle type produced by `spawn` and `std.async` helpers:

```fidan
var handle oftype Pending oftype string = spawn fetch_data()
var data = await handle
```

### `WeakShared`

`WeakShared` is part of the language/runtime type vocabulary, though it is not a top-level builtin constructor in the same way `Shared(...)` is.

## Recommended style

Good default style:

- infer obvious local values
- annotate action parameters and returns when clarity benefits
- annotate container element types when the empty literal would otherwise be ambiguous
- prefer `dynamic` over `flexible`

Example:

```fidan
var retries = 3
var names oftype list oftype string = []

action load_user with (certain id oftype integer) returns dynamic {
    return {"id": id}
}
```
