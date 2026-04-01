---
title: "Standard library"
sidebarLabel: "Overview"
description: "Understand the std.* surface and how it stays consistent across runtime, LSP, hover docs, and the website."
summary: "A compact stdlib with shared metadata instead of drift."
order: 200
---

# Standard library

Fidan's standard library is intentionally compact, but it already covers the
practical baseline for native software.

## Current module surface

- `std.async`
- `std.collections`
- `std.env`
- `std.io`
- `std.math`
- `std.parallel`
- `std.regex`
- `std.string`
- `std.test`
- `std.time`

## Why the docs stay aligned

The stdlib catalog is backed by shared metadata in the main Fidan repo. That is
also what powers hover, completions, and return-type hints in the language
server.
