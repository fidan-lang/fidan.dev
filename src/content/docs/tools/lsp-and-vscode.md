---
title: "LSP and VS Code"
sidebarLabel: "LSP and VS Code"
description: "Use hover, completions, diagnostics, formatting, and unreachable-code dimming through the shared Fidan language server and VS Code extension."
summary: "Editor tooling built from the same metadata the language itself uses."
order: 340
---

# LSP and VS Code

The Fidan language server and VS Code extension are meant to feel like the
language itself, not a stale add-on.

## What the LSP understands today

- top-level builtins like `print`, `len`, `string`, and `Shared`
- decorators like `@extern`, `@deprecated`, and `@precompile`
- stdlib modules like `std.env`
- stdlib member signatures and return types like `std.env.args() -> list`
- formatter config through `.fidanfmt`
- unreachable-code warnings dimmed as unnecessary code
