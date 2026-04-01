---
title: "Project setup"
sidebarLabel: "Project setup"
description: "A practical Fidan project layout, how source modules are typically arranged, where `.fidanfmt` and Dal files live, and how to keep examples/tests from becoming chaos."
summary: "A clean project shape that scales from experiments to publishable packages."
order: 25
---

# Project setup

Fidan does not force a giant framework layout on you, but a little structure pays off quickly.

## Recommended application layout

```text
my-app/
  src/
    main.fdn
    helpers.fdn
    net/
      client.fdn
  examples/
  tests/
  .fidanfmt
```

## Recommended package layout

When the project is meant to become a Dal package, prefer:

```text
my-package/
  src/
    init.fdn
  examples/
  tests/
  docs/
  assets/
  dal.toml
  dal.lock
  .dalignore
  .fidanfmt
  README.md
  LICENSE
```

## Why this shape works

- `src/` keeps production code obvious
- `src/init.fdn` is the package entry expected by Dal
- `examples/` gives you runnable documentation and smoke coverage
- `tests/` keeps heavier regression cases separate from the main source tree
- `docs/` and `assets/` give packaging a clean home for non-code project material
- `.fidanfmt` keeps CLI and editor formatting aligned
- `dal.toml` and `dal.lock` make package intent and dependency resolution explicit

## Module organization

Typical import patterns:

```fidan
use helpers
use net.client
use std.io as io
```

That usually maps to:

- `helpers.fdn`
- `net/client.fdn`

Keep module names stable and boring. It makes imports and file moves much easier to reason about.

## Examples and tests

Good habits:

- put user-facing example code in `examples/`
- keep integration or regression material in `tests/`
- if a source file embeds inline `test {}` blocks, still use `tests/` for larger scenario files and fixtures

## Formatter config

The formatter respects a project-local `.fidanfmt` file and the editor tooling shares that config.

Minimal example:

```toml
indent_width = 4
max_line_len = 100
```

## Package readiness

Even if you are not publishing yet, it is worth structuring projects as if they could become packages later. That usually leads to:

- cleaner module boundaries
- fewer magic local paths
- better examples
- easier extraction into reusable packages
