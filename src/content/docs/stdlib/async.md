---
title: "std.async"
sidebarLabel: "std.async"
description: "Cooperative same-thread async helpers that return `Pending` handles and compose with `spawn`/`await`."
summary: "Use `std.async` when you want pending-handle orchestration, not OS threads."
order: 220
---

# std.async

Pending values schedule cooperative work on the current thread. `gather` preserves input ordering; `waitAny` resolves the first completed handle. This is not a background thread or a network API. See [Concurrency](/docs/language/concurrency).

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.async.sleep(ms oftype integer) -> Pending oftype nothing` | `wait` | Return a pending handle that resolves after the given number of milliseconds on the same-thread async scheduler. |
| `std.async.ready(value oftype dynamic) -> Pending oftype dynamic` | — | Wrap an already-available value in a pending handle. |
| `std.async.gather(handles oftype list oftype Pending oftype dynamic) -> Pending oftype list oftype dynamic` | `waitAll`, `wait_all` | Wait for every pending handle in the list and collect all results in order. |
| `std.async.waitAny(handles oftype list oftype Pending oftype dynamic) -> Pending oftype (integer, dynamic)` | `wait_any` | Resolve with the first pending handle that completes, returning its index and value. |
| `std.async.timeout(handle oftype Pending oftype dynamic, ms oftype integer) -> Pending oftype (boolean, dynamic)` | — | Await a pending handle with a timeout and return whether it completed before the deadline. |

<!-- compiler-api:end -->

## Examples

```fidan check=run
use std.async as async

var a = async.sleep(100)
var b = async.ready("done")
var both = async.gather([a, b])

print(await both)
```

```fidan check=run
use std.async as async

var handle = async.ready("done")
print(await handle)
```

```fidan check=run
use std.async as async

var first = async.waitAny([async.sleep(50), async.sleep(100)])
print(await first)
```
