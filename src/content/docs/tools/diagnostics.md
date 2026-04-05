---
title: "Diagnostics"
sidebarLabel: "Diagnostics"
description: "How Fidan errors and warnings are structured, why codes matter, how explanations are guaranteed, and how terminal and editor diagnostics stay aligned."
summary: "Readable diagnostics with stable codes and explanation coverage."
order: 330
---

# Diagnostics

Fidan diagnostics are designed to be readable under pressure.

## What a diagnostic should do

A good diagnostic should:

- point at the exact relevant span
- explain the problem in language terms, not compiler-internal jargon
- carry a stable code
- map to a deeper explanation page
- stay coherent between the terminal and the editor

## Diagnostic families

You will commonly see:

- `E...` for compile-time errors
- `W...` for warnings
- `R...` for runtime failures

Examples:

- undefined names
- type mismatches
- null-safety issues
- data-race violations
- dead code
- runtime assertion/panic failures

## Explanation coverage

Every registered diagnostic code in the codebase is required to have a corresponding explanation. That coverage is checked in the codebase itself so docs do not silently drift from diagnostics.

## CLI and editor alignment

The same diagnostics surface powers:

- terminal rendering
- LSP diagnostics in editors
- `fidan explain`
- AI-assisted explain flows layered on top of the same diagnostic metadata

That means the code, message, and general meaning stay aligned across tools.

## Explain workflows

When you want more than the raw diagnostic message, use the explanation layer that sits on top of the same codes and spans:

- `fidan explain --diagnostic E0101`
- `fidan explain --last-error`
- `fidan explain app.fdn --line 18 --end-line 26`
- VS Code explain commands for the current line or active selection

If you opt into the AI toolchain, the AI explanation path still starts from the same registered diagnostic and span data. That keeps the explanation grounded in the compiler's actual model instead of inventing a second, disconnected explanation system.

## Strict mode and suppression

CLI flags:

- `--strict`
- `--suppress CODE1,CODE2`

Use `--strict` when you want selected warnings to become build-blocking errors. Use suppression sparingly and deliberately.

## Dead code and unnecessary code

Structural dead code warnings are also tagged as unnecessary in the LSP so editors can dim unreachable code instead of only showing a warning squiggle.
