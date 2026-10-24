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
- `fidan exec`
- `fidan dal`

## Global operational diagnostics in the candidate

| Option            | Operational diagnostics                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| none              | Off; existing output, errors, warnings and progress remain active                                            |
| `-v`, `--verbose` | INFO: operation lifecycle, compilation/execution/backend selection, package and artifact operations          |
| `-vv`             | DEBUG: frontend counts, phase boundaries, optimizer/build policy, cache/checksum and toolchain decisions     |
| `-vvv`            | TRACE: nested phase timings, import processing, resolver branches, LLVM transitions and LSP document changes |
| `-V`, `--version` | Version only; independent of verbosity                                                                       |

Repeat `-v` or `--verbose` to increase the level. Counts add across nested command
levels. More than three CLI occurrences is a usage error (exit 2). Normal compiler
errors, warnings, essential progress and exit codes do not depend on these levels.
The existing `--trace` option controls Fidan runtime stack reports, not these logs.

## Placement and program arguments

```sh
fidan -vv run main.fdn -- --verbose -v -V
fidan run -vv main.fdn -- --verbose
fidan -v build main.fdn --backend cranelift --opt O3
fidan -vv build main.fdn --backend llvm --lto full
fidan dal -v add example-package
fidan toolchain list -vv
fidan -vv check .
fidan -vvv repl
```

`run` and `exec` reserve their trailing arguments for the user program/toolchain
command. Put Fidan verbosity **before the source file or exec namespace**. After
that positional, `-v`, `--verbose` and `-V` belong to the program, even without
`--`. Existing run options such as `--jit-threshold` remain supported after the
file until the program argument tail starts. Use `--` for unequivocal forwarding:

```sh
fidan -vv run main.fdn -- --verbose > result.txt 2> compiler.log
```

Program stdout remains byte-for-byte program output. Formatter output, explicit
IR output, profile JSON files, helper JSON and LSP JSON-RPC retain their existing
channels. Operational diagnostics use stderr only, with no ANSI sequences, even
in a terminal. Existing terminal-aware language-diagnostic rendering is separate.

## Environment and filtering

Previously the compiler did not initialize a RUST_LOG subscriber. The candidate
supports `RUST_LOG=debug`, or first-party target directives such as
`RUST_LOG=fidan::pipeline=debug,fidan_driver=trace`. Explicit CLI verbosity wins
over RUST_LOG entirely, including an invalid RUST_LOG value. Without flags, an
invalid filter is a startup error; it is never silently accepted. Accepted levels
are `off,error,warn,info,debug,trace`. Targets must be `fidan`, `fidan::*`, or
`fidan_*`. Field/regex filters and third-party targets are deliberately unsupported;
`-vvv` never enables HTTP, TLS, Tokio or Cranelift dependency trace floods.

The LLVM helper receives the resolved filter through a private child-process
environment entry, not a wire-protocol change. Its diagnostics stay on stderr;
its stdout remains the compile-response JSON. Existing explicit LLVM developer
IR-dump switches are separate and are never enabled by verbosity.

## Directory targets in the audit candidate

The local audit candidate adds directory targets to `format`, `test`, `check`,
and `fix`. This is not part of the published Fidan 1.0.16 CLI yet.

```bash
fidan format . --check
fidan format . --in-place
fidan test .
fidan check .
fidan fix .
fidan fix . --in-place
```

Directory targets select `.fdn` files recursively in deterministic path order,
without following symlinks. File-level errors do not prevent later files from
being processed; the command fails if any selected file operation fails.
Formatting uses each file's nearest `.fidanfmt`, with CLI overrides still applied.
`check` does not execute programs. `fix` previews edits unless `--in-place` is
specified; explicitly selected AI modes reuse the existing workflow per file.
Remaining unfixed diagnostics can be checked with `fidan check`.

`run`, `build`, and `profile` still take an entry-point file; `explain` targets a
file and optional source lines. They do not recursively execute source modules.

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

### Important flags: `fidan build`

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

The REPL defaults runtime traces to `short` (unlike `run`, which defaults to `none`). Use `--max-errors-per-input` to bound each submission's diagnostics. Built-in session commands include `:help`, `:exit`/`:quit`/`:q`, `:clear`/`:cls`, `:reset`, `:cancel`, `:ast <snippet>`, `:type <expr>` and `:last [--full]`. Multiline blocks accumulate until their braces close; `:cancel` discards an unfinished block. Interactive terminal rendering and automated stdin sessions have different prompt presentation, but use the same frontend/runtime semantics.

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

Default behavior prints the formatted source to stdout and leaves the file
unchanged.

Use `--in-place` when you want to rewrite the file on disk.

Use `--check` in CI to fail with exit status 1 when formatting changes are
required.

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

### Useful flags: `fidan fix`

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

The generated `main.fdn` includes an explicit `main()` call so entrypoint
behavior is clear from the first file.

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

Manage optional toolchains like LLVM and AI analysis.

### Subcommands: `fidan toolchain`

- `fidan toolchain available`
- `fidan toolchain list`
- `fidan toolchain add llvm`
- `fidan toolchain add ai-analysis`
- `fidan toolchain remove llvm`
- `fidan toolchain remove ai-analysis`

Use this when you want to install or inspect optional toolchain packages without manually touching `FIDAN_HOME`.

LLVM powers the optional LLVM AOT backend. AI analysis powers model-backed explain, fix, improve, and MCP workflows.

## `fidan exec`

Run commands registered by installed toolchains.

```bash
fidan exec
fidan exec ai help
```

The AI analysis toolchain registers the `ai` namespace.

### `fidan exec ai`

Useful commands:

- `fidan exec ai setup`
- `fidan exec ai configure --set key=value`
- `fidan exec ai login`
- `fidan exec ai logout`
- `fidan exec ai doctor`
- `fidan exec ai mcp`
- `fidan exec ai help`

Typical first run:

```bash
fidan toolchain add ai-analysis
fidan exec ai setup
fidan exec ai doctor
```

`setup` can configure OpenAI-compatible APIs, Anthropic, local Ollama, local LM Studio, or a custom OpenAI-compatible endpoint. API keys can live in the OS keychain or in environment variables.

For the complete model, see [AI-native tooling](/docs/tools/ai-native-tooling).

## `fidan dal`

Work with the Dal package registry.

### Subcommands: `fidan dal`

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

### Examples: `fidan dal`

```bash
fidan dal login
fidan dal search regex
fidan dal info torch
fidan dal add json-parser
fidan dal package
fidan dal publish
```

### Feature syntax

Package requests can include feature selections:

```bash
fidan dal add 'demo[pretty]'
```

## Common workflows

### Fast edit-run loop

```bash
fidan run --reload app.fdn
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

## Program arguments: Recommended usage pattern

Put Fidan verbosity flags before the source filename. Recognized run options can follow the filename until the trailing program-argument sequence begins. Use `--` to make the boundary explicit:

```bash
fidan run --trace none main.fdn -- --name Dal --verbose
fidan run main.fdn --name Dal --verbose
```

Both forms forward the same three arguments through `std.env.args()` / `std.io.args()`; those APIs exclude the script executable/name. Prefer the explicit `--` separator in examples. Registry package names use hyphens, not underscores; the corresponding import module replaces hyphens with underscores. Package names in examples must exist in the chosen registry. See the Dal relaunch candidate guide for compatibility, checksum and lock/yank policy; do not assume unpublished candidate changes are already in the stable CLI.

### Application argument example

The documentation harness runs this complete program with the three forwarded tokens shown below, independently of Fidan's own verbosity setting.

```fidan check=run id=program-arguments
use std.env as env
assert_eq(env.args(), ["--verbose", "-v", "-V"])
```
