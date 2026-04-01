---
title: "Diagnostics index"
sidebarLabel: "Diagnostics"
description: "How Fidan diagnostic codes are structured, what the prefixes mean, and how to move from a code in the terminal/editor to a stable explanation."
summary: "The lookup-oriented companion to the diagnostics system."
order: 640
---

# Diagnostics index

Diagnostics in Fidan are identified by stable codes.

## Why the code system matters

Stable codes help with:

- terminal output
- editor diagnostics and hover
- CI workflows
- suppression via `--suppress`
- deeper explanation lookup via `fidan explain`

## Common prefixes

- `E` = compile-time error
- `W` = warning
- `R` = runtime failure

## Typical categories you will see

- unknown names and scope issues
- type mismatches
- call/signature mistakes
- null-safety issues
- data-race violations
- dead or unreachable code
- runtime panics and assertion failures

## Explanation guarantee

Every registered diagnostic code in the codebase is expected to have a corresponding explanation. That guarantee is enforced in the compiler codebase itself so explanations do not silently drift out of sync.

## CLI lookup

```bash
fidan explain E0401
fidan explain W2006
```

## Suppression

If you must silence specific diagnostics:

```bash
fidan check app.fdn --suppress W1005,W2006
```

Use this carefully. Suppression should be a deliberate choice, not a substitute for understanding the warning.
