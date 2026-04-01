---
title: "std.string"
sidebarLabel: "std.string"
description: "String transforms, parsing, slicing, casing, character/codepoint helpers, and formatting utilities."
summary: "The full string toolbox beyond interpolation."
order: 290
---

# std.string

`std.string` contains the everyday transforms and parsing helpers you will use around text-heavy code.

## Casing and trim

- `toUpper(text) -> string`
- `toLower(text) -> string`
- `capitalize(text) -> string`
- `trim(text) -> string`
- `trimStart(text) -> string`
- `trimEnd(text) -> string`

Aliases:

- `upper`
- `lower`
- `to_upper`
- `to_lower`
- `ltrim`
- `rtrim`
- `trim_start`
- `trim_end`

## Searching and replacement

- `contains(text, pattern) -> boolean`
- `startsWith(text, prefix) -> boolean`
- `endsWith(text, suffix) -> boolean`
- `indexOf(text, pattern) -> integer`
- `lastIndexOf(text, pattern) -> integer`
- `replace(text, from, to) -> string`
- `replaceFirst(text, from, to) -> string`

Aliases:

- `starts_with`
- `ends_with`
- `index_of`
- `last_index_of`
- `replace_first`

## Splitting and joining

- `split(text, separator) -> list`
- `join(separator, list) -> string`
- `lines(text) -> list`

## Shape helpers

- `slice(text, start, end?) -> string`
- `padStart(text, width, pad?) -> string`
- `padEnd(text, width, pad?) -> string`
- `repeat(text, n) -> string`
- `reverse(text) -> string`
- `len(text) -> integer`
- `isEmpty(text) -> boolean`

Aliases:

- `substr` = `slice`
- `pad_start`
- `pad_end`
- `length` = `len`
- `is_empty` = `isEmpty`

## Formatting and parsing

- `format(template, value...) -> string`
- `parseInt(text) -> dynamic`
- `parseFloat(text) -> dynamic`

Aliases:

- `parse_int`
- `parse_float`

## Characters and bytes

- `chars(text) -> list`
- `bytes(text) -> list`
- `fromChars(chars) -> string`
- `charCode(text) -> integer`
- `fromCharCode(code) -> string`

Aliases:

- `from_chars`
- `char_code`
- `from_char_code`

## Example

```fidan
use std.string as string

var slug = string.toLower("Hello World")
slug = string.replace(slug, " ", "-")
print(slug)
```

## Common usage snippets

### Parse text into numbers

```fidan
use std.string as string

var port = string.parseInt("8080")
var ratio = string.parseFloat("3.14")
```

### Split and join

```fidan
use std.string as string

var parts = string.split("a,b,c", ",")
print(string.join(" | ", parts))
```

### Character/codepoint helpers

```fidan
use std.string as string

print(string.charCode("A"))
print(string.fromCharCode(65))
```
