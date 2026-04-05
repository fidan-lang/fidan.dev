---
title: "CLI"
sidebarLabel: "CLI"
description: "The complete `fidan` command-line surface: run modes, build modes, analysis tools, self-management, toolchains, and Dal integration."
summary: "Every command, the important flags, and how the commands fit together."
order: 310
---

# CLI

The `fidan` binary is the front door to the language, the runtime modes, the formatter, the LSP, the toolchain installer, and the Dal package flow.

## Command overview

Current top-level commands:

- `fidan run`
- `fidan build`
- `fidan profile`
- `fidan test`
- `fidan repl`
- `fidan lsp`
- `fidan format`
- `fidan check`
- `fidan fix`
- `fidan explain`
- `fidan new`
- `fidan self`
- `fidan toolchain`
- `fidan dal`

## `fidan run`

Run a Fidan source file through the interpreter, optionally with JIT hot-path compilation.

```bash
fidan run app.fdn
```

### Important flags

- `--emit tokens|ast|hir|mir`
- `--trace none|short|full|compact`
- `--max-errors N`
- `--jit-threshold N`
- `--strict`
- `--reload`
- `--replay <id-or-path>`
- `--suppress CODE1,CODE2`
- `--sandbox`
- `--allow-read path1,path2`
- `--allow-write path1,path2`
- `--allow-env`
- `--time-limit N`
- `--mem-limit N`

### Program arguments

Pass script arguments after `--`:

```bash
fidan run bench.fdn --trace full -- 5000000 2000000 2000000
```

Inside the script, `std.env.args()` and `std.io.args()` see the script-facing arguments, not the host CLI wrapper.

## `fidan build`

Compile a source file to a native binary.

```bash
fidan build app.fdn --output app
```

### Important flags

- `--output <path>`
- `--opt O0|O1|O2|O3|Os|Oz`
- `--release`
- `--lto off|full`
- `--strip off|symbols|all`
- `--emit tokens|ast|hir|mir|obj`
- `--lib-dir <path>`
- `--link-runtime static|dynamic`
- `--linker <path-or-name>`
- `--strict`
- `--suppress CODE1,CODE2`
- `--backend auto|cranelift|llvm`
- `--target-cpu <spec>`

### `--release`

`--release` is the aggressive performance preset.

If you do not override the related flags manually, `--release` implies:

- `--opt O3`
- `--lto full`
- `--strip all`
- `--target-cpu native`

If you do supply an explicit override, it wins:

```bash
fidan build app.fdn --release --target-cpu generic
```

### `--target-cpu`

Portable default:

```bash
fidan build app.fdn
```

Host-tuned:

```bash
fidan build app.fdn --target-cpu native
```

Custom CPU name:

```bash
fidan build app.fdn --target-cpu znver4
```

Custom CPU plus feature string:

```bash
fidan build app.fdn --target-cpu znver4,+avx2,-avx512f
```

`native` resolves to the actual LLVM host CPU name plus host feature string in the LLVM backend. The portable default remains `generic`.

### `--backend`

- `auto` prefers a compatible installed LLVM toolchain, otherwise falls back to Cranelift
- `cranelift` forces the Rust-native backend
- `llvm` forces the LLVM backend and requires the optional toolchain to be installed

## `fidan profile`

Run a Fidan file with profiling output:

```bash
fidan profile app.fdn
fidan profile app.fdn --profile-out profile.json
```

Use this when you want call counts, timing data, and hot-path visibility without switching your workflow manually.

## `fidan test`

Run inline `test {}` blocks:

```bash
fidan test src/main.fdn
```

This is the default test entry point for source files that embed their tests directly.

## `fidan repl`

Start the interactive REPL:

```bash
fidan repl
```

Useful for:

- trying syntax quickly
- inspecting types
- experimenting with expressions
- checking runtime behavior without scaffolding a file

`--trace` is supported here too for panic stack reporting.

## `fidan lsp`

Start the language server:

```bash
fidan lsp
```

Editors typically launch this automatically. The `--stdio` flag is accepted for compatibility, but the server always uses stdio.

## `fidan format`

Format a file with the official formatter:

```bash
fidan format app.fdn
```

### Useful flags

- `--in-place`
- `--check`
- `--indent-width N`
- `--max-line-len N`

The formatter also respects `.fidanfmt` when present.

## `fidan check`

Parse, type-check, and lint a file without running it:

```bash
fidan check app.fdn
```

Useful flags:

- `--max-errors N`
- `--strict`
- `--suppress CODE1,CODE2`

## `fidan fix`

Apply high-confidence fix suggestions:

```bash
fidan fix app.fdn
fidan fix app.fdn --in-place
fidan fix app.fdn --ai
fidan fix app.fdn --improve "refactor for readability"
```

By default, `fidan fix` prints the proposed result to stdout so you can review it first. Use `--in-place` when you want the file rewritten.

### Useful flags

- `--in-place`
- `--ai [steering text]`
- `--improve [steering text]`
- `--refactor [steering text]` (alias for `--improve`)

High-confidence deterministic fixes run first. `--ai` asks the installed AI toolchain for additional fixes after that pass. `--improve` and `--refactor` are the clean-code improvement mode, even when diagnostics are already resolved.

## `fidan explain`

Explain source lines, a diagnostic code, or the last recorded diagnostic:

```bash
fidan explain app.fdn --line 42
fidan explain app.fdn --line 10 --end-line 18
fidan explain app.fdn:10-18
fidan explain --diagnostic E0401
fidan explain --last-error
fidan explain app.fdn --line 42 --ai "focus on runtime behavior"
```

### Useful forms

- `fidan explain path/to/file.fdn --line N`
- `fidan explain path/to/file.fdn --line N --end-line M`
- `fidan explain path/to/file.fdn:N`
- `fidan explain path/to/file.fdn:N-M`
- `fidan explain --diagnostic CODE`
- `fidan explain --last-error`
- `fidan explain ... --ai [steering text]`

### What it is for

- understand a source line or selected range in language/runtime terms
- get the official explanation for a diagnostic code
- revisit the last recorded compiler/runtime error quickly
- optionally ask the AI toolchain for a more guided explanation

## `fidan new`

Scaffold a new project:

```bash
fidan new hello_world
```

Package-ready layout:

```bash
fidan new cool_pkg --package
```

Useful flag:

- `--dir <path>`

## `fidan self`

Manage installed Fidan versions.

### Subcommands

- `fidan self list`
- `fidan self current`
- `fidan self install [version]`
- `fidan self use [version]`
- `fidan self remove [version]`

### Examples

```bash
fidan self install
fidan self use 1.0.0
fidan self current
```

If no version is provided for `install`, `use`, or `remove`, the CLI resolves `latest`.

## `fidan toolchain`

Manage optional heavyweight toolchains like LLVM.

### Subcommands

- `fidan toolchain available`
- `fidan toolchain list`
- `fidan toolchain add llvm --version 1.0.0-local`
- `fidan toolchain remove llvm --version 1.0.0-local`

Use this when you want to install or inspect the external LLVM toolchain package without manually touching `FIDAN_HOME`.

## `fidan dal`

Work with the Dal package registry.

### Subcommands

- `login`
- `logout`
- `whoami`
- `search`
- `info`
- `add`
- `remove`
- `package`
- `publish`
- `yank`
- `unyank`

### Examples

```bash
fidan dal login
fidan dal search regex
fidan dal info torch
fidan dal add json_parser
fidan dal package
fidan dal publish
```

### Feature syntax

Package requests can include feature selections:

```bash
fidan dal add torch[pybindings,gpu]
```

## Common workflows

### Fast edit-run loop

```bash
fidan run app.fdn --reload
```

### Strict CI validation

```bash
fidan check src/main.fdn --strict
fidan format src/main.fdn --check
```

### Release build

```bash
fidan build src/main.fdn --release --output build/app
```

### Portable release build

```bash
fidan build src/main.fdn --release --target-cpu generic --output build/app
```

### LLVM build

```bash
fidan build app.fdn --backend llvm --release
```

### Cranelift build

```bash
fidan build app.fdn --backend cranelift --release
```

## Diagnostics and exit behavior

The CLI uses the same diagnostics system as the rest of the toolchain:

- readable source-context errors
- diagnostic codes
- suppression via `--suppress`
- stricter enforcement via `--strict`

Panics and runtime failures can render no stack, a short stack, a full stack, or a compact single-line stack depending on `--trace`.

## Recommended usage pattern

For day-to-day development:

- `fidan run`
- `fidan check`
- `fidan format --in-place`
- `fidan test`

For shipping:

- `fidan build --release`
- optionally `--backend llvm`
- optionally `--target-cpu generic` if you need portability

For package work:

- `fidan dal add`
- `fidan dal package`
- `fidan dal publish`
