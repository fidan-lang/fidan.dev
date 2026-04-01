---
title: "Strings and raw strings"
sidebarLabel: "Strings"
description: "Normal strings support interpolation and escapes; raw strings stay literal. This page covers both, including brace escaping and the current raw-string limits."
summary: "Interpolation when you want it, literal text when you do not."
order: 140
---

# Strings and raw strings

Strings are one of the places where Fidan is deliberately ergonomic.

## Normal strings

Normal strings use double quotes:

```fidan
var name = "Ada"
print("Hello, {name}")
```

Normal strings support:

- interpolation
- escape sequences
- multiline composition through `\n` or multiple literals

## Interpolation

Use `{...}` inside a normal string:

```fidan
var name = "Ada"
var score = 42

print("Hello, {name}")
print("Score: {score}")
print("2 + 2 = {2 + 2}")
```

Interpolated expressions can be richer than plain variable lookups:

```fidan
print("Upper: {name.toUpper()}")
print("Sqrt: {math.sqrt(144)}")
```

## Supported escapes

Normal strings understand:

- `\\`
- `\"`
- `\n`
- `\t`
- `\r`
- `\{`
- `\}`

Examples:

```fidan
print("line1\nline2")
print("quote: \"")
print("slash: \\")
print("literal braces: \{name\}")
```

## Literal braces in interpolated strings

Because `{...}` starts interpolation, use escaped braces for literal braces:

```fidan
print("literal \{name\} stays literal")
```

If you want the entire string to stay literal, a raw string is often cleaner.

## Raw strings

Raw strings use the `r"..."` form:

```fidan
var pattern = r"\d+\s+items"
var literal = r"{name} stays literal"
```

Raw strings:

- do **not** process escapes
- do **not** interpolate
- keep backslashes and braces literal

That makes them ideal for:

- regexes
- path-like patterns
- embedded templates
- snippets where escape noise would hurt readability

## Current raw-string limitation

Today, raw strings are the simple `r"..."` form only.

That means:

- the next `"` ends the raw string
- there is no hash-delimited raw string form like `r#"..."#`

So when you need embedded quotes, use a normal string instead:

```fidan
var quote = "\""
```

## `std.string.format(...)` vs interpolation

Most code should prefer normal interpolation:

```fidan
print("Hello, {name}")
```

But Fidan also provides `std.string.format(template, value...)` when you want placeholder-style formatting driven from data rather than direct source interpolation.

## Recommended style

- use normal strings by default
- use interpolation for direct, readable formatting
- use raw strings when regexes or literal braces/backslashes would otherwise become noisy
- prefer escaped literal braces in a normal string only when the string still benefits from interpolation elsewhere

Example:

```fidan
var user = "Ada"
var query = r"^\w+\s+\d+$"

print("Searching for {user} with pattern {query}")
print("Literal placeholder: \{user\}")
```
