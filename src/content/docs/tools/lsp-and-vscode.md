---
title: "LSP"
sidebarLabel: "LSP"
description: "The official `fidan lsp` server: hovers, completions, formatting, diagnostics, inlay hints, unreachable-code dimming, and shared compiler metadata."
summary: "The language intelligence layer behind Fidan editor integrations."
order: 340
---

# LSP

The official editor experience is built on top of `fidan lsp`.

That server is responsible for understanding the real Fidan language surface rather than a stale hand-maintained approximation.

:::tip Shared metadata matters
The LSP is strong because it reuses shared compiler metadata. Builtins, decorators, stdlib modules, stdlib member docs, and stdlib member return types are resolved from the same metadata layer the language itself uses.
:::

## What the LSP understands

Today the LSP understands:

- top-level builtins like `print`, `len`, `string`, `integer`, `float`, `boolean`, `Shared`, and the assert helpers
- compiler-known decorators like `@precompile`, `@deprecated`, `@extern`, and `@unsafe`
- reserved decorator hover for `@gpu`
- stdlib module docs such as `use std.env`
- stdlib member signatures and return types like `std.env.args() -> list`
- formatter config through `.fidanfmt`
- unreachable/dead-code warnings tagged as unnecessary so editors can dim them
- go to definition, rename, references, and signature help

## Why it matters

The LSP is the contract between the language and editors. When hover, completion, diagnostics, and formatting all come from the same real metadata, the product feels trustworthy.

That is also why editor integrations should stay thin where possible: the language server should own language intelligence, while the editor extension owns UX, commands, and platform integration.

## Common LSP-facing capabilities

Typical capabilities exposed by Fidan editor clients include:

- diagnostics from the real language server
- hover docs
- completions
- signature help
- go to definition
- references
- rename
- type-oriented inlay hints
- dead-code dimming through `Unnecessary` tagging
- format requests routed through the official formatter

## Recommendation

Use the official clients when possible, but keep the mental model clear:

- the **LSP** is the language brain
- the **editor integration** is the local shell around it

That split is what lets Fidan stay coherent as more editor integrations are added.
