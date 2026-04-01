---
title: "Testing"
sidebarLabel: "Testing"
description: "Use inline test blocks, std.test helpers, workspace sweeps, and backend-specific runs to keep Fidan code honest."
summary: "Testing is a workflow, not just a command name."
order: 360
---

# Testing

Fidan treats testing as a normal part of the language workflow.

## Source-level tests

Inline test blocks keep simple checks close to the code they exercise:

```fidan
test "basic addition" {
    assert_eq(2 + 2, 4)
}
```

Run them with:

```bash
fidan test math.fdn
```
