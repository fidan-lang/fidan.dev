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
- replay and tracing flows that make failures easier to trust

Editor-specific integrations live in the dedicated **Editors** section so the language server and client integrations can evolve independently.
