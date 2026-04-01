---
title: "std.env"
sidebarLabel: "std.env"
description: "Environment variable and script-argument access without mixing in the broader file/path helpers from `std.io`."
summary: "Use this module when you only need process environment and argv."
order: 240
---

# std.env

`std.env` is the narrow process-environment module.

## Functions

- `get(key) -> dynamic`
- `set(key, value) -> nothing`
- `args() -> list`

## Typical usage

```fidan
use std.env as env

var home = env.get("HOME")
var argv = env.args()
```

`args()` returns the script-facing argument list, not the raw host CLI wrapper.
