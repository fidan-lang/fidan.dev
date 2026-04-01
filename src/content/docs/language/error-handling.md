---
title: "Error handling"
sidebarLabel: "Error handling"
description: "Fail explicitly, trace meaningfully, and use replay when you need more than surface-level logs."
summary: "Failures should stay inspectable in terminal and editor tooling."
order: 145
---

# Error handling

Fidan is designed so failures stay visible and diagnosable.

## Immediate failure

Use `panic` when execution cannot sensibly continue:

```fidan
if retries > 3 {
    panic("too many retries")
}
```

## Trace modes

Current trace modes:

- `none`
- `compact`
- `short`
- `full`

```bash
fidan run app.fdn --trace full
```

## Replay

Replay lets you reproduce failure paths more reliably when input was involved:

```bash
fidan replay replay.bundle
```
