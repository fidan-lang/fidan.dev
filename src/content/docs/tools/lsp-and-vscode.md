---
title: "LSP and VS Code"
sidebarLabel: "LSP and VS Code"
description: "The editor stack built on the shared Fidan language metadata: hovers, completions, formatting, diagnostics, inlay hints, command integration, and unreachable-code dimming."
summary: "Tooling that stays aligned with the real language surface."
order: 340
---

# LSP and VS Code

The editor experience is built around the official `fidan lsp` server and the official VS Code extension.

:::tip Shared metadata matters
The extension is strong because it does not maintain a separate fake language model. Builtins, decorators, stdlib modules, and stdlib member docs all come from shared compiler metadata.
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

## VS Code extension features

The extension is intended to feel like a real first-party language product, not a stale syntax-only add-on.

Current highlights:

- syntax highlighting
- semantic tokens
- diagnostics from the real language server
- hover docs
- completions
- signature help
- go to definition
- references
- rename
- format on save
- type-oriented inlay hints
- command palette integration for the Fidan CLI

## Typical workflow

:::tabs
@tab Save + format
```text
1. Save a `.fdn` file
2. The extension formats it through the official formatter
3. Diagnostics, hovers, and inlay hints refresh from the same LSP analysis
```

@tab Hover + inspect
```text
1. Hover `std.env.args()`
2. See the shared stdlib signature and docs
3. Get the inferred return type (`list`) in the same editor flow
```
:::

## Formatting behavior

The VS Code extension and CLI formatter share the same `.fidanfmt` config model. That means you can use:

- `fidan format ...`
- editor formatting on save

without maintaining separate style systems.

## Indentation

The extension defaults Fidan files to 4 spaces. If you still see 2-space behavior, check `.editorconfig` or workspace overrides first.

## Common commands

Typical editor actions wired into the extension include:

- run current file
- build current file
- check current file
- fix current file
- explain current line
- explain diagnostic code
- open REPL
- restart language server

## Recommendation

Use the official extension if you want the docs, compiler, formatter, and LSP metadata to stay aligned. The shared metadata layer is the reason hover and completion already know about:

- builtins
- decorators
- stdlib modules
- stdlib member return types
