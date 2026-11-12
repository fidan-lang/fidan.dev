---
title: "Compiler-grounded AI quickstart"
sidebarLabel: "AI quickstart"
description: "Try deterministic Fidan compiler analysis without an API key, then optionally add AI Analysis Helper 1.0.6 for model-assisted explanations, fix previews and MCP."
summary: "A reproducible compiler-grounded AI walkthrough with a real Fidan example and optional provider setup."
order: 346
---

# Compiler-grounded AI quickstart

Fidan exposes compiler-derived diagnostics, inferred types, source-level symbol relationships and static trace information to its developer tools. You can try deterministic analysis **without an AI provider or API key**. Model-assisted explain, fix and improve commands use the optional `ai-analysis` helper and a provider you configure.

This walkthrough adapts the [compiler repository quickstart](https://github.com/fidan-lang/fidan/blob/main/docs/COMPILER_GROUNDED_AI_QUICKSTART.md). It uses the [real `check_val.fdn` example](https://github.com/fidan-lang/fidan/blob/main/test/examples/check_val.fdn), rather than a fabricated model transcript. Run the commands using the published Fidan CLI from a checkout of that repository.

## 1. Install Fidan

Follow the [installation guide](/docs/getting-started/install) for Windows, macOS or Linux and verify that `fidan --version` works. Then:

```bash
git clone https://github.com/fidan-lang/fidan.git
cd fidan
fidan run test/examples/check_val.fdn
```

The example selects a weekday from a `check` expression:

```fidan check=run expect=stdout
var day = 3
var day_name = check day {
    1 => "Monday"
    2 => "Tuesday"
    3 => "Wednesday"
    _ => "Weekend"
}
print("{day_name}")
```

```text
Wednesday
```

## 2. Ask the compiler, without AI

```bash
fidan check test/examples/check_val.fdn
fidan explain test/examples/check_val.fdn --line 2
```

`check` performs deterministic validation; `explain` selects source-level context from the compiler's analysis. Exact details depend on the source construct and compiler version. This stage requires **no model, no login and no AI credits**.

## 3. Optional: ask a model using compiler context

Install the separately versioned **AI Analysis Helper 1.0.6** and configure a provider. This does not change the compiler version:

```bash
fidan toolchain add ai-analysis --version 1.0.6
fidan exec ai setup
fidan exec ai doctor
fidan explain test/examples/check_val.fdn --line 2 --ai "Explain this branch selection"
```

You can configure an OpenAI-compatible endpoint, Anthropic, Ollama or LM Studio. Local endpoints do not require a commercial API key, but a local model must be running. Remote providers may incur charges, and source/context may be sent to them. Read the configuration prompts before proceeding.

The model receives structured compiler context alongside source text. **A compiler-provided fact is not proof that every model explanation is correct.** Verify its claims against the code and compiler output.

## 4. Optional: explore fixes without modifying files

Create a separate file named `broken.fdn` containing:

```fidan check=error error=E0101
var count = 41
print(completely_unknown_xyz)
```

Then run:

```bash
fidan check broken.fdn
fidan fix broken.fdn --ai
```

`check` should report an undefined symbol (`E0101`) and exit unsuccessfully. Run the fix command separately after inspecting that diagnostic. With a configured model, `fix --ai` may propose changes, but **the model is not guaranteed to produce a useful fix**. Without `--in-place`, the command is for review. Avoid treating compiler validation of a suggested fix as a behavioral correctness proof.

Review the preview before choosing to apply changes. After applying any edit, run `fidan check broken.fdn` again and test the intended behavior. See [testing](/docs/tools/testing) for the test workflow.

## 5. MCP integration

```bash
fidan exec ai mcp
```

This is a **stdio MCP server** for a configured client, not an interactive terminal chat. It provides compiler-grounded tools for diagnostics, symbol information, types, call relationships, static traces and fix previews. Configure your MCP client to spawn the command; do not expose the helper as an unauthenticated network service.

## What this does not claim

- **Not a live debugger:** `get_runtime_trace` reports a static, source-level trace, not sampled values, live stack frames or changing scopes during execution.
- **Not automatic correctness:** the compiler can validate diagnostics/type state but does not prove model edits preserve behavior.
- **Not universal backend parity:** interpreter, selective JIT, Cranelift AOT and optional LLVM AOT have different implementation coverage.
- **Not zero-cost AI:** deterministic tools are free of model calls, but configured external AI providers may charge.

For details, see [AI-native tooling](/docs/tools/ai-native-tooling) and the [CLI reference](/docs/reference/cli-options).
