---
title: "Imports and modules"
sidebarLabel: "Imports and modules"
description: "Import stdlib modules, structure your own modules, and understand builtin vs stdlib boundaries."
summary: "Imports clarify boundaries instead of hiding them."
order: 165
---

# Imports and modules

Fidan supports both top-level builtins and imported module members.

```fidan
use std.env as env
use std.math

var argv = env.args()
```

## Stdlib imports

Core modules live under `std.*`.

Examples:

- `use std.io`
- `use std.math`
- `use std.async as async`

## Tooling consistency

Stdlib module names, exports, hover text, and return-type metadata are shared
with the LSP and docs so editor behavior stays aligned with the actual runtime
surface.
