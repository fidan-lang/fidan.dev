---
title: "std.async"
sidebarLabel: "std.async"
description: "Cooperative same-thread async helpers that return `Pending` handles and compose with `spawn`/`await`."
summary: "Use `std.async` when you want pending-handle orchestration, not OS threads."
order: 220
---

# std.async

`std.async` is part of the same-thread cooperative model.

## Core functions

- `sleep(ms) -> Pending`
- `ready(value) -> Pending`
- `gather(handles) -> Pending`
- `waitAny(handles) -> Pending`
- `timeout(handle, ms) -> Pending`

## Aliases

- `wait` = `sleep`
- `waitAll` / `wait_all` = `gather`
- `wait_any` = `waitAny`

## Example

```fidan
use std.async as async

var a = async.sleep(100)
var b = async.ready("done")
var both = async.gather([a, b])

print(await both)
```

## Model reminder

This module is cooperative and same-thread. It is not a thread pool.

## Common usage snippets

### Wrap an already-available value

```fidan
use std.async as async

var handle = async.ready("done")
print(await handle)
```

### Wait for the first completion

```fidan
use std.async as async

var first = async.waitAny([async.sleep(50), async.sleep(100)])
print(await first)
```
