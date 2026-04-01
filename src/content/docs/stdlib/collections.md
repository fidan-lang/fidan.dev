---
title: "std.collections"
sidebarLabel: "std.collections"
description: "Range generation, list transforms, and container helpers for sets, queues, stacks, and common sequence operations."
summary: "A practical collection toolkit with readable aliases."
order: 230
---

# std.collections

`std.collections` collects the language-level data helpers that do not belong on the builtin surface.

## Range and sequence helpers

- `range(start, end?) -> list`
- `flatten(list) -> list`
- `zip(left, right) -> list`
- `enumerate(list) -> list`
- `chunk(list, size) -> list`
- `window(list, size) -> list`
- `partition(list) -> list`
- `groupBy(list) -> dict`
- `unique(list) -> list`
- `reverse(list) -> list`
- `sort(list) -> list`
- `concat(left, right) -> list`
- `slice(list, start, end?) -> list`

## Accessors and reducers

- `len(list) -> integer`
- `isEmpty(list) -> boolean`
- `first(list) -> dynamic`
- `last(list) -> dynamic`
- `join(list, separator) -> string`
- `sum(list) -> dynamic`
- `product(list) -> dynamic`
- `min(list) -> dynamic`
- `max(list) -> dynamic`

## Set-like helpers

- `Set(items?) -> dynamic`
- `setAdd(set, value) -> nothing`
- `setRemove(set, value) -> nothing`
- `setContains(set, value) -> boolean`
- `setToList(set) -> list`
- `setLen(set) -> integer`
- `setUnion(left, right) -> dynamic`
- `setIntersect(left, right) -> dynamic`
- `setDiff(left, right) -> dynamic`

Common alias forms:

- `set_add`
- `set_remove`
- `set_contains`
- `set_to_list`
- `set_len`
- `set_union`
- `set_intersect`
- `set_diff`

## Queue helpers

- `Queue(items?) -> dynamic`
- `enqueue(queue, value) -> nothing`
- `dequeue(queue) -> dynamic`
- `peek(queue) -> dynamic`

## Stack helpers

- `Stack(items?) -> dynamic`
- `push(stack, value) -> nothing`
- `pop(stack) -> dynamic`
- `top(stack) -> dynamic`

## Example

```fidan
use std.collections as collections

var ids = collections.range(1, 6)
var indexed = collections.enumerate(ids)
var grouped = collections.chunk(ids, 2)
```
