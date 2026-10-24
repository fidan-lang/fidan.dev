---
title: "Callable reflection and invocation"
description: "Inspect callable contracts and invoke positional argument lists without a second calling convention."
summary: "Inspect callable contracts and invoke positional argument lists without a second calling convention."
order: 118
---

# Callable reflection and invocation

These APIs belong to the upcoming source candidate. They are not available in the published Fidan 1.0.16 compiler. See [candidate compatibility](/docs/getting-started/release-candidate).

## Call normally when the arguments are known

`callback(value, count)` is the normal call syntax. Use `callback.invoke(arguments)` when the positional argument list is itself computed at runtime, such as a CLI framework dispatching a parsed command. `.invoke()` is not required for ordinary calls and does not create a different function type.

The receiver must be callable; `invoke` accepts **exactly one list**. Each element becomes one positional argument. A tuple, dictionary or scalar is not an argument list. Normal callback dispatch enforces required arguments, surplus-argument rejection, defaults, and runtime parameter checks. It does not interpret dictionary keys as named arguments.

```fidan check=run expect=stdout
use std.math as math

action greet with (certain name oftype string, optional count oftype integer = 1) returns string {
    return name + string(count)
}
var callback oftype action = greet
assert_eq(callback("Ada", 2), callback.invoke(["Ada", 2]))
assert_eq(callback.invoke(["Ada"]), "Ada1")
assert_eq(math.abs.invoke([-4]), 4)
print(callback.invoke(["Ada", 3]))
```

```text
Ada3
```

## Metadata is descriptive, not a mutable signature

`callback.name` is its name; `callback.parameters` is a fresh list of dictionaries in argument order. Compiler-generated closure captures are excluded.

| Field           | Meaning                                                                            |
| --------------- | ---------------------------------------------------------------------------------- |
| `name`          | Source parameter name                                                              |
| `type`          | Declared type description                                                          |
| `certain`       | Whether the parameter rejects `nothing`                                            |
| `required`      | Whether the caller must supply a value                                             |
| `default_known` | Whether the default is available as metadata without executing user code           |
| `default`       | Known literal default, otherwise `nothing`; inspect `default_known` to distinguish |
| `variadic`      | Whether the parameter describes a variadic argument tail                           |

Reading metadata never executes a computed default. That default is evaluated by normal invocation when omitted. Mutating the returned list/dictionaries does not change the callable.

```fidan check=run
use std.math as math

action increment with (certain value oftype integer, optional step oftype integer = 1) returns integer {
    return value + step
}
var metadata = increment.parameters
assert_eq(metadata[0]["name"], "value")
assert_eq(metadata[0]["required"], true)
assert_eq(metadata[1]["default_known"], true)
assert_eq(metadata[1]["default"], 1)
metadata[0]["name"] = "changed"
assert_eq(increment.parameters[0]["name"], "value")
assert_eq(math.pow.parameters[0]["required"], true)
```

`action`, `callable` and `fn` name the same coarse callable type. That type alone does not encode a complete parameter/return signature. Statically known functions retain their compiler metadata; erased callable identities may need runtime validation. First-class stdlib callables share the central arity contract, including aliases, optional and variadic parameters. Their metadata can describe parameter types as dynamic and does not fabricate known defaults.

## Closures

Inline actions capture local bindings when created. Captured collection/object values retain their reference semantics; capture is not a deep copy. Globals are resolved through global storage, so later global assignments are visible. A closure's reflection describes its callable arguments, not hidden captures.

```fidan check=run
action prefixer with (certain prefix oftype string) returns action {
    return action with (certain text oftype string) returns string {
        return prefix + text
    }
}
var callback = prefixer("item:")
assert_eq(len(callback.parameters), 1)
assert_eq(callback.invoke(["one"]), "item:one")
```

Custom decorators use ordinary callables and may return a replacement callable. See [decorators](/docs/language/decorators). Reflection does not make native FFI function pointers safe or replace their ABI contract.
