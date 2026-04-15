---
title: "std.json"
sidebarLabel: "std.json"
description: "Parse, validate, stringify, pretty-print, read, and write JSON through the official stdlib module."
summary: "JSON helpers with soft-error mode and Fidan value round-tripping."
order: 255
---

# std.json

`std.json` handles JSON parsing and serialization without making JSON a global builtin.

## Functions

- `loads(text, soft?) -> dynamic`
- `parse(text, soft?) -> dynamic`
- `load(path, soft?) -> dynamic`
- `dumps(value) -> string`
- `stringify(value) -> string`
- `dump(value, path) -> boolean`
- `pretty(value) -> string`
- `isValid(text) -> boolean`

## Notable aliases

- `parse` = `loads`
- `load` / `readFile` / `read_file` read JSON text from disk and parse it
- `stringify` = `dumps`
- `dump` / `writeFile` / `write_file` serialize and write JSON to disk
- `prettyPrint` / `pretty_print` = `pretty`
- `is_valid` = `isValid`

## Parse text

```fidan wrap=none
use std.json as json

var data = json.loads("[1, 2, 3]")
print(data[0])
```

## Soft mode

Invalid JSON raises `R3005` by default. Pass `true` as the optional soft flag when invalid input should become `nothing` instead.

```fidan wrap=none
use std.json as json

var parsed = json.loads("not json", true)
if parsed is nothing {
    print("invalid json")
}
```

For file reads, soft mode also returns `nothing` when the file is missing or cannot be read.

## Serialize values

```fidan wrap=none
use std.json as json

var payload = {"name": "Ada", "score": 99}
var compact = json.dumps(payload)
var readable = json.pretty(payload)

print(compact)
print(readable)
```

## File helpers

```fidan wrap=none
use std.json as json

var ok = json.dump({"ready": true}, "state.json")
var state = json.load("state.json", true)
```

## Fidan value round-tripping

Plain JSON objects become Fidan dicts, arrays become lists, strings and numbers keep their natural Fidan value types, booleans stay booleans, and JSON `null` becomes `nothing`.

When serializing values that plain JSON cannot represent directly, Fidan uses tagged objects so important runtime shapes can round-trip:

- dicts with non-string keys
- hashsets
- tuples

Runtime-only values that cannot be represented structurally are serialized through their display form.
