---
title: "std.io"
sidebarLabel: "std.io"
description: "Use console and file-system helpers from a single explicit module."
summary: "I/O helpers for console, files, paths, and directories."
order: 250
---

# std.io

`std.io` covers console and file-oriented helpers.

## Common functions

- `io.print(value...)`
- `io.eprint(value...)`
- `io.readLine(prompt?)`
- `io.readFile(path)`
- `io.writeFile(path, content)`
- `io.fileExists(path)`
- `io.listDir(path)`
- `io.cwd()`
- `io.joinPath(part...)`

## Builtin overlap

Top-level `print`, `eprint`, and `input` exist for convenience.
`std.io` is the explicit module version when you want namespaced code.
