---
title: "std.env"
sidebarLabel: "std.env"
description: "Environment variable and script-argument access without mixing in the broader file/path helpers from `std.io`."
summary: "Use this module when you only need process environment and argv."
order: 240
---

# std.env

`args()` returns only application arguments, excluding the source filename/executable and the Fidan wrapper. Missing environment variables return `nothing`. `set` changes this process, not a parent shell. Sandbox environment access requires `--allow-env`; never store credentials in examples or logs.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.env.get(key oftype string) -> string` | `getVar`, `get_var` | Read an environment variable and return `nothing` when it is unset. |
| `std.env.set(key oftype string, value oftype string) -> nothing` | `setVar`, `set_var` | Set an environment variable in the current process. |
| `std.env.args() -> list oftype string` | — | Return the current program arguments passed to the Fidan script. |

<!-- compiler-api:end -->

## Examples

```fidan check=run
use std.env as env

var home = env.get("HOME")
var argv = env.args()
```
