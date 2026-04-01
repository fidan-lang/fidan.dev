---
title: "Variables and types"
sidebarLabel: "Variables and types"
description: "Use inference by default, add explicit types when clarity matters, and understand typed containers."
summary: "A compact type surface with explicit readability."
order: 110
---

# Variables and types

Fidan keeps the type surface small on purpose.

```fidan
var count = 42
var name oftype string = "Ada"
var active oftype boolean = true
var scores oftype list oftype integer = [1, 2, 3]
```

## Inference

Type inference is meant to cover ordinary code well. You should not need to
annotate every local.

## Explicit annotations

Use `oftype` when:

- a type is not obvious from the value
- a public signature should stay explicit
- a container would otherwise look too dynamic

## Typed containers

Fidan already supports parameterized container styles through `oftype`:

- `list oftype integer`
- `dict oftype string oftype integer`
- `Shared oftype integer`
- `Pending oftype string`

## Builtin conversions

Top-level builtin conversion-ish helpers include:

- `string(value)`
- `integer(value)`
- `float(value)`
- `boolean(value)`
- `type(value)`

These stay intentionally small; richer operations live in `std.*`.
