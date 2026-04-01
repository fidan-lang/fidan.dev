---
title: "Formatter and .fidanfmt"
sidebarLabel: "Formatter"
description: "Use the shared formatter in the CLI and editor, and control project defaults with .fidanfmt."
summary: "One formatter path, one config model, fewer surprises."
order: 320
---

# Formatter and .fidanfmt

Fidan has one formatter implementation that is shared by:

- `fidan format`
- the language server
- the VS Code extension

## CLI usage

```bash
fidan format src/app.fdn
fidan format src/app.fdn --in-place
fidan format src/app.fdn --check
```

## Project config

Add a `.fidanfmt` file at the project root:

```toml
indent_width = 4
max_line_len = 100
```
