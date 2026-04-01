---
title: "Interpreter"
sidebarLabel: "Interpreter"
description: "The edit-run path that prioritizes feedback speed while sharing language semantics, stdlib behavior, and diagnostics with the compiled modes."
summary: "Fast feedback without a toy-runtime split."
order: 410
---

# Interpreter

The interpreter is the default execution path behind `fidan run`.

## Why it matters

It is not a separate “demo mode.” The interpreter is a first-class runtime mode that shares:

- language semantics
- builtin behavior
- stdlib dispatch
- diagnostics
- null-safety and race-analysis expectations

with the compiled modes.

## When to use it

- rapid edit-run iteration
- experimenting with syntax
- debugging behavior before caring about final binary size or peak speed
- running scripts where startup speed matters more than AOT output

## Command

```bash
fidan run app.fdn
```

## Relationship to the JIT

The interpreter can hand hot functions to the Cranelift JIT when the threshold is reached. That means the normal `run` path gives you:

- interpreted fallback everywhere
- native acceleration for eligible hot paths

without changing your command.

## Tracing and replay

The interpreter path also supports:

- `--trace none|short|full|compact`
- `--replay <bundle-or-id>`
- sandbox flags
- hot reload with `--reload`

## Recommendation

Use the interpreter as the daily development default, then move to AOT builds when you want release-style performance or artifacts.
