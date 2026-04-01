---
title: "Project setup"
sidebarLabel: "Project setup"
description: "Use a predictable small-project layout, shared formatting, and package-ready structure without overengineering."
summary: "A clean project shape from the beginning saves cleanup later."
order: 25
---

# Project setup

Fidan does not force a heavy project scaffold on you, but a little structure
helps immediately.

## Recommended basics

```text
my-app/
  src/
  examples/
  tests/
  .fidanfmt
  dal.toml        # when the project becomes a package
```

## Why this shape works

- `src/` keeps the main code obvious
- `examples/` gives you runnable docs and smoke coverage
- `tests/` keeps bigger regression material separate from normal source files
- `.fidanfmt` lets the CLI and LSP share the same formatting defaults
- `dal.toml` becomes the package entry point when you publish

## Formatter config

The formatter respects a project-local `.fidanfmt` file.

That configuration is shared by:

- `fidan format`
- the language server
- the VS Code extension

## Package-ready mindset

Even if you do not publish immediately, writing code as if it might become a
package later keeps boundaries cleaner and examples easier to maintain.
