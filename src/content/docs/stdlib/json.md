---
title: "std.json"
sidebarLabel: "std.json"
description: "Parse, validate, stringify, pretty-print, read, and write JSON through the official stdlib module."
summary: "JSON helpers with soft-error mode and Fidan value round-tripping."
order: 255
---

# std.json

Invalid JSON raises `R3005` unless soft mode is explicitly true; soft file reads also return `nothing` for missing/unreadable input. JSON objects become dicts and arrays become lists. Tagged objects preserve non-string-key dicts, tuples and hashsets; runtime-only values use display strings. Never treat a soft `nothing` as a successfully parsed value.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.json.loads(text oftype string, soft oftype boolean?) -> dynamic` | — | Parse JSON text into Fidan dynamic values using dict, list, string, number, boolean, and nothing. Raises `R3005` on invalid JSON unless `soft` is true, in which case it returns `nothing`. |
| `std.json.parse(text oftype string, soft oftype boolean?) -> dynamic` | — | Parse JSON text into Fidan dynamic values using dict, list, string, number, boolean, and nothing. `parse` is a compatibility alias for `loads`. Raises `R3005` on invalid JSON unless `soft` is true, in which case it returns `nothing`. |
| `std.json.load(path oftype string, soft oftype boolean?) -> dynamic` | `readFile`, `read_file` | Read a JSON file from disk and parse it into Fidan dynamic values. Raises `R3001`/`R3002` on file access failure and `R3005` on invalid JSON unless `soft` is true, in which case it returns `nothing`. |
| `std.json.dumps(value oftype dynamic) -> string` | — | Serialize a JSON-compatible Fidan value into compact JSON text. Unsupported runtime-only values are stringified via their display form. |
| `std.json.stringify(value oftype dynamic) -> string` | — | Serialize a JSON-compatible Fidan value into compact JSON text. `stringify` is a compatibility alias for `dumps`. Unsupported runtime-only values are stringified via their display form. |
| `std.json.dump(value oftype dynamic, path oftype string) -> boolean` | `writeFile`, `write_file` | Serialize a JSON-compatible Fidan value and write it directly to a file path, returning whether the write succeeded. |
| `std.json.pretty(value oftype dynamic) -> string` | `prettyPrint`, `pretty_print` | Serialize a JSON-compatible Fidan value into indented JSON text for logs, snapshots, and debugging output. |
| `std.json.isValid(text oftype string) -> boolean` | `is_valid` | Return whether the provided string is valid JSON without materializing the parsed value. |

<!-- compiler-api:end -->

## Examples

```fidan wrap=none check=run
use std.json as json

var data = json.loads("[1, 2, 3]")
print(data[0])
```

```fidan wrap=none check=run
use std.json as json

var parsed = json.loads("not json", true)
if parsed is nothing {
    print("invalid json")
}
```

```fidan wrap=none check=run
use std.json as json

var payload = {"name": "Ada", "score": 99}
var compact = json.dumps(payload)
var readable = json.pretty(payload)

print(compact)
print(readable)
```

```fidan wrap=none check=run
use std.json as json

var ok = json.dump({"ready": true}, "state.json")
var state = json.load("state.json", true)
```
