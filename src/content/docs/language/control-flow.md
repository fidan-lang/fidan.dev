---
title: "Control flow"
sidebarLabel: "Control flow"
description: "Fidan control flow covers direct branching, readable aliases, ranges, loops, `check`, and dead-code-aware diagnostics."
summary: "The full flow-control surface, from `if` to `check` to structural dead-code warnings."
order: 130
---

# Control flow

Fidan's control flow aims for readable source without hiding what the program actually does.

## `if`

Canonical form:

```fidan
if score > 90 {
    print("great")
} otherwise when score > 75 {
    print("good")
} otherwise {
    print("keep going")
}
```

Accepted spellings:

- `otherwise`
- `else`
- `otherwise when`
- `else if`

## Ternary expressions

Fidan supports expression-form conditionals:

```fidan
var label = "pass" if score >= 5 else "fail"
```

There is also an implicit-subject shorthand that reads naturally for null checks:

```fidan
var actual = value if is not nothing else fallback
```

Equivalent to:

```fidan
var actual = value if (value != nothing) else fallback
```

## `for`

Loop over any iterable expression:

```fidan
for item in items {
    print(item)
}
```

### Ranges

Exclusive end:

```fidan
for i in 0..10 {
    print(i)
}
```

Inclusive end:

```fidan
for i in 0...10 {
    print(i)
}
```

## `while`

```fidan
while running {
    tick()
}
```

## `break` and `continue`

Canonical:

- `break`
- `continue`

Alias:

- `stop` = `break`

```fidan
for item in items {
    if item == "skip" {
        continue
    }
    if item == "done" {
        break
    }
}
```

## `check`

Fidan's pattern-style multi-branch form is `check`.

Statement form:

```fidan
check code {
    200 => print("ok")
    404 => print("missing")
    otherwise => print("other")
}
```

Expression form:

```fidan
var label = check code {
    200 => "ok"
    404 => "missing"
    otherwise => "other"
}
```

Wildcard spellings:

- `otherwise`
- `_`

## `attempt`

Error-handling flow also belongs to control flow:

```fidan
attempt {
    risky()
} catch error {
    print(error)
} otherwise {
    print("success")
} finally {
    cleanup()
}
```

Aliases:

- `try` = `attempt`
- `rescue` = `catch`

## `panic`

Trigger an immediate runtime failure:

```fidan
panic("bad state")
```

Alias:

- `throw` = `panic`

## Statement boundaries

Fidan uses newline-aware statement separation. You can also use:

- `;`
- `sep`

Examples:

```fidan
var x = 1
var y = 2
```

```fidan
var x = 1; var y = 2
```

The parser now rejects adjacent same-line expressions without either an operator or a separator.

## Dead code and unreachable code

The compiler and LSP detect structural dead code, including:

- statements after `return`
- statements after `panic`
- code after fully-terminating `if` branches
- `if false { ... }`
- `if true { ... } otherwise { ... }`
- `while false { ... }`
- constant and `const var` boolean cases such as:

```fidan
const var enabled = false

if enabled {
    print("never runs")
}
```

In the editor, these warnings are marked as unnecessary so unreachable code can be dimmed visually.

## Recommended style

- prefer punctuation operators like `>=` and `!=` in dense logic
- use `otherwise when` only when it genuinely improves readability
- keep ternaries short
- use `check` for multi-way branching instead of deep `if` chains when the same scrutinee drives every branch

Example:

```fidan
var kind = check status {
    200 => "ok"
    404 => "not-found"
    500 => "server-error"
    otherwise => "other"
}
```
