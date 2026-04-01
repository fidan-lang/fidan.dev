---
title: "Standard library overview"
sidebarLabel: "Overview"
description: "Get a quick mental map of the current modules and when to reach for each one."
summary: "Know which std.* module you actually want."
order: 210
---

# Standard library overview

## Quick map

- `std.async` — cooperative pending-handle helpers
- `std.collections` — sequence and container helpers
- `std.env` — environment variables and process args
- `std.io` — console and file I/O
- `std.math` — numeric transforms and constants
- `std.parallel` — thread-backed collection helpers
- `std.regex` — regex matching and replacement
- `std.string` — parsing and string transforms
- `std.test` — assertion helpers
- `std.time` — clocks, dates, blocking sleep

## Builtins vs stdlib

Fidan keeps a small builtin surface:

- `print`
- `eprint`
- `input`
- conversion/type helpers like `string`, `integer`, `float`, `boolean`

Everything richer belongs under `std.*`.
