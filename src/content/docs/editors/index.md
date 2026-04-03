---
title: "Editors"
sidebarLabel: "Overview"
description: "Editor integrations for Fidan, built on top of the official language server and formatter."
summary: "Thin editor clients on top of the real language tooling."
order: 350
---

# Editors

Fidan editor integrations are intentionally built on top of the same core pieces:

- `fidan lsp`
- the official formatter
- shared compiler metadata
- CLI command integration

This keeps editors aligned with the real language instead of fragmenting into separate partial implementations.

## Current integrations

As of today, the main first-party editor integration is:

- VS Code

As more integrations land, this section is where they should live. The LSP itself stays documented under **Tools**.
