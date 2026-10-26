---
title: "std.time"
sidebarLabel: "std.time"
description: "Clocks, blocking sleep, elapsed timing, extracted date/time parts, and simple formatting helpers."
summary: "Time helpers for timestamps, sleeps, and readable date formatting."
order: 310
---

# std.time

`now` uses epoch milliseconds; `timestamp` uses epoch seconds. `sleep` blocks the current thread, unlike cooperative `std.async.sleep`. Optional timestamp arguments default to the current time. Formatting has its existing default pattern even though the compact signature names the parameter; output dates/clocks depend on time and timezone, so tests assert deterministic supplied timestamps or output shape.

## Complete API

Signatures and aliases below are generated from the same compiler-owned metadata used by the CLI and LSP. `?` marks optional parameters; `...` is variadic.

<!-- compiler-api:start -->

<!-- prettier-ignore -->
| Signature | Aliases | Contract |
| --- | --- | --- |
| `std.time.now() -> integer` | — | Return the current wall-clock time in milliseconds since the Unix epoch. |
| `std.time.timestamp() -> integer` | — | Return the current Unix timestamp in seconds. |
| `std.time.sleep(ms oftype integer) -> nothing` | `wait` | Block the current thread for the given number of milliseconds. |
| `std.time.elapsed(startMs oftype integer) -> integer` | — | Return elapsed milliseconds since a captured start timestamp. |
| `std.time.date(ms oftype integer?) -> string` | `today` | Format a timestamp as `YYYY-MM-DD`. |
| `std.time.time(ms oftype integer?) -> string` | `timeStr`, `time_str` | Format a timestamp as `HH:MM:SS`. |
| `std.time.datetime(ms oftype integer?) -> string` | — | Format a timestamp as `YYYY-MM-DD HH:MM:SS`. |
| `std.time.format(ms oftype integer?, pattern oftype string?) -> string` | `formatDate`, `format_date` | Format a timestamp with custom date/time tokens. |
| `std.time.year(ms oftype integer?) -> integer` | — | Extract the year from a timestamp. |
| `std.time.month(ms oftype integer?) -> integer` | — | Extract the month from a timestamp. |
| `std.time.day(ms oftype integer?) -> integer` | — | Extract the day of month from a timestamp. |
| `std.time.hour(ms oftype integer?) -> integer` | — | Extract the hour from a timestamp. |
| `std.time.minute(ms oftype integer?) -> integer` | — | Extract the minute from a timestamp. |
| `std.time.second(ms oftype integer?) -> integer` | — | Extract the second from a timestamp. |
| `std.time.weekday(ms oftype integer?) -> integer` | — | Extract the weekday index from a timestamp. |

<!-- compiler-api:end -->

## Examples

```fidan check=run
use std.time as time

var start = time.now()
time.sleep(100)
print(time.elapsed(start))
print(time.datetime())
```

```fidan check=run context=errors
use std.time as time

var start = time.now()
do_work()
print(time.elapsed(start))
```

```fidan check=run
use std.time as time

time.sleep(250)
```

```fidan check=run
use std.time as time

print(time.date())
print(time.format(time.now(), "YYYY-MM-DD HH:mm:ss"))
```
