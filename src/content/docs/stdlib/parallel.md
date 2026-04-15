---
title: "std.parallel"
sidebarLabel: "std.parallel"
description: "Thread-backed collection helpers for when the language-level `parallel` syntax is not the right shape for the job."
summary: "Parallel collection APIs backed by real worker threads."
order: 270
---

# std.parallel

`std.parallel` is the thread-backed functional collection module.

## Functions

- `parallelMap(list, fn) -> list`
- `parallelFilter(list, fn) -> list`
- `parallelForEach(list, fn) -> nothing`
- `parallelReduce(list, init, fn) -> dynamic`

Aliases:

- `parallel_map`
- `parallel_filter`
- `parallel_for_each`
- `parallel_reduce`

## Example

```fidan wrap=none
use std.parallel as par

var doubled = par.parallelMap([1, 2, 3], action with (item oftype integer) returns integer {
    return item * 2
})
```

Use this module when a pipeline style is clearer than a `parallel for` block.
