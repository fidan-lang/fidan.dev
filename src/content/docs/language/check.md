---
title: "Check expressions"
sidebarLabel: "Check"
description: "Use `check` for value-driven branching that reads like explicit selection instead of a long conditional chain."
summary: "Pattern-style branching for both statements and expressions."
order: 135
---

# Check expressions

Use `check` when multiple branches all revolve around the same scrutinee.

## Statement form

```fidan
check status {
    200 => print("OK")
    404 => print("Not found")
    otherwise => print("Other")
}
```

## Expression form

```fidan
var label = check status {
    200 => "ok"
    404 => "missing"
    otherwise => "other"
}
```

## Wildcards

Use either:

- `otherwise`
- `_`

## When `check` is better than `if`

- enum-like or tag-like dispatch
- status/code handling
- multi-way branching on one value
- code where each branch is conceptually “case X”

## When plain `if` is better

- simple boolean guard logic
- short conditionals
- branches driven by unrelated conditions
