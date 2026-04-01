---
title: "Objects and inheritance"
sidebarLabel: "Objects and inheritance"
description: "Use objects and inheritance where attached state and behavior are clearer than scattered free functions."
summary: "Objects exist for structure, not ceremony."
order: 125
---

# Objects and inheritance

Fidan supports objects and inheritance when state and behavior clearly belong
together.

```fidan
object Animal {
    var sound oftype string

    new with (certain sound oftype string) {
        this.sound = sound
    }

    action speak returns string {
        return "I say: {this.sound}"
    }
}
```

## When objects are a good fit

- stateful services
- domain models with attached behavior
- shared implementation where inheritance is actually clearer than repetition

## Extension actions

You can add behavior without modifying the original object definition:

```fidan
action bark extends Dog {
    print("{this.name} goes WOOF")
}
```
