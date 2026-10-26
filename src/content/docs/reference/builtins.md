---
title: "Builtins"
sidebarLabel: "Builtins"
description: "The complete top-level builtin surface: what is reserved globally, what each builtin does, and where the boundary between builtins and stdlib lives."
summary: "Every top-level builtin and the rules around it."
order: 620
---

# Builtins

The 15 global bindings below come from `fidan-config`, not a second documentation
signature table. Names are reserved; module-only functions need explicit imports.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Builtin signature | Contract |
| --- | --- |
| `print(value...) -> nothing` | Print values to stdout followed by a newline. |
| `eprint(value...) -> nothing` | Print values to stderr followed by a newline. |
| `input(prompt?) -> string` | Read one line of input, optionally after showing a prompt. |
| `len(value) -> integer` | Return the length of a string, list, or other countable value. |
| `type(value) -> string` | Return the runtime type name of a value as a string. |
| `hashset(items?) -> hashset` | Create a real hashset of unique, hashable values from a list or another hashset. |
| `string(value) -> string` | Convert a value to its string representation. |
| `integer(value) -> integer` | Convert a value to an integer when possible. |
| `float(value) -> float` | Convert a value to a floating-point number when possible. |
| `boolean(value) -> boolean` | Convert a value to a boolean truth value. |
| `Shared(value) -> Shared` | Create a shared, thread-safe wrapper so values can be mutated safely across parallel work. |
| `WeakShared(shared) -> WeakShared` | Create a non-owning weak handle to an existing Shared value. Use `upgrade()` to recover a Shared while it is still alive. |
| `assert(condition, message?) -> nothing` | Fail immediately when the condition is not truthy. |
| `assert_eq(left, right, message?) -> nothing` | Fail immediately when two values are not equal. |
| `assert_ne(left, right, message?) -> nothing` | Fail immediately when two values are equal. |

<!-- compiler-api:end -->

## Conversions and errors

`integer` accepts Integer, Float, Boolean and parseable String. Float conversion
truncates fractional values; Rust's existing cast saturates out-of-range values
and maps NaN to zero. `float` accepts Integer, Float and parseable String, **not**
Boolean. Invalid conversions raise catchable `R0001`. Numeric String receivers
such as `.toInt()` trim whitespace; the top-level conversion does not implicitly
trim. `boolean(value)` explicitly uses truthiness; logical `and/or/not` instead
require Boolean operands. `.toBool()` on String recognizes trimmed case-insensitive
`true`, `1` and `yes`, otherwise false. These are separate contracts.

```fidan check=run
assert_eq(integer("123"), 123)
assert_eq(integer(true), 1)
assert_eq(float("1.5"), 1.5)
assert_eq(" 42 ".toInt(), 42)
assert_eq("YES".toBool(), true)
```

## Length, input and output

`len` supports String (Unicode scalars), List, Dict, HashSet, Tuple and Range.
Unsupported values and unrepresentable range lengths raise `R0001`; an actual
index-out-of-bounds error is `R2002`. `print`/`eprint` separate arguments with spaces
and append a newline. `input` removes the terminating newline; EOF is a successful
empty string, while a real host read failure is `R0001`. There is no `println` or
`eprintln`. Operational logs never replace these application-output contracts.

## Shared and weak handles

`Shared(value)` takes exactly one value. `get`/`set` individually synchronize;
`update(callback)` holds the lock across the whole callback transformation T -> T
and returns the new value. A failing callback leaves the old value. Recursive
access to the same locked handle is rejected instead of self-deadlocking.
`WeakShared(shared)` accepts a Shared or WeakShared, not arbitrary dynamic values.

```fidan check=run
var counter = Shared(0)
counter.update(action with (certain value oftype integer) returns integer {
    return value + 1
})
var weak = WeakShared(counter)
assert_eq(weak.upgrade().get(), 1)
```

## Hashsets

`hashset()` creates an empty set; a List or HashSet argument initializes/copies it.
Unsupported source types and unhashable list elements raise catchable `R0001`.
See [Collections](/docs/language/collections-and-enums).

## Assertion equality and messages

Top-level `assert_eq`/`assert_ne` use exact recursive structural equality, including
nested collections; numeric cross-type values compare numerically. They honor an
optional message and otherwise generate a default failure explanation. Top-level
explicit assertions/panic retain their native fatal behavior; this page does not
promise every such failure is catchable. Use [std.test](/docs/stdlib/test) for its
separate tolerant floating comparison contract.

```fidan check=run
assert_eq([1, ("Ada", 2)], [1, ("Ada", 2)], "nested values differ")
assert_ne("a", "b", "expected distinct names")
assert(true, "expected true")
```

All receiver methods and aliases are listed in the [receiver reference](/docs/reference/receiver-methods).

## Explicit truth conversion

`boolean(value)` is separate from strict Boolean logical operators. It preserves Boolean values; `nothing`, numeric/handle zero, empty Strings and empty HashSets are false. Nonempty Ranges are true; WeakShared truth follows liveness. Other current value categories, including empty Lists/Dicts, are true. Do not assume Python collection truthiness.

```fidan check=run
assert_eq(boolean(nothing), false)
assert_eq(boolean(0), false)
assert_eq(boolean(""), false)
assert_eq(boolean([]), true)
assert_eq(boolean({}), true)
assert_eq(boolean(hashset()), false)
```

### Scripted standard input

With the input line `Ada` followed by a newline, this program checks the returned value. EOF is different from a host read failure; EOF returns an empty String successfully.

```fidan check=run id=stdin-source
assert_eq(input(), "Ada")
```
