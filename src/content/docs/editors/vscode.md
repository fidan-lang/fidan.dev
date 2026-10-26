---
title: "VS Code"
sidebarLabel: "VS Code"
description: "The official VS Code integration for Fidan: diagnostics, hover docs, completions, formatting, inlay hints, command integration, and unreachable-code dimming."
summary: "A first-party VS Code experience built on the real Fidan language server."
order: 360
---

# VS Code

The official VS Code extension is intended to feel like a real first-party language product, not a stale syntax-only add-on.

## Highlights

Current highlights include:

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
- AI-assisted fix, improve, and explain commands
- selection-aware explain commands from the editor context menu
- dead-code dimming for unreachable statements

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
- AI fix current file
- AI improve current file
- explain selection
- explain current line or current selection
- explain current line or current selection with AI
- explain diagnostic code
- open REPL
- restart language server

## Explain workflows

The explain flow in VS Code is designed to stay close to how people already work in the editor:

- if nothing is selected, `Explain Current Line(s)` uses the current line
- if text is selected, the command derives the selected line span automatically
- `Explain Selection` appears in the editor context menu only when text is selected
- before the command runs, the extension shows the exact line span being sent to the CLI

This means you do not have to manually count lines just to ask for an explanation.

## AI-assisted workflows

The extension surfaces the AI-enabled CLI flows directly:

- `Fidan: AI Fix File`
- `Fidan: AI Improve File`
- `Fidan: Explain Current Line(s) with AI`

These commands still go through the official `fidan` binary, so editor behavior stays aligned with the same toolchain you use in CI and in the terminal.

## Recommendation

Use the official VS Code extension if you want the docs, compiler, formatter, and LSP metadata to stay aligned.

## Stable and candidate configuration

Normal LSP editing requires Fidan, not an AI provider. AI-assisted source explain/fix/improve additionally require a compatible `ai-analysis` helper and provider setup. Diagnostic-code explanation is deterministic: the CLI rejects `--diagnostic` combined with `--ai`.

Set `fidan.server.path` to the actual candidate executable when using candidate-only APIs. `fidan.server.extraArgs` can include verbosity flags; logs remain on stderr while JSON-RPC uses stdout. Restart the language server after changing its binary. The run error limit defaults to `1`; choose `0` for unlimited errors. The selected run trace mode is also passed explicitly to REPL. Build uses the available selected AOT backend (`auto` may choose LLVM); `obj` is a build emit target, not a run target. Network/process sandbox flags are not supported.
