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
