---
title: "Expressions and operators"
description: "Boolean short-circuiting, numeric errors, shifts, equality and evaluation order."
summary: "Boolean short-circuiting, numeric errors, shifts, equality and evaluation order."
order: 112
---

# Expressions and operators

## Boolean operators are lazy and Boolean-only

`and` and `or` (also `&&` and `||`) evaluate their left operand first. `false and rhs` and `true or rhs` do not execute `rhs`. `true and rhs` and `false or rhs` evaluate it once. `not`/`!` accepts a Boolean. These operators do not use general truthiness.

Both operands are still statically checked. Unreachable code is not exempt from syntax/name/type diagnostics. A dynamic invalid right operand raises a runtime error only if it is evaluated. This is an intentional compatibility change from the older eager behavior: code must not depend on side effects in a skipped right operand.

```fidan check=run
var calls = Shared(0)
action rhs returns boolean {
    calls.update(action with (certain n oftype integer) returns integer { return n + 1 })
    return true
}
assert_eq(false and rhs(), false)
assert_eq(true or rhs(), true)
assert_eq(calls.get(), 0)
assert_eq(true and rhs(), true)
assert_eq(false or rhs(), true)
assert_eq(calls.get(), 2)
var invalid oftype flexible = 42
assert_eq(false and invalid, false)
var caught = false
attempt { var result = true and invalid } catch error { caught = true }
assert(caught)
```

```fidan check=error error=E0203
var invalid = false and 42
```

## Checked integer arithmetic

Integers are signed 64-bit values. Addition, subtraction, multiplication, unary negation and nonnegative integer powers report `R2003` when the result cannot be represented. `MIN / -1` and `MIN % -1` are also checked; division or remainder by zero is `R2001`. These failures are Fidan runtime errors, not host-language panics or native hardware traps.

Integer powers have a value-dependent result category:

- Nonnegative integer exponent: checked Integer result.
- Negative integer exponent with base zero: `R2001`.
- Negative exponent with base `1` or `-1`: exact Integer result, determined by parity.
- Other integer bases with negative exponents: Float result.

The compiler infers a precise result category when proven; otherwise it uses flexible/dynamic representation rather than claiming every integer power returns Integer.

```fidan check=run
assert_eq(2 ** -3, 0.125)
assert_eq(10 ** -2, 0.01)
assert_eq(1 ** -999, 1)
assert_eq((-1) ** -3, -1)
assert_eq((-1) ** -4, 1)
assert_eq(type(2 ** 3), "integer")
assert_eq(type(2 ** -3), "float")
```

Mixed Integer/Float arithmetic has Float result semantics. Optimizations must preserve that category, floating edge cases, runtime errors and observable effects. Unary `+` is the existing identity operation; it is not a numeric conversion.

## Bitwise operators and shifts

`&`, `|`, `^`, `<<` and `>>` require Integer operands. Known invalid types are `E0203`; dynamic invalid operands raise a runtime type error. Shifts use `effective_shift = count & 63`, including negative counts. Right shift is arithmetic (sign-preserving).

```fidan check=run
assert_eq(1 << 0, 1)
assert_eq(1 << 64, 1)
assert_eq(1 << 65, 2)
assert_eq(8 >> 65, 4)
assert_eq(-8 >> 65, -4)
assert_eq(1 << -1, 1 << 63)
assert_eq(6 & 3, 2)
```

## Ordering and equality are different contracts

Ordering (`<`, `<=`, `>`, `>=`) supports numeric pairs (including mixed Integer/Float) and String/String. Known unsupported combinations are `E0203`; dynamic operands are validated at runtime. String ordering follows the string representation's lexicographic order.

General `==`/`!=` supports more cases, including Boolean, `nothing`, enum values, numeric cross-type equality and structural collections. Objects retain their implemented identity semantics. It does not inherit `std.test`'s float tolerance. Core `assert_eq` is exact structural equality; `std.test.assertEq` applies its tolerance recursively inside supported collections.

## Evaluation and conditional expressions

Call arguments are evaluated in source order before invocation. Conditional expressions evaluate the condition and only the selected branch. `value ?? fallback` evaluates the fallback only when the value is `nothing`. Defaults run when the caller omits the corresponding argument; inspecting callable metadata does not execute them. Parenthesize combinations when clarity matters instead of depending on a dense chain of precedence rules.

Use explicit `value != nothing and ...` guards for nullable values. A `certain` parameter rejects `nothing`; an ordinary typed binding is not by itself a non-null proof.

## String concatenation

A String left operand supports concatenation with other values using their display representation. A flexible value retains runtime dispatch; optimizing `value + 0` into `value` would be incorrect when it contains a String. Invalid dynamic arithmetic must retain its runtime type error.

```fidan check=run
assert_eq("text" + 3, "text3")
var text oftype flexible = "item"
assert_eq(text + 0, "item0")
```
