---
title: "Standard library overview"
sidebarLabel: "Overview"
description: "The full `std.*` module map, the boundary between builtins and stdlib, and the naming style you should expect across aliases and return types."
summary: "Know where functionality lives before diving into per-module reference pages."
order: 210
---

# Standard library overview

Fidan keeps the global language surface small and moves richer behavior under explicit modules.

## Current modules

- `std.async`
- `std.collections`
- `std.env`
- `std.io`
- `std.math`
- `std.parallel`
- `std.regex`
- `std.string`
- `std.test`
- `std.time`

## Module map

### `std.async`

Same-thread async helpers like:

- `sleep`
- `ready`
- `gather`
- `waitAny`
- `timeout`

### `std.collections`

List and container helpers like:

- `range`
- `zip`
- `enumerate`
- `chunk`
- `window`
- `partition`
- set/queue/stack helpers

### `std.env`

Environment variables and script arguments.

### `std.io`

Console I/O, files, directories, paths, environment convenience, and terminal helpers.

### `std.math`

Numeric transforms, constants, trig, randomness, and numeric predicates.

### `std.parallel`

Thread-backed collection helpers like `parallelMap` and `parallelReduce`.

### `std.regex`

Match, capture, replace, split, and validation helpers.

### `std.string`

String transforms, parsing, slicing, casing, and character/codepoint helpers.

### `std.test`

Assertion helpers used in tests and test-oriented scripts.

### `std.time`

Clocks, blocking sleep, elapsed timing, and date/time formatting.

## Builtins vs stdlib

Top-level builtins stay intentionally small:

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

Everything more specialized belongs under `std.*`.

## Aliases and naming

Many stdlib members expose aliases for readability or ecosystem familiarity. Examples:

- snake_case and camelCase pairs
- short conventional aliases like `upper` / `lower`
- compatibility names like `isMatch` or `replaceAll`

The docs prefer the canonical signature spelling, then call out notable aliases in the per-module pages.

## Return types

The stdlib metadata is shared with the LSP and docs, so these pages follow the same signatures and return-type hints used by hover and completion.

Examples:

- `std.env.args() -> list`
- `std.math.sqrt(x) -> float`
- `std.time.sleep(ms) -> nothing`
- `std.async.sleep(ms) -> Pending`

## Import styles

Module namespace:

```fidan
use std.math as math
print(math.sqrt(144))
```

Grouped imports:

```fidan
use std.math.{sqrt, floor}
print(sqrt(144))
```

Whole-module import without alias:

```fidan
use std.time
print(time.now())
```

## Recommendation

Prefer namespaced stdlib usage in app/library code:

```fidan
use std.io as io
use std.string as string
use std.time as time
```

It keeps call sites clearer, especially once a file uses several modules at once.
