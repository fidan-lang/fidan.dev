---
title: "Publishing and .dalignore"
sidebarLabel: "Publishing"
description: "Publish packages cleanly and use .dalignore to exclude unneeded content from the allowed package surface."
summary: "Strict package shape plus flexible exclusion where you need it."
order: 530
---

# Publishing and .dalignore

Dal packages use an allowlisted top-level package surface. `.dalignore` lets
you trim within that allowed surface.

## What `.dalignore` is for

Examples:

- remove large assets under `assets/`
- exclude fixture-heavy subtrees under `tests/`
- skip local benchmark artifacts under `examples/`
