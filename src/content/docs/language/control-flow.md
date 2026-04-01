---
title: "Control flow"
sidebarLabel: "Control flow"
description: "Use direct control flow and rely on diagnostics to catch unreachable or structurally dead code."
summary: "Flow control stays readable and gets tooling support."
order: 130
---

# Control flow

Fidan's flow control is intentionally direct.

```fidan
if retries > 3 {
    panic("too many retries")
}

while index < len(items) {
    print(items[index])
    set index = index + 1
}
```

## Statement boundaries

Newlines matter. If two expressions are adjacent on the same line without an
operator or separator, that is a syntax error.

## Unreachable code warnings

The compiler warns on code that is structurally unreachable, including:

- statements after `return`
- statements after `panic`
- constant-false branches such as `if false`
- obvious constant and const-var boolean cases

In editor tooling these warnings are also tagged as unnecessary so unreachable
code can be dimmed visually.
