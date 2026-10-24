---
title: "Actions"
sidebarLabel: "Actions"
description: "Define top-level actions, extension actions, parallel actions, and inline anonymous actions with readable parameter contracts and explicit return types."
summary: "Everything callable in Fidan, from normal functions to inline action expressions."
order: 120
---

# Actions

Actions are Fidan's primary callable unit. If you come from another language, think “function” first, then add Fidan's readable parameter and declaration style on top.

## Basic action

```fidan check=compile
action greet with (certain name oftype string) returns nothing {
    print("Hello, {name}")
}
```

## Signature shape

Canonical action declaration:

```text
action name with (params...) returns Type {
    body
}
```

Parts:

- `action`
- the action name
- optional `with (...)`
- optional `returns <type>`
- block body

## Parameters

### Plain parameters

Required, but not automatically non-null:

```fidan check=compile
action log_value with (value oftype dynamic) returns nothing {
    print(value)
}
```

### `certain`

Required and non-null by contract:

```fidan check=compile
action greet with (certain name oftype string) returns nothing {
    print(name)
}
```

### `optional`

May be omitted, and can have defaults:

```fidan check=compile
action create_user with (
    certain name oftype string,
    optional age oftype integer = 18
) returns nothing {
    print("{name} is {age}")
}
```

### Separators inside parameter lists

Accepted separators:

- `,`
- `also`

```fidan check=compile
action create_user with (
    certain name oftype string also optional age oftype integer = 18
) returns nothing {
}
```

## Return types

Explicit return types keep public signatures clear:

```fidan check=compile
action add with (certain a oftype integer, certain b oftype integer) returns integer {
    return a + b
}
```

If no useful value is returned, use `returns nothing`.

## Named arguments

Fidan supports named calls:

```fidan check=compile
action create_user with (
    certain name oftype string,
    optional age oftype integer = 18
) returns nothing {
    print("{name} is {age}")
}

create_user(name = "Ada", age = 37)
create_user(name set "Ada", age set 37)
```

## Positional arguments

Normal positional calls work as expected:

```fidan check=syntax
create_user("Ada", 37)
create_user("Ada")
```

## Top-level actions

Most actions are top-level declarations:

```fidan check=compile
action parse_port with (text oftype string) returns integer {
    return integer(text)
}
```

## Entrypoint behavior (`action main`)

`action main` is a normal action declaration. It does not auto-run by itself;
call `main()` explicitly in the module you want to execute.

```fidan check=compile
action main {
    print("hello")
}

main()
```

Declarations are hoisted, so calls can appear before declaration text:

```fidan check=compile
var value = square(8)

action square with (certain x oftype integer) returns integer {
    return x * x
}
```

This is also where decorators like `@precompile` and `@extern` apply.

## Extension actions

Extension actions add behavior to an existing object without editing the original object body:

```fidan check=compile
action bark extends Dog returns nothing {
    print("{this.name} barks")
}
```

Inside an extension action:

- `this` is the receiver
- the call syntax is still method-like on the object

## Parallel actions

You can declare a `parallel action`:

```fidan check=syntax
parallel action hash_chunk with (chunk oftype string) returns string {
    return do_hash(chunk)
}
```

This marks the action for the parallel execution model rather than the ordinary one. It is intentionally a separate language surface, not an optimization flag.

## Inline anonymous actions

Actions are also first-class values through inline action expressions:

```fidan check=compile
var double = action with (certain value oftype integer) returns integer {
    return value * 2
}
```

This is especially useful for:

- callbacks
- `Shared.update(...)`
- collection helpers
- one-off transformations without naming a top-level function

Example:

```fidan check=syntax
counter.update(action with (certain value oftype integer) returns integer {
    return value + 1
})
```

## Constructors

Inside objects, constructors use `new` rather than a same-name action:

```fidan check=compile
object User {
    var name oftype string

    new with (certain name oftype string) {
        this.name = name
    }
}
```

Parent constructor calls go through `parent(...)`.

## Method-like actions inside objects

Actions inside objects are just actions with receiver semantics:

```fidan check=compile
object User {
    var name oftype string

    action greet returns string {
        return "Hello, {this.name}"
    }
}
```

## `return`

Use `return` for explicit early exits and returned values:

```fidan check=compile
action max2 with (a oftype integer, b oftype integer) returns integer {
    if a > b {
        return a
    }
    return b
}
```

Bare `return` without a value is valid in `returns nothing` actions.

## Decorators on actions

Current compiler-known decorators:

- `@precompile`
- `@deprecated`
- `@extern`
- `@unsafe`

Example:

```fidan check=compile
@precompile
action hot_path returns integer {
    return 42
}
```

## Recommended style

Good defaults:

- write explicit parameter contracts
- use `certain` when non-null is part of the API
- use `optional ... = ...` when you want omission to be intentional
- keep return types explicit on public actions
- prefer named arguments when the call would otherwise be ambiguous

Example:

```fidan check=compile
action connect with (
    certain host oftype string,
    optional port oftype integer = 5432,
    optional use_tls oftype boolean = true
) returns dynamic {
    return {"host": host, "port": port, "tls": use_tls}
}
```

## Callable reflection and runtime argument lists

The upcoming compiler exposes defensive `name` and `parameters` snapshots on
first-class actions. Parameter descriptors report names, types, required/certain
status and whether a default value is known. Reading metadata never evaluates a
computed default or exposes captured values.

```fidan check=run
action increment with (certain value oftype integer) returns integer {
    return value + 1
}

var callback oftype action = increment
assert_eq(callback.name, "increment")
assert_eq(callback.parameters[0]["name"], "value")
assert_eq(callback(4), 5)
assert_eq(callback.invoke([4]), 5)
```

Use the ordinary call when arguments are known in source. `invoke(list)` is the
general operation for a runtime-computed positional argument list, for example
inside a signature-driven CLI framework. It uses normal argument/default/type and
exception handling, with no separate args-specific dispatcher. It does not treat
the list as named arguments. Mutating a metadata snapshot does not alter the action.
These APIs require the matching future compiler; they are absent from published
Fidan 1.0.16. Select that compiler explicitly in editor `fidan.server.path`.
