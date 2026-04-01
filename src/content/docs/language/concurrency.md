---
title: "Concurrency model"
sidebarLabel: "Concurrency"
description: "Understand exactly how parallel, concurrent, spawn, await, and std.async differ."
summary: "Threads where you want them, cooperative structure where you do not."
order: 150
---

# Concurrency model

Fidan has two distinct concurrency families.

## Real threaded work

- `parallel`
- `parallel for`

These use real OS threads.

## Same-thread structured work

- `concurrent`
- `spawn`
- `await`
- `std.async`

These do **not** create OS threads. They use same-thread cooperative
scheduling.

## Mental model

```fidan
concurrent {
    task {
        var nested = spawn compute()
        print(await nested)
    }
}
```

- `spawn` returns a pending handle
- `await` resolves that handle
- `concurrent` gives structure to same-thread tasks
- `parallel` is for actual multicore execution

## Shared state

Inside `parallel`, cross-thread mutation must go through `Shared`.

```fidan
var counter = Shared(0)
```
