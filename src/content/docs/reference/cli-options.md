---
title: "CLI options reference"
description: "Every command and option from the actual candidate executable."
summary: "Generated from real help, including nested commands and defaults."
order: 615
---

# CLI options reference

This reference is generated from the selected candidate's real `--help` output.
It includes nested Dal, self and toolchain commands. External namespaces under
`exec` belong to their installed helper and can have additional help.
For placement, stdout/stderr, logging precedence and recipes, see [CLI](/docs/tools/cli).
The [candidate compatibility guide](/docs/getting-started/release-candidate)
explains why public 1.0.16 is not a substitute for this source contract.

<!-- cli-help:start -->

## fidan

```text
The Fidan language compiler and toolchain

Usage: fidan [OPTIONS] <COMMAND>

Commands:
  run        Run a Fidan source file (pass `-` to read from stdin)
  build      Compile a Fidan source file to a native binary
  profile    Profile a Fidan source file: call counts, time per action, hot-path hints
  test       Run `test { ... }` blocks in a source file or directory (recursively)
  repl       Start an interactive REPL (lex + parse + typecheck each line)
  lsp        Start the language server (LSP)
  format     Format a Fidan source file or directory (recursively)
  check      Check source files for errors without running them (directories recursively)
  fix        Apply high-confidence fixes to source files (directories recursively)
  explain    Explain source lines, a diagnostic code, or the last recorded error
  new        Scaffold a new Fidan project in a new directory
  self       Manage installed Fidan versions
  toolchain  Manage optional heavyweight toolchains like LLVM
  dal        Dal package registry commands
  exec       Run a toolchain-provided external command namespace
  help       Print this message or the help of the given subcommand(s)

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
  -V, --version     Print version
```

## fidan run

```text
Run a Fidan source file (pass `-` to read from stdin)

Usage: fidan run [OPTIONS] <FILE> [ARGS]...

Arguments:
  <FILE>     Path to the .fdn source file, or `-` to read from stdin
  [ARGS]...  Arguments passed through to the Fidan program itself. Use `--` before them when they could be mistaken for CLI flags

Options:
      --emit <EMIT>                    Emit intermediate representation: tokens | ast | hir | mir
  -v, --verbose...                     Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --trace <TRACE>                  Print the call stack on uncaught panics: none | short | full | compact [default: none]
      --max-errors <MAX_ERRORS>        Stop after this many errors (default: 1, 0 = no limit) [default: 1]
      --jit-threshold <JIT_THRESHOLD>  JIT compilation threshold: compile a function after this many calls (0 = off) [default: 500]
      --strict                         Treat select warnings (W1001–W1003, W2004–W2006) as errors
      --reload                         Watch source files and re-run automatically on change
      --replay <REPLAY>                Replay a previous run using a saved bundle ID (e.g. `a1b2c3d4`) or an explicit path to a `.bundle` file
      --suppress <SUPPRESS>            Suppress specific diagnostic codes (comma-separated, e.g. `W5003,W1004`)
      --sandbox                        Enable zero-config sandbox: deny file and environment access by default
      --allow-read <ALLOW_READ>        Allow file-system reads from path prefix (repeatable; `*` = allow all)
      --allow-write <ALLOW_WRITE>      Allow file-system writes to path prefix (repeatable; `*` = allow all)
      --allow-env                      Allow environment variable access (`getEnv`, `setEnv`, `args`, `cwd`)
      --time-limit <TIME_LIMIT>        Wall-time limit in seconds when `--sandbox` is active (0 = no limit)
      --mem-limit <MEM_LIMIT>          Memory limit in MB when `--sandbox` is active (0 = no limit)
  -h, --help                           Print help
```

## fidan build

```text
Compile a Fidan source file to a native binary

Usage: fidan build [OPTIONS] <FILE>

Arguments:
  <FILE>  Path to the .fdn source file

Options:
  -o, --output <OUTPUT>                Output binary path [default: out]
  -v, --verbose...                     Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --opt <OPT>                      Optimisation level: O0, O1, O2 (default), O3, Os, Oz [default: O2]
      --release                        Full release profile: O3 + full LTO + strip all + host-tuned CPU unless explicitly overridden by the corresponding flags
      --lto <off|full>                 Link-time optimization mode for AOT builds: off | full [default: off]
      --strip <off|symbols|all>        Strip the produced binary after linking: off | symbols | all [default: off]
      --emit <EMIT>                    Emit intermediate representation: tokens | ast | hir | mir | obj (`obj` keeps the generated native .o/.obj file alongside the binary)
      --lib-dir <LIB_DIR>              Additional library search directories for the system linker (repeatable)
      --link-runtime <static|dynamic>  How to link the Fidan runtime into the compiled binary: `static` (default) — embed libfidan_runtime.a for a self-contained binary; `dynamic` — link libfidan_runtime.so/.dll (smaller binary, but the runtime shared library must be present at the Fidan install path at run time [default: static]
      --linker <LINKER>                Override the system linker for this build.  Accepts a bare executable name (resolved via PATH) or an absolute path.  Equivalent to setting the FIDAN_LINKER environment variable, but applies to this invocation only.  Example: `--linker lld-link` or `--linker /usr/bin/clang`
      --strict                         Treat select warnings (W1001–W1003, W2004–W2006) as errors
      --suppress <SUPPRESS>            Suppress specific diagnostic codes (comma-separated, e.g. `W5003,W1004`)
      --backend <BACKEND>              AOT codegen backend: `auto` (prefer installed LLVM), `cranelift`, or `llvm` [default: auto]
      --max-errors <MAX_ERRORS>        Stop after this many errors (default: 1, 0 = no limit) [default: 1]
      --target-cpu <TARGET_CPU>        AOT target CPU: `generic`, `native`, or a backend-specific CPU spec
  -h, --help                           Print help
```

## fidan profile

```text
Profile a Fidan source file: call counts, time per action, hot-path hints

Usage: fidan profile [OPTIONS] <FILE>

Arguments:
  <FILE>  Path to the .fdn source file

Options:
      --profile-out <PROFILE_OUT>  Write profiling data to a file in JSON format
  -v, --verbose...                 Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --max-errors <MAX_ERRORS>    Stop after this many errors (default: 1, 0 = no limit) [default: 1]
      --suppress <SUPPRESS>        Suppress specific diagnostic codes (comma-separated)
  -h, --help                       Print help
```

## fidan test

```text
Run `test { ... }` blocks in a source file or directory (recursively)

Usage: fidan test [OPTIONS] <FILE>

Arguments:
  <FILE>  Path to a .fdn source file or directory

Options:
      --max-errors <MAX_ERRORS>  Stop after this many errors (default: 1, 0 = no limit) [default: 1]
  -v, --verbose...               Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --suppress <SUPPRESS>      Suppress specific diagnostic codes (comma-separated, e.g. `W5003,W1004`)
  -h, --help                     Print help
```

## fidan repl

```text
Start an interactive REPL (lex + parse + typecheck each line)

Usage: fidan repl [OPTIONS]

Options:
      --trace <TRACE>
          Print the call stack on uncaught panics: none | short | full | compact [default: short]
  -v, --verbose...
          Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --max-errors-per-input <MAX_ERRORS_PER_INPUT>
          Stop after this many errors for each submitted REPL input (default: 1, 0 = no limit) [default: 1]
  -h, --help
          Print help
```

## fidan lsp

```text
Start the language server (LSP)

Usage: fidan lsp [OPTIONS]

Options:
      --stdio       Communicate over stdin/stdout. This flag is accepted for compatibility with LSP clients (e.g. VS Code's vscode-languageclient) that automatically append `--stdio` to the server process arguments when `TransportKind.stdio` is configured.  The Fidan LSP server always uses stdio, so the flag is a no-op
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan format

```text
Format a Fidan source file or directory (recursively)

Usage: fidan format [OPTIONS] <FILE>

Arguments:
  <FILE>  Path to a .fdn source file or directory (recursive)

Options:
      --in-place                     Rewrite the file in place instead of printing to stdout
  -v, --verbose...                   Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --check                        Exit 1 if the file is not already formatted (useful in CI)
      --indent-width <INDENT_WIDTH>  Number of spaces per indent level (default: 4)
      --max-line-len <MAX_LINE_LEN>  Soft line-length limit (default: 100)
  -h, --help                         Print help
```

## fidan check

```text
Check source files for errors without running them (directories recursively)

Usage: fidan check [OPTIONS] <FILE>

Arguments:
  <FILE>  Path to a .fdn source file or directory

Options:
      --max-errors <MAX_ERRORS>  Stop after this many errors (0 = no limit) [default: 0]
  -v, --verbose...               Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --strict                   Treat select warnings (W1001–W1003, W2004–W2006) as errors
      --suppress <SUPPRESS>      Suppress specific diagnostic codes (comma-separated, e.g. `W5003,W1004`)
  -h, --help                     Print help
```

## fidan fix

```text
Apply high-confidence fixes to source files (directories recursively)

Usage: fidan fix [OPTIONS] <FILE>

Arguments:
  <FILE>  Path to a .fdn source file or directory

Options:
      --in-place               Write changes to the file (default: print diff to stdout)
  -v, --verbose...             Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --ai [<AI>]              Use the installed AI analysis toolchain to suggest additional fixes. Optionally pass extra steering text (e.g. `--ai "prefer idiomatic style"`). High-confidence deterministic fixes are always applied first
      --improve [<IMPROVE>]    Ask the AI to improve code even when diagnostics are already clean. Optionally pass steering text (e.g. `--improve "refactor for readability"`)
      --refactor [<REFACTOR>]  Alias for `--improve`
  -h, --help                   Print help
```

## fidan explain

```text
Explain source lines, a diagnostic code, or the last recorded error

Usage: fidan explain [OPTIONS] [TARGET]

Arguments:
  [TARGET]  Path to the .fdn source file. You can also use `path/to/file.fdn:100` or `path/to/file.fdn:100-120`

Options:
      --line <LINE>              First line to explain (1-based)
  -v, --verbose...               Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --end-line <END_LINE>      Last line to explain, inclusive (defaults to --line)
      --diagnostic <DIAGNOSTIC>  Explain a diagnostic code instead of source lines (for example `E0101`)
      --last-error               Explain the last recorded diagnostic automatically
      --ai [<AI>]                Use the installed AI analysis toolchain. Optionally pass extra steering text
  -h, --help                     Print help
```

## fidan new

```text
Scaffold a new Fidan project in a new directory

Usage: fidan new [OPTIONS] <PROJECT_NAME>

Arguments:
  <PROJECT_NAME>  Name of the project (also the directory name)

Options:
  -d, --dir <DIR>   Output directory (default: current directory)
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --package     Scaffold a Dal package layout with dal.toml and src/init.fdn
  -h, --help        Print help
```

## fidan self

```text
Manage installed Fidan versions

Usage: fidan self [OPTIONS] <COMMAND>

Commands:
  list     List installed Fidan versions
  current  Show the active Fidan version and install paths
  install  Install a Fidan version from the distribution manifest (default: `latest`)
  use      Switch the active Fidan version (default: `latest`)
  remove   Remove an installed Fidan version (default: `latest`)
  help     Print this message or the help of the given subcommand(s)

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan self list

```text
List installed Fidan versions

Usage: fidan self list [OPTIONS]

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan self current

```text
Show the active Fidan version and install paths

Usage: fidan self current [OPTIONS]

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan self install

```text
Install a Fidan version from the distribution manifest (default: `latest`)

Usage: fidan self install [OPTIONS] [VERSION]

Arguments:
  [VERSION]

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan self use

```text
Switch the active Fidan version (default: `latest`)

Usage: fidan self use [OPTIONS] [VERSION]

Arguments:
  [VERSION]

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan self remove

```text
Remove an installed Fidan version (default: `latest`)

Usage: fidan self remove [OPTIONS] [VERSION]

Arguments:
  [VERSION]

Options:
      --confirm     Skip the interactive confirmation prompt for removing the selected version
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan toolchain

```text
Manage optional heavyweight toolchains like LLVM

Usage: fidan toolchain [OPTIONS] <COMMAND>

Commands:
  available  Show installable toolchains for the current host
  list       Show installed toolchains
  add        Install an optional toolchain package
  remove     Remove an installed toolchain package
  help       Print this message or the help of the given subcommand(s)

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan toolchain available

```text
Show installable toolchains for the current host

Usage: fidan toolchain available [OPTIONS]

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan toolchain list

```text
Show installed toolchains

Usage: fidan toolchain list [OPTIONS]

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan toolchain add

```text
Install an optional toolchain package

Usage: fidan toolchain add [OPTIONS] <NAME>

Arguments:
  <NAME>

Options:
  -v, --verbose...         Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --version <VERSION>
  -h, --help               Print help
```

## fidan toolchain remove

```text
Remove an installed toolchain package

Usage: fidan toolchain remove [OPTIONS] <NAME>

Arguments:
  <NAME>

Options:
  -v, --verbose...         Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --version <VERSION>
      --confirm            Skip the interactive confirmation prompt
  -h, --help               Print help
```

## fidan dal

```text
Dal package registry commands

Usage: fidan dal [OPTIONS] <COMMAND>

Commands:
  login    Store a Dal API token in the OS keychain for CLI use
  logout   Remove the stored Dal API token from the OS keychain
  whoami   Show the currently authenticated Dal account
  search   Search Dal packages
  info     Show package metadata and versions
  add      Download and vendor a package into an importable local module layout
  remove   Remove an installed package from the managed local/global DAL stores
  package  Build a canonical Dal .tar.gz archive locally without publishing
  publish  Build and publish the current package to Dal
  yank     Yank a published package version
  unyank   Unyank a published package version
  help     Print this message or the help of the given subcommand(s)

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

## fidan dal login

```text
Store a Dal API token in the OS keychain for CLI use

Usage: fidan dal login [OPTIONS]

Options:
      --token <TOKEN>        Dal API token from the dashboard
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --registry <REGISTRY>  Override the Dal registry base URL
  -h, --help                 Print help
```

## fidan dal logout

```text
Remove the stored Dal API token from the OS keychain

Usage: fidan dal logout [OPTIONS]

Options:
      --registry <REGISTRY>  Override the Dal registry whose saved token is removed
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help                 Print help
```

## fidan dal whoami

```text
Show the currently authenticated Dal account

Usage: fidan dal whoami [OPTIONS]

Options:
      --registry <REGISTRY>  Override the Dal registry base URL
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help                 Print help
```

## fidan dal search

```text
Search Dal packages

Usage: fidan dal search [OPTIONS] <QUERY>

Arguments:
  <QUERY>

Options:
      --page <PAGE>          [default: 1]
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --per-page <PER_PAGE>  [default: 10]
      --registry <REGISTRY>
  -h, --help                 Print help
```

## fidan dal info

```text
Show package metadata and versions

Usage: fidan dal info [OPTIONS] <PACKAGE>

Arguments:
  <PACKAGE>

Options:
      --registry <REGISTRY>
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help                 Print help
```

## fidan dal add

```text
Download and vendor a package into an importable local module layout

Usage: fidan dal add [OPTIONS] <PACKAGE>

Arguments:
  <PACKAGE>

Options:
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --version <VERSION>    SemVer requirement or exact version
      --into <INTO>          Parent directory to install into (default: current directory)
      --global               Install into the global FIDAN_HOME package store instead of the project-local .dal store
      --force                Overwrite an existing installed package directory
      --registry <REGISTRY>
  -h, --help                 Print help
```

## fidan dal remove

```text
Remove an installed package from the managed local/global DAL stores

Usage: fidan dal remove [OPTIONS] <PACKAGE>

Arguments:
  <PACKAGE>

Options:
      --into <INTO>  Parent directory used with `dal add --into`
  -v, --verbose...   Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --global       Remove from the global FIDAN_HOME package store
      --confirm      Skip the interactive confirmation prompt
  -h, --help         Print help
```

## fidan dal package

```text
Build a canonical Dal .tar.gz archive locally without publishing

Usage: fidan dal package [OPTIONS] [PATH]

Arguments:
  [PATH]  Package project directory containing `dal.toml` [default: .]

Options:
  -o, --output <OUTPUT>  Output archive path (default: {name}-{version}.tar.gz in current dir)
  -v, --verbose...       Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help             Print help
```

## fidan dal publish

```text
Build and publish the current package to Dal

Usage: fidan dal publish [OPTIONS] [PATH]

Arguments:
  [PATH]  Package project directory containing `dal.toml` [default: .]

Options:
      --registry <REGISTRY>
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help                 Print help
```

## fidan dal yank

```text
Yank a published package version

Usage: fidan dal yank [OPTIONS] <PACKAGE> <VERSION>

Arguments:
  <PACKAGE>
  <VERSION>

Options:
      --reason <REASON>
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
      --registry <REGISTRY>
  -h, --help                 Print help
```

## fidan dal unyank

```text
Unyank a published package version

Usage: fidan dal unyank [OPTIONS] <PACKAGE> <VERSION>

Arguments:
  <PACKAGE>
  <VERSION>

Options:
      --registry <REGISTRY>
  -v, --verbose...           Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help                 Print help
```

## fidan exec

```text
Run a toolchain-provided external command namespace

Usage: fidan exec [OPTIONS] [NAMESPACE] [ARGS]...

Arguments:
  [NAMESPACE]  Registered external namespace, for example `ai`
  [ARGS]...    Arguments passed through to the external toolchain command

Options:
  -v, --verbose...  Operational diagnostics on stderr: -v INFO, -vv DEBUG, -vvv TRACE (maximum three)
  -h, --help        Print help
```

<!-- cli-help:end -->
