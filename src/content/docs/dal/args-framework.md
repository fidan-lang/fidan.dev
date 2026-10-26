---
title: "The args CLI framework"
description: "Build typed single-command and multi-command applications from real callable signatures."
summary: "Build typed single-command and multi-command applications from real callable signatures."
order: 525
---

# The args CLI framework

`args` is an unreleased package for the upcoming compiler candidate. The old public Fidan 1.0.16 cannot run its reflection/decorator API. Do not expect `fidan dal add args` to work before the coordinated package release. Use the reviewed package source and matching compiler for local development; its tests stage an isolated compatibility manifest after a real capability probe.

## Single command

Parameters come from the action signature, not a dictionary schema. After installation, import `args`. When running its source checkout directly, examples use `use "../src/init.fdn"`.

```fidan check=run context=args id=args-greet expect=stdout
use args.{run, command}

@command
action greet with (certain name oftype string, optional count oftype integer = 1) {
    for i in 0..count { print("Hello, " + name + "!") }
}
run(greet, ["Ada", "--count", "2"])
```

```text
Hello, Ada!
Hello, Ada!
```

For a real process, omit `argv` and `run` reads `std.env.args()`. For example, `fidan -vv run greet.fdn -- Ada --count 2` keeps compiler diagnostics on stderr and forwards the remaining arguments unchanged. In a compiled application, invoke the application directly with `Ada --count 2`.

## Parameter and token contract

- Scalar String, Integer, Float and Boolean parameters are supported. A final required List of a supported primitive accepts remaining positionals. Unsupported dynamic/custom-object signatures fail explicitly; arbitrary stdlib functions are not command schemas when their metadata lacks concrete types.
- Required scalar parameters are positional or available by name. Optional parameters use their action defaults. Hyphenated flags map to underscored parameter names.
- Boolean parameters use `--flag` and `--no-flag`. Unique initial short aliases are inferred except reserved help/version names; explicit policies can define aliases.
- Value spellings include `--count=2`, `--count 2`, `-c2` and `-c=2`. Repeated scalars use the last value; repeated list values append in order. Long-option abbreviations are not accepted.
- `--` ends options. Negative numbers can be positionals. A value option consumes the next token literally except the separator `--`.
- `--help`/`-h` and configured `--version`/`-V` do not invoke callbacks or computed defaults. `help` and `version` are reserved parameter names.

## Public API

| API                                                                              | Contract                                                                                              |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `command(callback)` / `@command`                                                 | Validate the signature and return the same action                                                     |
| `run(callback, argv?, program?, version?, description?, settings?)`              | Invoke the callback; return its result, or `nothing` when help/version/completion handled the request |
| `help(callback, program?, version?, description?, settings?)`                    | Return plain help text without executing defaults                                                     |
| `complete(callback, words, settings?, version?)`                                 | Return completion candidates without running handlers/validators/defaults                             |
| `CommandOption(parameter, aliases?, env?, choices?, validator?, separator?)`     | Extra single-command parameter policy, passed through `settings`                                      |
| `App(program?, version?, description?)`                                          | Construct an independent command application                                                          |
| `app.add(name, callback, description?, aliases?)`                                | Register a command; return its `CommandDefinition`                                                    |
| `definition.option(parameter, aliases?, env?, choices?, validator?, separator?)` | Attach validated policy and return that definition                                                    |
| `app.group(name, child, description?, aliases?)`                                 | Register a child App; return the child                                                                |
| `app.globals(callback)`                                                          | Register one scoped options/hook callback; return its definition                                      |
| `app.run(argv?)`                                                                 | Parse the whole command chain, then execute outer hooks before the leaf                               |
| `app.help()` / `app.complete(words)`                                             | Produce help or completion candidates                                                                 |
| `ArgumentError(message, parameter?)`                                             | Catchable parse/registration failure with structured fields                                           |

Parser/catalog/plan objects re-exported by source files remain implementation details. There is no separate stable public `parse` API; use `run` and catch `ArgumentError`, or the application registration methods. Do not mutate registration fields directly.

## Multiple commands and groups

```fidan check=run context=args expect=stdout
use args.{App}

action greet with (optional name oftype string = "Dal") { print("Hello, " + name + "!") }
action build with (optional release oftype boolean = false) { print("release" if release else "debug") }
var app = App("mytool", "0.1.0", "An example with two commands")
app.add("greet", greet, "Greet someone", ["hello"])
app.add("build", build, "Select a build mode")
app.run(["hello", "--name", "Ada"])
app.run(["build", "--release"])
```

```text
Hello, Ada!
release
```

Compose nested applications with `app.group("admin", child, description, aliases)`. A group's global flags precede that group's command token. Every level must parse successfully before any global hook runs. Hooks execute outermost first, followed by the leaf. Help, version and failures do not execute hooks. Child groups inherit a version if they do not define one. Help and completion advertise `--version`/`-V` only when a nonblank version is configured or inherited. An explicit version request without that metadata raises `ArgumentError`; handlers and defaults do not run. For standalone `complete`, supply the optional `version` metadata when version completion is supported. Duplicate names, aliases and group cycles are rejected.

## Policies, defaults and validation

Use `definition.option("count", aliases=["-n"], env="MY_COUNT", choices=[1, 2, 3])`. Names must identify existing callback parameters. CLI values override environment values, which override callable defaults. Conversion uses declared parameter types. List separators are configurable (default comma). Choice checks preserve actual types. A validator is a one-argument callable returning Boolean; false is a validation failure, and callback exceptions propagate.

Policies are validated before registration changes become visible. A failed policy does not leave a half-updated command. Computed defaults are deferred until actual invocation, not evaluated during help/completion.

## Failures are real errors

```fidan check=run context=args
use args.{run, ArgumentError}

action count with (certain value oftype integer) returns integer { return value }
var caught = false
attempt {
    run(count, ["not-a-number"])
} catch error -> ArgumentError {
    caught = true
    assert_ne(error.message, "")
}
assert(caught)
```

The library does not exit the process. Applications choose their error presentation; uncaught errors follow Fidan's nonzero runtime failure behavior. Callback failures propagate unchanged, rather than becoming dictionary error keys.

## Complete grouped application

This runnable example combines scoped hooks, a command alias, explicit option policy, validation, completion and failure atomicity. Option aliases include their `-`/`--` prefix; command aliases do not.

```fidan check=run context=args expect=stdout
use args.{App, ArgumentError}
var events = []
action root_options with (optional verbose oftype boolean = false) {
    events.append(("root", verbose))
}
action group_options with (optional profile oftype string = "dev") {
    events.append(("group", profile))
}
action positive with (certain value oftype integer) returns boolean { return value > 0 }
action count with (certain amount oftype integer) returns integer {
    events.append(("count", amount))
    return amount
}
var app = App("tool", "0.1.0")
app.globals(root_options)
var admin = App()
admin.globals(group_options)
admin.add("count", count, aliases=["c"]).option("amount", aliases=["-n"], choices=[1, 2, 3], validator=positive)
app.group("admin", admin)
assert_eq(app.complete(["admin", "c", "--am"]), ["--amount"])
assert_eq(events, [])
assert_eq(app.run(["--verbose", "admin", "--profile", "prod", "c", "-n2"]), 2)
assert_eq(events, [("root", true), ("group", "prod"), ("count", 2)])
events = []
var caught = false
attempt { app.run(["admin", "count", "4"]) } catch error -> ArgumentError { caught = true }
assert(caught)
assert_eq(events, [])
assert(app.help().contains("admin"))
print("grouped command passed")
```

```text
grouped command passed
```

## Completion

Adapters ship for Bash, Zsh, Fish and PowerShell under `assets/completions`. Register an adapter explicitly; installation does not alter a shell profile. The reserved `--args-complete` protocol returns one candidate per line and never evaluates that output as code. It supports command/flag/declared-choice completion. Newline-bearing candidates are excluded. PowerShell declines nonliteral expression arguments instead of executing them.

See the package README for exact shell registration commands. Its regression runner executes examples at interpreter/JIT thresholds 0 and 1 and, with `--llvm`, both native backends. Shell-specific tests require the corresponding real shell; unavailable shells are not certified by another shell's passing tests.
