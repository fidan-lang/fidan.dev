---
title: "std.regex"
sidebarLabel: "std.regex"
description: "Regex match, capture, replace, split, and validation helpers with both canonical and compatibility aliases."
summary: "All regex work in one explicit module."
order: 280
---

# std.regex

Patterns use the Rust regex engine: backreferences and look-around are not part of that engine. Prefer raw strings for patterns. `test` answers whether a match exists; capture/match functions have different result shapes, described below. Invalid patterns are errors unless using the explicit validity helper. Replacement syntax belongs to the regex engine, not Fidan string interpolation.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.regex.test(pattern oftype string, subject oftype string) -> boolean` | `isMatch`, `is_match` | Return whether the pattern matches the subject string. |
| `std.regex.match(pattern oftype string, subject oftype string) -> string` | `find`, `find_first` | Return the first match or `nothing` when no match exists. |
| `std.regex.findAll(pattern oftype string, subject oftype string) -> list oftype string` | `find_all`, `matches` | Return every match as a list of strings. |
| `std.regex.capture(pattern oftype string, subject oftype string) -> list oftype dynamic` | `exec` | Return the first match and capture groups as a list. |
| `std.regex.captureAll(pattern oftype string, subject oftype string) -> list oftype list oftype dynamic` | `capture_all`, `execAll`, `exec_all` | Return all match capture groups as a list of lists. |
| `std.regex.replace(pattern oftype string, subject oftype string, replacement oftype string) -> string` | `replaceFirst`, `replace_first`, `sub` | Replace the first regex match in a string. |
| `std.regex.replaceAll(pattern oftype string, subject oftype string, replacement oftype string) -> string` | `replace_all`, `gsub` | Replace every regex match in a string. |
| `std.regex.split(pattern oftype string, subject oftype string) -> list oftype string` | — | Split a string by a regex pattern. |
| `std.regex.isValid(pattern oftype string) -> boolean` | `is_valid` | Return whether a regex pattern compiles successfully. |

<!-- compiler-api:end -->

## Examples

```fidan check=run expect=stdout
use std.regex as regex

if regex.test(r"^\d+$", "12345") {
    print("digits")
}
```

```text
digits
```
