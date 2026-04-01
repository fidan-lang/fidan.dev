---
title: "std.test"
sidebarLabel: "std.test"
description: "Assertion helpers used by tests and test-like scripts when you want a namespaced surface instead of the tiny top-level assert builtins."
summary: "Richer assertions for test blocks and validation scripts."
order: 300
---

# std.test

`std.test` expands on the small builtin assertion surface.

## Functions

- `assert(condition, message?) -> nothing`
- `assertEq(left, right, message?) -> nothing`
- `assertNe(left, right, message?) -> nothing`
- `assertGt(left, right, message?) -> nothing`
- `assertLt(left, right, message?) -> nothing`
- `assertSome(value, message?) -> nothing`
- `assertNothing(value, message?) -> nothing`
- `assertType(value, typeName, message?) -> nothing`
- `fail(message?) -> nothing`
- `skip(message?) -> nothing`

Aliases:

- `assert_eq`
- `assert_ne`
- `assert_gt`
- `assert_lt`
- `assert_some`
- `assert_nothing`
- `assert_type`

## Example

```fidan
use std.test as test

test.assertEq(2 + 2, 4)
test.assertSome("Ada")
```
