---
title: "std.math"
sidebarLabel: "std.math"
description: "Numeric transforms, trigonometry, logarithms, constants, predicates, and random helpers, including aliases exposed by the shared stdlib metadata."
summary: "The full math surface, grouped by job rather than by source-file order."
order: 260
---

# std.math

Integer arithmetic operators use checked i64 semantics; `math.pow` is a floating-point stdlib function and is different from the value-dependent integer `**` operator. See [Operators](/docs/language/expressions-and-operators). Domain results may be IEEE NaN/infinity; random output is nondeterministic, so examples validate its bounds rather than predict a number.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.math.sin(x oftype float) -> float` | — | Return the sine of `x` in radians. |
| `std.math.cos(x oftype float) -> float` | — | Return the cosine of `x` in radians. |
| `std.math.tan(x oftype float) -> float` | — | Return the tangent of `x` in radians. |
| `std.math.asin(x oftype float) -> float` | — | Return the inverse sine of `x`. |
| `std.math.acos(x oftype float) -> float` | — | Return the inverse cosine of `x`. |
| `std.math.atan(x oftype float) -> float` | — | Return the inverse tangent of `x`. |
| `std.math.atan2(y oftype float, x oftype float) -> float` | — | Return the quadrant-aware arctangent of `y / x`. |
| `std.math.sinh(x oftype float) -> float` | — | Return the hyperbolic sine of `x`. |
| `std.math.cosh(x oftype float) -> float` | — | Return the hyperbolic cosine of `x`. |
| `std.math.tanh(x oftype float) -> float` | — | Return the hyperbolic tangent of `x`. |
| `std.math.sqrt(x oftype float) -> float` | — | Return the square root of `x`. |
| `std.math.cbrt(x oftype float) -> float` | — | Return the cube root of `x`. |
| `std.math.pow(x oftype float, y oftype float) -> float` | — | Raise `x` to the power `y`. |
| `std.math.exp(x oftype float) -> float` | — | Return `e^x`. |
| `std.math.exp2(x oftype float) -> float` | — | Return `2^x`. |
| `std.math.log(x oftype float) -> float` | — | Return the natural logarithm of `x`. |
| `std.math.log2(x oftype float) -> float` | — | Return the base-2 logarithm of `x`. |
| `std.math.log10(x oftype float) -> float` | — | Return the base-10 logarithm of `x`. |
| `std.math.logN(x oftype float, base oftype float) -> float` | `log_n` | Return the logarithm of `x` in an arbitrary base. |
| `std.math.floor(x oftype float) -> integer` | — | Round `x` down to the nearest integer. |
| `std.math.ceil(x oftype float) -> integer` | — | Round `x` up to the nearest integer. |
| `std.math.round(x oftype float) -> integer` | — | Round `x` to the nearest integer. |
| `std.math.trunc(x oftype float) -> float` | — | Truncate the fractional part of `x`. |
| `std.math.fract(x oftype float) -> float` | — | Return the fractional part of `x`. |
| `std.math.abs(x oftype float) -> dynamic` | — | Return the absolute value of `x`. |
| `std.math.sign(x oftype float) -> dynamic` | `signum` | Return the sign of `x` as `-1`, `0`, or `1`. |
| `std.math.min(a oftype float, b oftype float) -> dynamic` | — | Return the smaller of two numeric values. |
| `std.math.max(a oftype float, b oftype float) -> dynamic` | — | Return the larger of two numeric values. |
| `std.math.clamp(x oftype float, lo oftype float, hi oftype float) -> float` | — | Clamp `x` into the inclusive range `[lo, hi]`. |
| `std.math.hypot(x oftype float, y oftype float) -> float` | — | Return the Euclidean length of a 2D vector. |
| `std.math.pi() -> float` | `PI` | Return the constant π. |
| `std.math.e() -> float` | `E` | Return Euler's number. |
| `std.math.tau() -> float` | `TAU` | Return the constant τ. |
| `std.math.inf() -> float` | `infinity` | Return positive infinity. |
| `std.math.nan() -> float` | `NaN` | Return a NaN floating-point value. |
| `std.math.isNan(x oftype float) -> boolean` | `isNaN`, `is_nan` | Return whether `x` is NaN. |
| `std.math.isInfinite(x oftype float) -> boolean` | `is_infinite` | Return whether `x` is infinite. |
| `std.math.isFinite(x oftype float) -> boolean` | `is_finite` | Return whether `x` is finite. |
| `std.math.random() -> float` | — | Return a pseudo-random float in the range `[0, 1]`. |
| `std.math.randomInt(lo oftype integer, hi oftype integer) -> integer` | `random_int` | Return a pseudo-random integer in the half-open range `[lo, hi)`. |
| `std.math.toDeg(x oftype float) -> float` | `to_deg`, `degrees` | Convert radians to degrees. |
| `std.math.toRad(x oftype float) -> float` | `to_rad`, `radians` | Convert degrees to radians. |

<!-- compiler-api:end -->

## Examples

```fidan check=run
use std.math as math

print(math.sqrt(144))
print(math.clamp(120, 0, 100))
```

```fidan check=run
use std.math as math

var angle = math.toRad(45)
var x = math.cos(angle)
var y = math.sin(angle)
var safe = math.clamp(x, 0, 1)
```

```fidan check=run
use std.math as math

print(math.sqrt(144))
print(math.pow(2, 10))
```

```fidan check=run
use std.math as math

print(math.floor(3.9))
print(math.ceil(3.1))
print(math.round(3.5))
```

```fidan check=run
use std.math as math

var roll = math.randomInt(1, 7)
print(roll)
```
