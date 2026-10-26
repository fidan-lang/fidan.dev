---
title: "std.test"
sidebarLabel: "std.test"
description: "Assertion helpers used by tests and test-like scripts when you want a namespaced surface instead of the tiny top-level assert builtins."
summary: "Richer assertions for test blocks and validation scripts."
order: 300
---

# std.test

`assertEq`/`assertNe` use recursive test equality: floating tolerance 1e-12 applies inside lists, tuples and dicts as well as at the top level. This does not change exact structural language equality or top-level `assert_eq`. Custom optional messages are honored. These stdlib assertion failures flow through runtime exceptions; top-level explicit assertion failures retain their fatal assertion contract. `skip` signals the test runner; it is not a success assertion.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.test.assert(condition oftype boolean, message oftype string?) -> nothing` | — | Fail when a condition is not truthy. |
| `std.test.assertEq(left oftype dynamic, right oftype dynamic, message oftype string?) -> nothing` | `assert_eq` | Fail when two values are not equal. |
| `std.test.assertNe(left oftype dynamic, right oftype dynamic, message oftype string?) -> nothing` | `assert_ne` | Fail when two values are equal. |
| `std.test.assertGt(left oftype dynamic, right oftype dynamic, message oftype string?) -> nothing` | `assert_gt` | Fail when the left value is not greater than the right value. |
| `std.test.assertLt(left oftype dynamic, right oftype dynamic, message oftype string?) -> nothing` | `assert_lt` | Fail when the left value is not less than the right value. |
| `std.test.assertSome(value oftype dynamic, message oftype dynamic?) -> nothing` | `assert_some` | Fail when a value is `nothing`. |
| `std.test.assertNothing(value oftype dynamic, message oftype dynamic?) -> nothing` | `assert_nothing` | Fail when a value is not `nothing`. |
| `std.test.assertType(value oftype dynamic, typeName oftype string, message oftype string?) -> nothing` | `assert_type` | Fail when a value does not match the expected type name. |
| `std.test.fail(message oftype string?) -> nothing` | — | Unconditionally fail the current test. |
| `std.test.skip(message oftype string?) -> nothing` | — | Mark the current test as skipped. |

<!-- compiler-api:end -->

## Examples

```fidan wrap=none check=run
use std.test as tests

tests.assertEq(2 + 2, 4)
tests.assertSome("Ada")
```
