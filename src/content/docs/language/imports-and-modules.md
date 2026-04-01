---
title: "Imports and modules"
sidebarLabel: "Imports and modules"
description: "Import stdlib modules, grouped names, local modules, file-relative modules, and re-exports without losing track of what is builtin and what is imported."
summary: "Clear module boundaries, explicit imports, and predictable resolution."
order: 165
---

# Imports and modules

Fidan supports both top-level builtins and explicit module imports. The language intentionally keeps that boundary visible.

## Stdlib imports

Examples:

```fidan
use std.env as env
use std.math
use std.math.{sqrt, floor, ceil}
use std.async as async
```

## Local/user modules

Examples:

```fidan
use helpers
use net.client
use "./other.fdn" as other
```

Typical resolution targets:

- `helpers` -> `helpers.fdn` or `helpers/init.fdn`
- `net.client` -> `net/client.fdn`

## Aliases

Use `as` when a shorter namespace reads better:

```fidan
use std.io as io
use std.string as string
```

## Grouped imports

Import only selected exports:

```fidan
use std.math.{sqrt, floor}
```

This flattens those names into local scope.

## Re-exports

Use `export use` to re-export an import from your module:

```fidan
export use std.math
```

## Builtins vs modules

Builtins are always present globally, for example:

- `print`
- `len`
- `string`
- `Shared`

Modules are explicit and opt-in:

- `std.math`
- `std.io`
- `std.collections`

## Tooling consistency

Stdlib module names, exports, hover docs, and return-type metadata are shared with the LSP and docs so editor behavior stays aligned with the actual runtime surface.
