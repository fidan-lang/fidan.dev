---
title: "std.time"
sidebarLabel: "std.time"
description: "Use clocks, elapsed timing, formatting helpers, and blocking sleep deliberately."
summary: "Time helpers with a clear blocking-vs-async distinction."
order: 310
---

# std.time

`std.time` covers wall-clock reads, elapsed timing, date formatting, and
blocking sleep.

## Common helpers

- `now()`
- `timestamp()`
- `sleep(ms)`
- `elapsed(startMs)`
- `date(ms?)`
- `time(ms?)`
- `datetime(ms?)`

## Important distinction

`time.sleep` blocks the current thread.

That means:

- in `parallel`, it blocks that worker thread
- in `concurrent`, it blocks the cooperative scheduler on that thread

Use `std.async.sleep` when you want same-thread cooperative waiting instead.
