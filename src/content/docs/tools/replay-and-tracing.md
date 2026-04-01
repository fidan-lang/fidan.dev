---
title: "Replay and tracing"
sidebarLabel: "Replay and tracing"
description: "Use trace modes and replay bundles to understand failures with more than a vague stack trace."
summary: "Better visibility into failures without making the output noisy."
order: 350
---

# Replay and tracing

Fidan supports multiple trace modes so failure output can match the situation.

## Trace modes

- `none`
- `compact`
- `short`
- `full`

```bash
fidan run app.fdn --trace full
```
