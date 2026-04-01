---
title: "Diagnostics"
sidebarLabel: "Diagnostics"
description: "Understand how errors and warnings are rendered, why codes matter, and how explanations stay discoverable in the terminal and editor."
summary: "Diagnostics designed for comprehension, not intimidation."
order: 330
---

# Diagnostics

Fidan diagnostics are designed to stay readable under pressure.

## What a good diagnostic should do

- identify the exact span that matters
- give the message in human terms, not compiler-internal jargon
- keep a stable code
- point to an explanation
- stay consistent in the terminal and the editor

## Explanations

Every registered diagnostic code in the codebase has a corresponding
explanation.
