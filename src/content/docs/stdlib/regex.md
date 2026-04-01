---
title: "std.regex"
sidebarLabel: "std.regex"
description: "Regex match, capture, replace, split, and validation helpers with both canonical and compatibility aliases."
summary: "All regex work in one explicit module."
order: 280
---

# std.regex

`std.regex` gives regular-expression helpers without pushing regex onto the builtin surface.

## Functions

- `test(pattern, subject) -> boolean`
- `match(pattern, subject) -> dynamic`
- `findAll(pattern, subject) -> list`
- `capture(pattern, subject) -> list`
- `captureAll(pattern, subject) -> list`
- `replace(pattern, subject, replacement) -> string`
- `replaceAll(pattern, subject, replacement) -> string`
- `split(pattern, subject) -> list`
- `isValid(pattern) -> boolean`

## Notable aliases

- `isMatch` / `is_match` = `test`
- `find` / `find_first` = `match`
- `matches` = `findAll`
- `exec` = `capture`
- `execAll` / `exec_all` = `captureAll`
- `replaceFirst` / `replace_first` / `sub` = `replace`
- `replace_all` / `gsub` = `replaceAll`
- `is_valid` = `isValid`

## Example

```fidan
use std.regex as regex

if regex.test(r"^\d+$", "12345") {
    print("digits")
}
```
