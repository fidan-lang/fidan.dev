---
title: "std.math"
sidebarLabel: "std.math"
description: "Numeric transforms, trigonometry, logarithms, constants, predicates, and random helpers, including aliases exposed by the shared stdlib metadata."
summary: "The full math surface, grouped by job rather than by source-file order."
order: 260
---

# std.math

`std.math` contains the numeric helpers you would expect from a core language module.

```fidan
use std.math as math

print(math.sqrt(144))
print(math.clamp(120, 0, 100))
```

## Trigonometry

- `sin(x) -> float`
- `cos(x) -> float`
- `tan(x) -> float`
- `asin(x) -> float`
- `acos(x) -> float`
- `atan(x) -> float`
- `atan2(y, x) -> float`
- `sinh(x) -> float`
- `cosh(x) -> float`
- `tanh(x) -> float`

## Powers, roots, and exponentials

- `sqrt(x) -> float`
- `cbrt(x) -> float`
- `pow(x, y) -> float`
- `exp(x) -> float`
- `exp2(x) -> float`

## Logs

- `log(x) -> float`
- `log2(x) -> float`
- `log10(x) -> float`
- `logN(x, base) -> float`

## Rounding and fractional helpers

- `floor(x) -> integer`
- `ceil(x) -> integer`
- `round(x) -> integer`
- `trunc(x) -> integer`
- `fract(x) -> float`

## Common numeric helpers

- `abs(x) -> dynamic`
- `sign(x) -> integer`
- `min(a, b) -> dynamic`
- `max(a, b) -> dynamic`
- `clamp(x, lo, hi) -> dynamic`
- `hypot(x, y) -> float`

Aliases worth knowing:

- `signum` = `sign`

## Constants

- `pi() -> float`
- `e() -> float`
- `tau() -> float`
- `inf() -> float`
- `nan() -> float`

Aliases:

- `PI`
- `E`
- `TAU`
- `infinity`
- `NaN`

## Numeric predicates

- `isNan(x) -> boolean`
- `isInfinite(x) -> boolean`
- `isFinite(x) -> boolean`

Aliases:

- `isNaN`
- `is_nan`
- `is_infinite`
- `is_finite`

## Random helpers

- `random() -> float`
- `randomInt(lo, hi) -> integer`

## Angle conversion

- `toDeg(x) -> float`
- `toRad(x) -> float`

Aliases:

- `to_deg`
- `degrees`
- `to_rad`
- `radians`

## Typical usage

```fidan
use std.math as math

var angle = math.toRad(45)
var x = math.cos(angle)
var y = math.sin(angle)
var safe = math.clamp(x, 0, 1)
```

## Common usage snippets

### Root and power math

```fidan
use std.math as math

print(math.sqrt(144))
print(math.pow(2, 10))
```

### Rounding

```fidan
use std.math as math

print(math.floor(3.9))
print(math.ceil(3.1))
print(math.round(3.5))
```

### Random integer

```fidan
use std.math as math

var roll = math.randomInt(1, 7)
print(roll)
```

## Notes

- most functions return `float`
- rounding helpers return `integer`
- generic-ish helpers like `abs`, `min`, `max`, and `clamp` preserve a looser return type because they operate across numeric-like runtime values
