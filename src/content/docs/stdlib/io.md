---
title: "std.io"
sidebarLabel: "std.io"
description: "Console, files, directories, paths, environment convenience, program args, and terminal-related helpers."
summary: "The explicit module for side effects, filesystem work, and shell-facing helpers."
order: 250
---

# std.io

Paths are resolved against the process working directory, not automatically against the source file. Use `joinPath` instead of concatenating platform separators. `fileExists` checks existence (including directories); use `isFile` when that distinction matters. OS read/write errors are runtime errors, not false success. Sandbox policy applies before access. Examples that write files are tested in disposable directories.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.io.print(value oftype dynamic...) -> nothing` | — | Print values to stdout followed by a newline. |
| `std.io.eprint(value oftype dynamic...) -> nothing` | — | Print values to stderr followed by a newline. |
| `std.io.readLine(prompt oftype string?) -> string` | `read_line`, `readline` | Read one line from stdin, optionally after showing a prompt. |
| `std.io.readFile(path oftype string) -> string` | `read_file` | Read an entire text file into a string. Raises `R3001`/`R3002` on file access failure and `R3004` on permission-denied access. |
| `std.io.readLines(path oftype string) -> list oftype string` | `read_lines` | Read a text file into a list of lines. Raises `R3001`/`R3002` on file access failure and `R3004` on permission-denied access. |
| `std.io.writeFile(path oftype string, content oftype string) -> boolean` | `write_file` | Write a string to a file, replacing existing contents. Raises `R3003` on write failure and `R3004` on permission-denied access. |
| `std.io.appendFile(path oftype string, content oftype string) -> boolean` | `append_file` | Append a string to the end of a file, creating it when needed. Raises `R3003` on write failure and `R3004` on permission-denied access. |
| `std.io.deleteFile(path oftype string) -> boolean` | `delete_file` | Delete a file from disk. Raises `R3009` on deletion failure and `R3004` on permission-denied access. |
| `std.io.fileExists(path oftype string) -> boolean` | `file_exists`, `exists` | Return whether a filesystem path exists. |
| `std.io.isFile(path oftype string) -> boolean` | `is_file` | Return whether a path points to a file. |
| `std.io.isDir(path oftype string) -> boolean` | `is_dir`, `isDirectory`, `is_directory` | Return whether a path points to a directory. |
| `std.io.makeDir(path oftype string) -> boolean` | `make_dir`, `mkdir`, `createDir`, `create_dir` | Create a directory and any missing parent directories. Raises `R3010` on creation failure and `R3004` on permission-denied access. |
| `std.io.listDir(path oftype string) -> list oftype string` | `list_dir`, `readDir`, `read_dir` | List directory entry names as strings. Raises `R3006` on directory-read failure and `R3004` on permission-denied access. |
| `std.io.copyFile(from oftype string, to oftype string) -> boolean` | `copy_file` | Copy a file from one path to another. Raises `R3007` on copy failure and `R3004` on permission-denied access. |
| `std.io.renameFile(from oftype string, to oftype string) -> boolean` | `rename_file`, `moveFile`, `move_file` | Rename or move a file on disk. Raises `R3008` on rename failure and `R3004` on permission-denied access. |
| `std.io.joinPath(part oftype string...) -> string` | `joinPath`, `join_path` | Join path segments into a single path string. |
| `std.io.dirname(path oftype string) -> string` | `dir_name` | Return the parent directory of a path. |
| `std.io.basename(path oftype string) -> string` | `base_name`, `fileName`, `file_name` | Return the final path component of a path. |
| `std.io.extension(path oftype string) -> string` | — | Return the extension portion of a path. |
| `std.io.cwd() -> string` | `currentDir`, `current_dir` | Return the current working directory. |
| `std.io.absolutePath(path oftype string) -> string` | `absolute_path` | Return the canonical absolute path when possible. |
| `std.io.getEnv(key oftype string) -> string` | `get_env`, `env` | Read an environment variable and return `nothing` when it is unset. |
| `std.io.setEnv(key oftype string, value oftype string) -> nothing` | `set_env` | Set an environment variable in the current process. |
| `std.io.args() -> list oftype string` | `argv` | Return the current program arguments passed to the Fidan script. |
| `std.io.flush() -> nothing` | — | Flush stdout. |
| `std.io.isatty(stream oftype string?) -> boolean` | — | Return whether stdin, stdout, or stderr is attached to a terminal. |

<!-- compiler-api:end -->

## Examples

```fidan check=run expect=stdout
use std.io as io

io.writeFile("hello.txt", "Hello")
print(io.readFile("hello.txt"))
```

```text
Hello
```

```fidan check=run
use std.io as io

var path = io.joinPath(io.cwd(), "notes.txt")

if io.fileExists(path) {
    print(io.readFile(path))
} otherwise {
    io.writeFile(path, "created")
    assert_eq(io.readFile(path), "created")
}
assert(io.fileExists(path))
```

For `config.json` containing `{}`:

```fidan check=run context=io-file expect=stdout
use std.io as io

var content = io.readFile("config.json")
print(content)
```

```text
{}
```

```fidan check=run
use std.io as io

io.appendFile("app.log", "started\n")
assert(io.readFile("app.log").endsWith("started\n"))
```

```fidan check=run
use std.io as io

for entry in io.listDir(io.cwd()) {
    print(entry)
}
```

```fidan check=run
use std.io as io

var path = io.joinPath(io.cwd(), "data", "users.json")
print(io.absolutePath(path))
```
