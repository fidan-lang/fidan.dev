---
title: "std.async"
sidebarLabel: "std.async"
description: "Use async helpers for same-thread pending-handle orchestration."
summary: "Async helpers on top of Fidan's pending model."
order: 220
---

# std.async

`std.async` is built on top of Fidan's pending-handle model.

## Core helpers

- `async.sleep(ms)`
- `async.ready(value)`
- `async.gather(handles)`
- `async.waitAny(handles)`
- `async.timeout(handle, ms)`

## Example

```fidan
use std.async

var result = await async.gather([
    async.ready(1),
    async.ready(42),
    async.ready(3)
])
```

## Important distinction

`std.async.sleep` participates in same-thread cooperative scheduling.

That is **not** the same as `std.time.sleep`, which blocks the current thread.
