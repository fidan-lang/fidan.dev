---
title: "std.time"
sidebarLabel: "std.time"
description: "Clocks, blocking sleep, elapsed timing, extracted date/time parts, and simple formatting helpers."
summary: "Time helpers for timestamps, sleeps, and readable date formatting."
order: 310
---

# std.time

`std.time` is the wall-clock and timestamp module.

## Clock and sleep functions

- `now() -> integer`
- `timestamp() -> integer`
- `sleep(ms) -> nothing`
- `elapsed(startMs) -> integer`

Aliases:

- `wait` = `sleep`

## Formatting helpers

- `date(ms?) -> string`
- `time(ms?) -> string`
- `datetime(ms?) -> string`
- `format(ms?, pattern) -> string`

Aliases:

- `today` = `date`
- `timeStr` / `time_str` = `time`
- `formatDate` / `format_date` = `format`

## Extracted parts

- `year(ms?) -> integer`
- `month(ms?) -> integer`
- `day(ms?) -> integer`
- `hour(ms?) -> integer`
- `minute(ms?) -> integer`
- `second(ms?) -> integer`
- `weekday(ms?) -> integer`

## Example

```fidan
use std.time as time

var start = time.now()
time.sleep(100)
print(time.elapsed(start))
print(time.datetime())
```

## Common usage snippets

### Measure elapsed time

```fidan
use std.time as time

var start = time.now()
do_work()
print(time.elapsed(start))
```

### Block briefly

```fidan
use std.time as time

time.sleep(250)
```

### Format a date

```fidan
use std.time as time

print(time.date())
print(time.format(time.now(), "YYYY-MM-DD HH:mm:ss"))
```
