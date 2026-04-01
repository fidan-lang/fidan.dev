---
title: "std.env"
sidebarLabel: "std.env"
description: "Read arguments and environment variables explicitly through the env module."
summary: "Process args and env values without mystery globals."
order: 240
---

# std.env

`std.env` is small on purpose.

## Core functions

- `env.get(key)`
- `env.set(key, value)`
- `env.args()`

## Example

```fidan
use std.env as env

var argv = env.args()
var mode = env.get("APP_MODE")
```

## CLI argument behavior

Script-visible args are the program args passed to the Fidan script itself, not
the internal wrapper args used by the host CLI.
