---
title: "Objects and inheritance"
sidebarLabel: "Objects and inheritance"
description: "Use objects when state and behavior belong together, constructors when initialization matters, and inheritance only where it improves clarity."
summary: "Stateful structure without forcing every problem into objects."
order: 125
---

# Objects and inheritance

Fidan supports objects because some problems really do want state plus attached behavior.

## Basic object

```fidan check=compile
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

## Constructors

Constructors use `new`:

```fidan check=compile
object User {
    var name oftype string

    new with (certain name oftype string) {
        this.name = name
    }
}
```

## Receiver access

Inside object actions:

- `this` is the current receiver
- fields are accessed through `this.field`

## Inheritance

Use `extends` when there is a real parent-child relationship:

```fidan check=compile context=animal
object Dog extends Animal {
    var name oftype string

    new with (certain name oftype string) {
        this.name = name
        parent(sound = "Woof")
    }
}
```

## Parent constructor calls

Use `parent(...)` inside `new` to invoke the parent constructor:

```fidan check=run context=parent
parent(sound = "Woof")
```

## Extension actions

You can add behavior without editing the original object body:

```fidan check=compile context=dog
action bark extends Dog returns nothing {
    print("{this.name} goes WOOF")
}
```

This is useful when:

- the original object should stay minimal
- the behavior belongs in another module
- you want to avoid reopening the original type definition

## When objects are a good fit

- stateful services
- domain models with attached behavior
- structured APIs where methods read more clearly than scattered free functions

## When free actions are better

- stateless transforms
- simple utilities
- logic that does not naturally belong to a receiver

## Native implementation boundary

Native AOT currently represents objects with branded Dict-backed storage, while the interpreter has its own object representation. That is an implementation detail, not permission to call arbitrary Dict methods on an object. Use declared fields, constructors and methods. Representative inheritance, named/default calls, receiver decoration and identity cases have dedicated backend fixtures; this is not a claim of universal interpreter/native object reflection parity.
