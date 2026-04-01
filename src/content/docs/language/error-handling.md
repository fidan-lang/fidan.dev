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

```fidan
if retries > 3 {
    panic("too many retries")
}
```

Alias:

- `throw` = `panic`

## `attempt`

Structured handling:

```fidan
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

```fidan
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

Replay makes crash reproduction deterministic when input was involved:

```bash
fidan run app.fdn --replay some.bundle
```

Use replay when you want to reproduce an exact failing interactive session instead of manually retyping inputs.
