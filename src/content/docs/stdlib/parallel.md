---
title: "std.parallel"
sidebarLabel: "std.parallel"
description: "Use thread-backed collection helpers when a parallel block would be more boilerplate than signal."
summary: "Parallel helpers built on real worker threads."
order: 270
---

# std.parallel

`std.parallel` provides thread-backed collection helpers for common data
transforms.

## Current helpers

- `parallelMap(list, fn)`
- `parallelFilter(list, fn)`
- `parallelForEach(list, fn)`
- `parallelReduce(list, init, fn)`

## When to use it

Use `std.parallel` when the operation is already naturally a collection
transform.

Use a normal `parallel` block when you want explicit task structure or mixed
work, not just one list-oriented operation.
