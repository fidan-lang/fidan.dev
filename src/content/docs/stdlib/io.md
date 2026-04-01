---
title: "std.io"
sidebarLabel: "std.io"
description: "Console, files, directories, paths, environment convenience, program args, and terminal-related helpers."
summary: "The explicit module for side effects, filesystem work, and shell-facing helpers."
order: 250
---

# std.io

`std.io` is the explicit I/O and filesystem module.

```fidan
use std.io as io

io.writeFile("hello.txt", "Hello")
print(io.readFile("hello.txt"))
```

## Console helpers

### `std.io.print(value...) -> nothing`

Print to stdout with a trailing newline.

### `std.io.eprint(value...) -> nothing`

Print to stderr with a trailing newline.

### `std.io.readLine(prompt?) -> string`

Read one line of input.

### `std.io.flush() -> nothing`

Flush output buffers.

### `std.io.isatty(stream?) -> boolean`

Check whether a stream is attached to a terminal.

## File helpers

### Reads

- `readFile(path) -> string`
- `readLines(path) -> list`

### Writes

- `writeFile(path, content) -> nothing`
- `appendFile(path, content) -> nothing`

### File management

- `deleteFile(path) -> nothing`
- `copyFile(from, to) -> nothing`
- `renameFile(from, to) -> nothing`

### File queries

- `fileExists(path) -> boolean`
- `isFile(path) -> boolean`
- `isDir(path) -> boolean`

## Directory helpers

- `makeDir(path) -> nothing`
- `listDir(path) -> list`

## Path helpers

- `joinPath(part...) -> string`
- `dirname(path) -> string`
- `basename(path) -> string`
- `extension(path) -> string`
- `cwd() -> string`
- `absolutePath(path) -> string`

## Environment convenience

`std.io` also exposes:

- `getEnv(key) -> dynamic`
- `setEnv(key, value) -> nothing`
- `args() -> list`

These overlap conceptually with `std.env`, but `std.io` keeps them near shell/host convenience helpers for scripts that already live in an I/O-heavy module.

## Builtin overlap

Top-level convenience builtins:

- `print`
- `eprint`
- `input`

`std.io` is the namespaced version you should prefer when:

- you want explicit module scoping
- you are already using several stdlib modules
- you want the rest of the I/O/path helpers in the same namespace

## Example

```fidan
use std.io as io

var path = io.joinPath(io.cwd(), "notes.txt")

if io.fileExists(path) {
    print(io.readFile(path))
} otherwise {
    io.writeFile(path, "created")
}
```

## Common usage snippets

### Read a whole file

```fidan
use std.io as io

var content = io.readFile("config.json")
print(content)
```

### Append a log line

```fidan
use std.io as io

io.appendFile("app.log", "started\n")
```

### List a directory

```fidan
use std.io as io

for entry in io.listDir(io.cwd()) {
    print(entry)
}
```

### Build a path safely

```fidan
use std.io as io

var path = io.joinPath(io.cwd(), "data", "users.json")
print(io.absolutePath(path))
```
