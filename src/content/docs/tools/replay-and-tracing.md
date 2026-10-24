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

## Replay boundary

Replay records stdin lines, not an entire deterministic snapshot of the outside world. Filesystem contents, time, random values, external libraries and network services are not captured. Keep those inputs controlled when reproducing a failure. The default replay directory is `~/.fidan/replays` (using HOME/USERPROFILE); an explicit bundle path avoids relying on that location. `--trace` controls Fidan runtime stack presentation; `-v`/`-vv`/`-vvv` controls optional compiler diagnostics. They are separate settings.
