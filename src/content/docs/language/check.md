---
title: "Check expressions"
sidebarLabel: "Check"
description: "Use check when decision logic should read like rule selection or validation instead of a pile of raw conditionals."
summary: "Decision logic that reads like intent."
order: 135
---

# Check expressions

Use `check` when you want branching to read like explicit decision or
validation logic.

```fidan
check status {
    200 => print("OK")
    404 => print("Not found")
    _ => print("Other")
}
```

## When `check` is better than `if`

- enum-like value selection
- status/code dispatch
- intent-heavy validation logic

## When plain `if` is better

- simple boolean conditions
- short guard logic
- cases where introducing a branch table would be less readable
