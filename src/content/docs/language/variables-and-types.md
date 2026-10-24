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

```fidan check=run
var count = 42
var name = "Ada"
var active = true
var ratio = 3.14
```

In ordinary local code, inference should carry most of the load.

## Explicit annotations

Use `oftype` when the type matters to the reader or the compiler cannot infer exactly what you want:

```fidan check=run
var count oftype integer = 42
var name oftype string = "Ada"
var maybe_user oftype dynamic = nothing
```

The parser also accepts `->` as a type annotation introducer:

```fidan check=run
var count -> integer
```

The formatter generally prefers `oftype`.

## `const var`

Immutable declarations use `const var`:

```fidan check=run
const var retries = 3
const var host = "127.0.0.1"
```

This is especially useful for:

- configuration constants
- discriminants or mode selectors
- values used in dead-code analysis like `if false`

## Default initialization

Variables without an initializer default to `nothing`:

```fidan check=run
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

Accepted alias spellings:

- `int` = `integer`
- `decimal` = `float`
- `bool` = `boolean`
- `text` = `string`
- `flexible` = `dynamic`

`dynamic` is the escape hatch when a value is intentionally not statically specific.

### `dynamic` alias

`flexible` is accepted as a synonym for `dynamic`:

```fidan check=run
var value oftype flexible = 42
```

The formatter normalizes this to `dynamic`.

## Typed containers and wrappers

Fidan uses chained `oftype` rather than angle brackets:

```fidan check=run
var scores oftype list oftype integer = [1, 2, 3]
var names oftype list oftype string
var lookup oftype dict oftype (string, integer)
var alt_lookup oftype map oftype (string, dynamic)
var counter oftype Shared oftype integer = Shared(0)
var handle oftype Pending oftype string
```

This is the current generic-like style. Fidan does **not** currently use forms like `list<int>` or `list[int]`.

## Tuples

Tuple values:

```fidan check=run
var pair = ("Ada", 37)
```

Tuple destructuring:

```fidan check=run context=tuple
var (name, age) = pair
```

Tuple types:

```fidan check=run
var pair oftype (string, integer)
var anything_tuple oftype tuple
```

`tuple` by itself is the untyped tuple keyword; `(T1, T2)` is the explicit element-typed tuple form.

## Lists and dicts

```fidan check=run
var nums = [1, 2, 3]
var user = {"name": "Ada", "age": 37}
```

You can make the intended type explicit when the literal shape alone is not enough:

```fidan check=run
var ids oftype list oftype integer = []
var scores_by_name oftype dict oftype (string, integer) = {}
```

## `certain`, `optional`, and nullability

These keywords apply to **parameters**, not ordinary local variables, but they matter to how types flow through code:

- plain parameter: required, but may still be `nothing`
- `certain`: required and non-null by contract
- `optional`: may be omitted and can have a default

Example:

```fidan check=compile
action greet with (
    certain name oftype string,
    age oftype integer,
    optional title oftype string = "Engineer"
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

```fidan check=run
var port = integer("8080")
var banner = string(port)
print(type(port))
```

## Runtime wrappers

### `Shared`

Use `Shared` for values that need safe mutation across real parallel work:

```fidan check=run
var counter = Shared(0)
counter.set(10)
print(counter.get())
```

### `Pending`

`Pending` is the runtime handle type produced by `spawn` and `std.async` helpers:

```fidan check=run context=async
var handle oftype Pending oftype string = spawn fetch_data()
var data = await handle
```

### `WeakShared`

`WeakShared(shared)` is a top-level constructor, just like `Shared(value)`. It also accepts an existing weak handle. `weak.upgrade()` returns a Shared handle while the allocation is alive, otherwise `nothing`; `weak.isAlive()` inspects liveness. Weak handles do not keep the allocation alive. Invalid dynamic constructor arguments raise `R0001`.

## Recommended style

Good default style:

- infer obvious local values
- annotate action parameters and returns when clarity benefits
- annotate container element types when the empty literal would otherwise be ambiguous
- prefer `dynamic` over `flexible`

Example:

```fidan check=compile
var retries = 3
var names oftype list oftype string = []

action load_user with (certain id oftype integer) returns dynamic {
    return {"id": id}
}
```

## Complete additional type-name catalog

The scalar names above and the compiler metadata below form the supported type vocabulary. `action`, `callable` and `fn` name the same coarse callable type; parameter/return contracts live in action metadata, not in a richer signature type.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Additional type spelling | Shape | Meaning |
| --- | --- | --- |
| `action` | `action` | First-class callable value type (action, callable and fn are aliases). Concrete callable arity is validated at runtime when its signature is erased. |
| `callable` | `callable` | First-class callable value type (action, callable and fn are aliases). Concrete callable arity is validated at runtime when its signature is erased. |
| `fn` | `fn` | First-class callable value type (action, callable and fn are aliases). Concrete callable arity is validated at runtime when its signature is erased. |
| `handle` | `handle` | Opaque native handle type used for extern interop and low-level OS or library handles. |
| `list` | `list oftype T` | Ordered growable collection. Use `list oftype T` for typed lists or bare `list` when element type is dynamic. |
| `dict` | `dict oftype (K, V)` | Key-value map type. Use `dict oftype (K, V)` for typed dictionaries or bare `dict` when both sides are dynamic. |
| `map` | `map oftype (K, V)` | Alias for `dict`. Use `map oftype (K, V)` when you prefer map-style terminology. |
| `hashset` | `hashset oftype T` | Unordered collection of unique, hashable values. Use `hashset oftype T` for typed sets or bare `hashset` for dynamic elements. |
| `tuple` | `tuple or (T1, T2, ...)` | Fixed-position product type. Use bare `tuple` for an untyped tuple value or `(T1, T2, ...)` for a typed tuple shape. |
| `Shared` | `Shared oftype T` | Thread-safe shared wrapper type for values used across parallel work. |
| `WeakShared` | `WeakShared oftype T` | Non-owning weak reference to a `Shared` value. Upgrade it when the shared value is still alive. |
| `Pending` | `Pending oftype T` | Handle type for asynchronous work that will eventually resolve to `T`. |

<!-- compiler-api:end -->

## Parameterization and aliasing

`oftype` parameterizes built-in containers/wrappers. User-defined generic action/object type-parameter declarations are not implemented; do not infer them from `list oftype T` documentation placeholders. Numeric assignability and explicit conversions are distinct; use `integer(...)` or `float(...)` when the runtime representation matters. Lists, dicts and objects are mutable reference values: assignment can alias an existing value; a slice creates a new list container. `const var` prevents rebinding, not deep freezing of a referenced collection.
