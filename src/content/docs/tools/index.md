---
title: "Tools"
sidebarLabel: "Overview"
description: "The CLI, formatter, diagnostics, replay tooling, and the core language server belong to the Fidan product, not optional afterthoughts."
summary: "A language experience shaped as a toolchain, not just a compiler binary."
order: 300
---

# Tools

Fidan is not only a language grammar and a code generator.

The tooling story is part of why the language feels coherent:

- one CLI front door
- one formatter path shared by the CLI and editor integrations
- one diagnostics system with documented codes
- one language server with shared compiler metadata
- one AI analysis path grounded in compiler facts
- replay and tracing flows that make failures easier to trust

Editor-specific integrations live in the dedicated **Editors** section so the language server and client integrations can evolve independently.

## AI belongs in the tooling layer

Fidan's AI-assisted explain, fix, improve, and MCP workflows live in the official toolchain because they depend on real compiler context: diagnostics, type information, reads and writes, symbols, call graphs, and static traces.

Start with [AI-native tooling](/docs/tools/ai-native-tooling) when you want the concrete command flow.
