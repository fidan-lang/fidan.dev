---
title: "std.string"
sidebarLabel: "std.string"
description: "String transforms, parsing, slicing, casing, character/codepoint helpers, and formatting utilities."
summary: "The full string toolbox beyond interpolation."
order: 290
---

# std.string

Length, searches, indexing and slicing use Unicode scalar indices, not UTF-8 byte offsets or grapheme clusters. `bytes` explicitly returns UTF-8 bytes. Receiver `substring`/`substr`/`slice` aliases clamp normalized bounds and return empty for reversed positive bounds; bracket slicing also supports negative steps. `parseInt`/`parseFloat` return `nothing` on invalid text; top-level `integer`/`float` instead raise an error. See [Strings](/docs/language/strings-and-raw-strings).

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.string.toUpper(text oftype string) -> string` | `upper`, `to_upper` | Uppercase a string. |
| `std.string.toLower(text oftype string) -> string` | `lower`, `to_lower` | Lowercase a string. |
| `std.string.capitalize(text oftype string) -> string` | — | Uppercase the first character of a string. |
| `std.string.trim(text oftype string) -> string` | — | Trim leading and trailing whitespace. |
| `std.string.trimStart(text oftype string) -> string` | `ltrim`, `trim_start` | Trim leading whitespace. |
| `std.string.trimEnd(text oftype string) -> string` | `rtrim`, `trim_end` | Trim trailing whitespace. |
| `std.string.split(text oftype string, separator oftype string) -> list oftype string` | — | Split a string into a list. |
| `std.string.join(separator oftype string, list oftype list oftype dynamic) -> string` | — | Join a list of values into a string. |
| `std.string.lines(text oftype string) -> list oftype string` | — | Split a string into lines. |
| `std.string.contains(text oftype string, pattern oftype string) -> boolean` | — | Return whether a string contains a substring. |
| `std.string.startsWith(text oftype string, prefix oftype string) -> boolean` | `starts_with` | Return whether a string starts with a prefix. |
| `std.string.endsWith(text oftype string, suffix oftype string) -> boolean` | `ends_with` | Return whether a string ends with a suffix. |
| `std.string.indexOf(text oftype string, pattern oftype string) -> integer` | `index_of` | Return the first substring index or `-1`. |
| `std.string.lastIndexOf(text oftype string, pattern oftype string) -> integer` | `last_index_of` | Return the last substring index or `-1`. |
| `std.string.replace(text oftype string, from oftype string, to oftype string) -> string` | — | Replace every exact substring occurrence. |
| `std.string.replaceFirst(text oftype string, from oftype string, to oftype string) -> string` | `replace_first` | Replace the first exact substring occurrence. |
| `std.string.slice(text oftype string, start oftype integer, end oftype integer?) -> string` | `substr` | Return a substring by character range. |
| `std.string.padStart(text oftype string, width oftype integer, pad oftype string?) -> string` | `pad_start` | Pad a string on the left to a minimum width. |
| `std.string.padEnd(text oftype string, width oftype integer, pad oftype string?) -> string` | `pad_end` | Pad a string on the right to a minimum width. |
| `std.string.repeat(text oftype string, n oftype integer) -> string` | — | Repeat a string `n` times. |
| `std.string.reverse(text oftype string) -> string` | — | Reverse a string by characters. |
| `std.string.len(text oftype string) -> integer` | `length` | Return the character length of a string. |
| `std.string.isEmpty(text oftype string) -> boolean` | `is_empty` | Return whether a string is empty. |
| `std.string.format(template oftype string, value oftype dynamic...) -> string` | — | Replace `{}` placeholders in order with values. |
| `std.string.parseInt(text oftype string) -> integer` | `parse_int` | Parse a string into an integer or return `nothing`. |
| `std.string.parseFloat(text oftype string) -> float` | `parse_float` | Parse a string into a float or return `nothing`. |
| `std.string.chars(text oftype string) -> list oftype string` | — | Return the characters of a string as a list of one-character strings. |
| `std.string.bytes(text oftype string) -> list oftype integer` | — | Return the bytes of a string as integers. |
| `std.string.fromChars(chars oftype list oftype dynamic) -> string` | `from_chars` | Build a string from a list of one-character strings. |
| `std.string.charCode(text oftype string) -> integer` | `char_code` | Return the codepoint of the first character in a string. |
| `std.string.fromCharCode(code oftype integer) -> string` | `from_char_code` | Build a one-character string from a numeric codepoint. |

<!-- compiler-api:end -->

## Examples

```fidan check=run expect=stdout
use std.string as string

var slug = string.toLower("Hello World")
slug = string.replace(slug, " ", "-")
print(slug)
```

```text
hello-world
```

```fidan check=run
use std.string as string

var port = string.parseInt("8080")
var ratio = string.parseFloat("3.14")
assert_eq(port, 8080)
assert_eq(ratio, 3.14)
```

```fidan check=run expect=stdout
use std.string as string

var parts = string.split("a,b,c", ",")
print(string.join(" | ", parts))
```

```text
a | b | c
```

```fidan check=run expect=stdout
use std.string as string

print(string.charCode("A"))
print(string.fromCharCode(65))
```

```text
65
A
```
