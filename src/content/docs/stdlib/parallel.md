---
title: "std.parallel"
sidebarLabel: "std.parallel"
description: "Thread-backed collection helpers for when the language-level `parallel` syntax is not the right shape for the job."
summary: "Parallel collection APIs backed by real worker threads."
order: 270
---

# std.parallel

These helpers run callbacks through real worker threads. Map preserves result ordering; filtering and reduction require callbacks appropriate to their contracts. Reduction grouping may differ from a sequential fold, so use an associative operation and do not rely on worker order. Ordinary shared mutation is rejected; use atomic `Shared.update` for shared accumulation. Closures must satisfy the same concurrency rules as named actions.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.parallel.parallelMap(list oftype list oftype dynamic, fn oftype action) -> list oftype dynamic` | `parallel_map` | Apply a function to every list item on worker threads and collect the results. |
| `std.parallel.parallelFilter(list oftype list oftype dynamic, fn oftype action) -> list oftype dynamic` | `parallel_filter` | Filter a list on worker threads using a predicate function. |
| `std.parallel.parallelForEach(list oftype list oftype dynamic, fn oftype action) -> nothing` | `parallel_for_each` | Run a function over every list item on worker threads for side effects. |
| `std.parallel.parallelReduce(list oftype list oftype dynamic, init oftype dynamic, fn oftype action) -> dynamic` | `parallel_reduce` | Reduce a list on worker threads using an associative reducer function. |

<!-- compiler-api:end -->

## Examples

```fidan wrap=none check=run
use std.parallel as par

var doubled = par.parallelMap([1, 2, 3], action with (certain item oftype integer) returns integer {
    return item * 2
})
```
