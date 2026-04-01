---
title: "Actions"
sidebarLabel: "Actions"
description: "Define callable behavior with explicit signatures and readable parameter contracts."
summary: "Actions are the main callable unit in Fidan."
order: 120
---

# Actions

Actions are Fidan's callable building block.

```fidan
action greet with (certain name oftype string) returns nothing {
    print("hello, {name}")
}
```

## Signature style

The syntax is explicit by design:

- `certain` marks non-null expectations
- `optional` is available when you want to say that out loud
- `returns` keeps the return contract obvious

## Named arguments

Fidan supports readable named calls:

```fidan
action create_user with (
    certain name oftype string,
    optional age oftype integer = 18
) returns nothing {
    print("{name} is {age}")
}

create_user(name set "Ada", age = 25)
```

## Multiline formatting

Long signatures are formatted cleanly and the formatter preserves multiline
layout instead of flattening everything back to one line.
