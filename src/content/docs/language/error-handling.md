---
title: "Error handling"
sidebarLabel: "Error handling"
description: "Use `attempt`, `catch`, `otherwise`, `finally`, `panic`, trace modes, and replay to make failures explicit and diagnosable."
summary: "Fail clearly, recover deliberately, and debug with first-class tooling."
order: 145
---

# Error handling

Fidan is designed so failures stay visible and diagnosable instead of disappearing into vague runtime behavior.

## `panic`

Use `panic(...)` when execution cannot sensibly continue:

```fidan check=run context=retry
if retries > 3 {
    panic("too many retries")
}
```

Alias:

- `throw` = `panic`

## `attempt`

Structured handling:

```fidan check=run context=io
attempt {
    var data = io.readFile("config.json")
    print(data)
} catch error {
    eprint(error)
} otherwise {
    print("success")
} finally {
    print("cleanup")
}
```

Aliases:

- `try` = `attempt`
- `rescue` = `catch`

Typed catches are supported:

```fidan check=run context=errors
attempt {
    risky()
} catch error -> string {
    eprint(error)
}
```

## Runtime diagnostic identity

In the upcoming source candidate, an uncaught user `panic(value)` reports **R1002**
on stderr and exits with status 1 in interpreter/JIT, Cranelift AOT and LLVM AOT.
A catch receives the original value; text resembling a diagnostic does not change
its classification. The REPL reports uncaught errors and returns to its prompt.

R0001 covers generic runtime-contract errors. Explicit assertion failures and
internal execution failures also use R0001 and remain fatal. R1001 protects Fidan
call depth and the native stack reserve; it can be caught, but does not promise
recovery from foreign-code or operating-system crashes. Arithmetic, indexing,
I/O and sandbox failures retain their more specific diagnostic codes.

`parallel` and `concurrent` task groups wait for all tasks and aggregate failures
as **R9001**. This aggregate is fatal even inside an outer `attempt`; handle a
recoverable failure inside the task. Individual `await` and `parallel for`
failures retain the underlying diagnostic instead.

Use `fidan explain --diagnostic R1002` for the compiler-owned explanation.
These source-candidate corrections do not imply that the already published
Fidan 1.0.16 binary has been replaced. Native stack detail can differ from the
interpreter's trace output.

## Trace modes

Current trace modes:

- `none`
- `compact`
- `short`
- `full`

Example:

```bash
fidan run app.fdn --trace full
```

The modes now differ intentionally rather than being cosmetic aliases.

## Replay

Replay reuses recorded stdin lines when input was involved:

```bash
fidan run app.fdn --replay some.bundle
```

Replay avoids retyping inputs; it does not capture files, random values, clocks or external services. See [replay boundaries](/docs/tools/replay-and-tracing).
