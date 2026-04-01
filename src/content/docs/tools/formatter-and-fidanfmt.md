---
title: "Formatter and .fidanfmt"
sidebarLabel: "Formatter"
description: "The official formatter, the shared `.fidanfmt` config model, and how CLI, LSP, and VS Code formatting stay aligned."
summary: "One formatter implementation, one config path, one expected style."
order: 320
---

# Formatter and .fidanfmt

Fidan has one formatter implementation shared by:

- `fidan format`
- the language server
- the VS Code extension

That shared implementation is the reason formatting stays coherent instead of drifting across tools.

## CLI usage

```bash
fidan format src/app.fdn
fidan format src/app.fdn --in-place
fidan format src/app.fdn --check
```

## Common flags

- `--in-place` rewrites the file instead of printing to stdout
- `--check` exits nonzero when the file is not already formatted
- `--indent-width N`
- `--max-line-len N`

## `.fidanfmt`

Place a `.fidanfmt` file in the project root:

```toml
indent_width = 4
max_line_len = 100
```

The formatter walks upward to the nearest `.fidanfmt`.

CLI overrides still win over file config:

```bash
fidan format src/app.fdn --indent-width 2
```

## What the formatter normalizes

Examples of current normalization policy:

- canonical whitespace and indentation
- normalized statement grouping
- canonical forms like `dynamic` instead of `flexible`
- stable multiline formatting for longer signatures

## Comments

Comment preservation is part of the real formatter path now. The formatter is not supposed to “fix” source by deleting your intent comments.

## Editor interaction

The VS Code extension uses the same formatting backend. If formatting looks wrong in the editor:

1. check `.fidanfmt`
2. check `.editorconfig`
3. check workspace/editor overrides

Fidan's own preferred indentation is 4 spaces.
