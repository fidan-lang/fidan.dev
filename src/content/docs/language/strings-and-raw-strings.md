---
title: "Strings and raw strings"
sidebarLabel: "Strings"
description: "Use interpolation, escapes, and raw strings intentionally."
summary: "Interpolation by default, raw strings when literal text matters."
order: 140
---

# Strings and raw strings

Normal strings support interpolation and standard escapes:

```fidan
print("hello {name}\n")
```

## Supported escapes

- `\\`
- `\"`
- `\n`
- `\t`
- `\r`
- `\{`
- `\}`

## Raw strings

Raw strings disable interpolation and escape handling:

```fidan
var pattern = r"^\w+\{literal\}$"
```

Use them when:

- regexes would otherwise become unreadable
- backslashes should stay literal
- braces should stay literal without escape noise
