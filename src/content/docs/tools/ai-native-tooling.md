---
title: "AI-native tooling"
sidebarLabel: "AI tooling"
description: "How Fidan's AI explain, fix, improve, and MCP workflows are grounded in compiler analysis instead of loose prompt text."
summary: "Compiler-backed AI workflows that stay inside the official toolchain."
order: 345
---

# AI-native tooling

Fidan's AI workflows are built around compiler-derived context.

That matters because the model is not asked to guess the program from raw text alone. The toolchain can provide the selected source range, diagnostics, inferred types, reads and writes, related symbols, call graph, type map, and a static runtime trace.

## Install the AI analysis toolchain

```bash
fidan toolchain add ai-analysis
```

Then configure a provider:

```bash
fidan exec ai setup
fidan exec ai doctor
```

`setup` supports:

- OpenAI-compatible cloud APIs
- Anthropic
- local Ollama
- local LM Studio
- custom OpenAI-compatible endpoints

API keys can come from environment variables or the OS keychain.

## Explain with AI

```bash
fidan explain app.fdn --line 42 --ai
fidan explain app.fdn --line 20 --end-line 36 --ai "focus on data flow"
```

The deterministic explain path already knows line behavior, inferred type information, reads, writes, and risks. The AI path adds a structured natural-language layer on top of that context.

## Fix diagnostics with AI

```bash
fidan fix app.fdn --ai
fidan fix app.fdn --ai "preserve public API" --in-place
```

Deterministic high-confidence fixes run first. The AI helper receives the compiler context after that pass and returns structured source hunks.

The CLI validates those hunks before applying them:

- old text must match the source being patched
- no-op hunks are rejected
- invalid ranges are rejected
- empty or unsupported responses are rejected

This keeps AI edits reviewable and tied to the file the compiler actually analyzed.

## Improve or refactor

```bash
fidan fix app.fdn --improve "reduce duplication" --in-place
fidan fix app.fdn --refactor "make the error path clearer" --in-place
```

`--improve` and `--refactor` use the same AI toolchain but ask for behavior-preserving cleanup rather than diagnostic repair.

Use this mode for targeted readability and maintainability passes. It is not a replacement for `fidan check`, `fidan test`, or review.

## MCP mode

```bash
fidan exec ai mcp
```

MCP mode exposes Fidan's compiler-backed analysis to compatible AI clients. The useful part is the boundary: external clients can ask through the Fidan toolchain instead of rebuilding their own parser, type model, diagnostics model, or symbol analysis.

## Direct configuration

For scripted setup, use `configure`:

```bash
fidan exec ai configure --set provider=openai-compatible
fidan exec ai configure --set model=YOUR_CONFIGURED_MODEL
fidan exec ai configure --set base_url=https://api.example.test/v1/chat/completions
```

The default config lives under `FIDAN_HOME`. Set `FIDAN_AI_ANALYSIS_CONFIG` when a project or CI job needs an explicit config file.

## What "AI-native" means here

In Fidan, AI-native does not mean the language delegates correctness to a model.

It means the compiler and tooling expose machine-readable facts that AI systems can use:

- syntax and semantic diagnostics
- line and range explanations
- module outlines
- symbol relationships
- call graph
- type map
- static runtime trace
- validated source-edit hunks

The compiler remains the source of truth. The model is an assistant layered over that truth.

## Deterministic codes and MCP tool surface

`fidan explain --diagnostic E0401` is the deterministic code reference. It cannot be combined with `--ai`; AI explanation targets source lines/ranges instead. The MCP tools are `explain_target_context`, `get_diagnostics`, `module_outline`, `project_summary`, `symbol_info`, `get_call_chain`, `get_type_info`, `get_runtime_trace`, `suggest_fix` and `apply_fix_preview`.

The runtime trace in compiler analysis is a **static** trace, not a recording that actually executed arbitrary user code. A source-edit preview is not proof that a suggested patch preserves behavior. Review, check and test it. Provider/model availability depends on your configuration; this documentation does not guarantee a particular hosted model or require a provider for ordinary compiler/LSP use.
