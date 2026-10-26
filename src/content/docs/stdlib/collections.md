---
title: "std.collections"
sidebarLabel: "std.collections"
description: "Range generation, list transforms, and container helpers for sets, queues, stacks, and common sequence operations."
summary: "A practical collection toolkit with readable aliases."
order: 230
---

# std.collections

These are free functions over collections. `range` requires start and stop and optionally step; brackets provide lazy language ranges instead. Set/queue/stack helpers operate on the returned collection value. Use the [receiver reference](/docs/reference/receiver-methods) for in-place List methods and [Collections and enums](/docs/language/collections-and-enums) for equality, keys and indexing.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.collections.range(start oftype integer, stop oftype integer, step oftype integer?) -> list oftype integer` | — | Create a numeric range as a list of integers. |
| `std.collections.hashset(items oftype dynamic?) -> hashset oftype dynamic` | — | Create a real hashset of unique, hashable values. |
| `std.collections.setAdd(set oftype hashset oftype dynamic, value oftype dynamic) -> nothing` | `set_add` | Insert a value into a set-like collection. |
| `std.collections.setRemove(set oftype hashset oftype dynamic, value oftype dynamic) -> nothing` | `set_remove` | Remove a value from a set-like collection. |
| `std.collections.setContains(set oftype hashset oftype dynamic, value oftype dynamic) -> boolean` | `set_contains` | Check whether a set-like collection contains a value. |
| `std.collections.setToList(set oftype hashset oftype dynamic) -> list oftype dynamic` | `set_to_list` | Convert a set-like collection to a list. |
| `std.collections.setLen(set oftype hashset oftype dynamic) -> integer` | `set_len` | Return the number of values in a set-like collection. |
| `std.collections.setUnion(left oftype hashset oftype dynamic, right oftype hashset oftype dynamic) -> hashset oftype dynamic` | `set_union` | Return the union of two set-like collections. |
| `std.collections.setIntersect(left oftype hashset oftype dynamic, right oftype hashset oftype dynamic) -> hashset oftype dynamic` | `set_intersect` | Return the intersection of two set-like collections. |
| `std.collections.setDiff(left oftype hashset oftype dynamic, right oftype hashset oftype dynamic) -> hashset oftype dynamic` | `set_diff` | Return the values present in the left set-like collection but not the right one. |
| `std.collections.Queue(items oftype list oftype dynamic?) -> list oftype dynamic` | — | Create a FIFO queue-backed collection. |
| `std.collections.enqueue(queue oftype list oftype dynamic, value oftype dynamic) -> nothing` | — | Push a value onto the back of a queue. |
| `std.collections.dequeue(queue oftype list oftype dynamic) -> dynamic` | — | Pop and return the front value from a queue. |
| `std.collections.peek(queue oftype list oftype dynamic) -> dynamic` | — | Return the next queue value without removing it. |
| `std.collections.Stack(items oftype list oftype dynamic?) -> list oftype dynamic` | — | Create a LIFO stack-backed collection. |
| `std.collections.push(stack oftype list oftype dynamic, value oftype dynamic) -> nothing` | — | Push a value onto the top of a stack. |
| `std.collections.pop(stack oftype list oftype dynamic) -> dynamic` | — | Pop and return the top value from a stack or list-like collection. |
| `std.collections.top(stack oftype list oftype dynamic) -> dynamic` | `stackPeek`, `stack_peek` | Return the top stack value without removing it. |
| `std.collections.flatten(list oftype list oftype dynamic) -> list oftype dynamic` | — | Flatten one level of nested list values. |
| `std.collections.zip(left oftype list oftype dynamic, right oftype list oftype dynamic) -> list oftype (dynamic, dynamic)` | — | Pair elements from two lists positionally. |
| `std.collections.enumerate(list oftype list oftype dynamic) -> list oftype (integer, dynamic)` | — | Pair each list item with its index. |
| `std.collections.chunk(list oftype list oftype dynamic, size oftype integer) -> list oftype list oftype dynamic` | — | Split a list into fixed-size chunks. |
| `std.collections.window(list oftype list oftype dynamic, size oftype integer) -> list oftype list oftype dynamic` | — | Return sliding windows over a list. |
| `std.collections.partition(list oftype list oftype dynamic) -> (list oftype dynamic, list oftype dynamic)` | — | Split a list into truthy and falsy groups. |
| `std.collections.groupBy(list oftype list oftype dynamic) -> dict oftype (dynamic, list oftype dynamic)` | `group_by` | Group list items by key into a dictionary of lists. |
| `std.collections.unique(list oftype list oftype dynamic) -> list oftype dynamic` | `dedup` | Return a list with duplicate values removed. |
| `std.collections.reverse(list oftype list oftype dynamic) -> list oftype dynamic` | — | Return a reversed copy of a list. |
| `std.collections.sort(list oftype list oftype dynamic) -> list oftype dynamic` | — | Return a sorted copy of a list. |
| `std.collections.len(list oftype dynamic) -> integer` | `length`, `len` | Return the number of items in a collection. |
| `std.collections.isEmpty(list oftype list oftype dynamic) -> boolean` | `is_empty` | Return whether a collection has no items. |
| `std.collections.concat(items oftype list oftype dynamic...) -> list oftype dynamic` | — | Concatenate two lists into a new list. |
| `std.collections.slice(list oftype list oftype dynamic, start oftype integer, end oftype integer?) -> list oftype dynamic` | — | Return a slice of a list. |
| `std.collections.first(list oftype list oftype dynamic) -> dynamic` | — | Return the first item in a list or `nothing` when empty. |
| `std.collections.last(list oftype list oftype dynamic) -> dynamic` | — | Return the last item in a list or `nothing` when empty. |
| `std.collections.join(list oftype list oftype dynamic, separator oftype string) -> string` | — | Join a list of displayable values into a string. |
| `std.collections.sum(list oftype list oftype dynamic) -> dynamic` | — | Sum numeric values in a list. |
| `std.collections.product(list oftype list oftype dynamic) -> dynamic` | — | Multiply numeric values in a list. |
| `std.collections.min(list oftype list oftype dynamic) -> dynamic` | — | Return the minimum numeric value in a list. |
| `std.collections.max(list oftype list oftype dynamic) -> dynamic` | — | Return the maximum numeric value in a list. |

<!-- compiler-api:end -->

## Examples

```fidan check=run
use std.collections as collections

var ids = collections.range(1, 6)
var indexed = collections.enumerate(ids)
var grouped = collections.chunk(ids, 2)
assert_eq(ids, [1, 2, 3, 4, 5])
assert_eq(grouped, [[1, 2], [3, 4], [5]])
assert_eq(indexed[0][0], 0)
assert_eq(indexed[0][1], 1)
```
