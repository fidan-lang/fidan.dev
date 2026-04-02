---
title: "Syntax reference"
sidebarLabel: "Syntax reference"
description: "An exhaustive reference for literals, statements, expressions, aliases, separators, operators, precedence, and the canonical shapes the parser accepts today."
summary: "Every syntax family in one page, including synonyms and parser-level details."
order: 610
---

# Syntax reference

Use this page when you want the exact surface syntax, not the sales pitch.

Fidan intentionally accepts a small set of readable aliases, but the formatter tends to normalize toward the canonical forms shown in the examples below. This reference covers both:

- the **canonical spellings** you should prefer in new code
- the **accepted aliases and synonyms** that the lexer/parser still understand

## Quick syntax map

At a glance, Fidan programs are made from:

- top-level `use`, `export use`, `var`, `const var`, `action`, `object`, `enum`, and `test`
- block statements such as `if`, `for`, `while`, `attempt`, `check`, `parallel`, and `concurrent`
- expressions such as calls, field access, indexing, slices, comprehensions, interpolation, `spawn`, `await`, and ternaries
- decorators like `@precompile`, `@deprecated`, `@extern`, and `@unsafe`

## Comments

### Line comments

Use `#` for a line comment:

```fidan
var port = 8080  # local dev server
```

### Nested block comments

Use `#/` to start and `/#` to end a block comment. These comments are nestable:

```fidan
#/
outer comment
    #/
    nested comment
    /#
back in outer comment
/#
```

## Statement separators

Fidan inserts statement boundaries automatically at newlines when the preceding token can terminate a statement.

These all separate statements:

- a newline
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

```fidan
var x = 1 sep var y = 2
```

Important rule:

- adjacent expressions on the same line still need either an operator or a separator

So this is invalid:

```fidan check=skip
return left()right()
```

## Literals

### Integers

Accepted forms:

- decimal: `42`
- underscores for readability: `1_000_000`
- hex: `0xFF`
- binary: `0b101010`

```fidan
var a = 42
var b = 1_000
var c = 0x2A
var d = 0b101010
```

### Floats

```fidan
var pi = 3.14159
var big = 1_000.25
var exp = 6.02e23
```

### Booleans

Accepted spellings:

- `true`
- `false`
- `True`
- `False`

The formatter prefers lowercase.

### Nothing

`nothing` is the language null-like value:

```fidan
var maybe_name = nothing
```

### Strings

Normal strings support interpolation and escape sequences:

```fidan
var name = "Ada"
print("Hello, {name}")
```

Supported escapes in normal strings:

- `\\`
- `\"`
- `\n`
- `\t`
- `\r`
- `\{`
- `\}`

### Raw strings

Raw strings start with `r"` and do **not** process escapes or interpolation:

```fidan
var pattern = r"\d+\s+items"
var literal = r"{name} stays literal"
```

Use normal strings when you need embedded quotes:

```fidan
var quote = "\""
```

## Names and identifiers

Regular identifiers:

```fidan
var total = 0
action build_report { }
object TaskRunner { }
```

After a dot, Fidan also allows keyword-like field names:

```fidan
obj.set()
obj.new()
```

That is why stdlib calls like `math.pow()` and APIs like `queue.top()` work cleanly.

## Variable declarations

### Mutable declarations

```fidan
var name = "Ada"
var count oftype integer = 10
var pending_value oftype Pending oftype string
```

### Immutable declarations

Use `const var` for single-assignment variables:

```fidan
const var retries = 3
const var use_cache = true
```

### Type annotation forms

Canonical form:

```fidan
var count oftype integer
```

Also accepted:

```fidan
var count -> integer
```

### Destructuring

Tuple destructuring works in declarations:

```fidan
var (left, right) = pair()
```

## Assignment

### Canonical assignment

```fidan
value = 10
person.name = "Ada"
items[0] = "first"
```

### `set` assignment synonym

`set` is accepted as an infix assignment/operator synonym in the same slot where you would normally write `=`:

```fidan
var value set 10
person.name set "Ada"
name set "Ada"
```

The formatter generally normalizes toward `=`.

### Compound assignment

Supported:

- `+=`
- `-=`
- `*=`
- `/=`
- `%=`

```fidan
count += 1
total *= scale
```

## Parameters and arguments

### Parameter modifiers

Supported parameter modes:

- plain parameter: required, may still be `nothing` unless the type/flow rules prove otherwise
- `certain`: required and non-null by contract
- `optional`: may be omitted and can have a default

```fidan
action greet with (
    certain name oftype string,
    optional title oftype string = "Engineer",
    age oftype integer
) returns nothing {
    print("{title} {name} ({age})")
}
```

### Parameter list syntax

Canonical:

```fidan
action build with (certain name oftype string, optional age oftype integer = 18) returns nothing {
}
```

Separators accepted inside parameter and argument lists:

- `,`
- `also`

Example:

```fidan
action create with (certain name oftype string also optional age oftype integer = 18) returns nothing {
}
```

### Call arguments

Positional:

```fidan
create("Ada", 37)
```

Named arguments:

```fidan
create(name = "Ada", age = 37)
create(name set "Ada", age set 37)
```

## Actions

### Top-level action

```fidan
action add with (certain a oftype integer, certain b oftype integer) returns integer {
    return a + b
}
```

### Parallel action

```fidan
parallel action hash_chunk with (chunk oftype string) returns string {
    return do_hash(chunk)
}
```

### Extension action

```fidan
action bark extends Dog returns nothing {
    print("{this.name} barks")
}
```

### Inline anonymous action

Inline actions are expressions:

```fidan
items.map(action with (value oftype integer) returns integer {
    return value * 2
})
```

## Objects

### Basic object

```fidan
object User {
    var name oftype string

    new with (certain name oftype string) {
        this.name = name
    }

    action greet returns nothing {
        print("Hi, {this.name}")
    }
}
```

### Inheritance

```fidan
object Admin extends User {
    new with (certain name oftype string) {
        parent(name = name)
    }
}
```

### Special object names

- `this` refers to the current receiver
- `parent(...)` calls the parent constructor
- `new` declares the constructor

## Enums

Fidan supports `enum` declarations with simple or payload-bearing variants.

```fidan
enum Result {
    Ok
    Err(message oftype string)
}
```

Pattern-style handling is typically done with `check`.

## Control flow

### `if`

Canonical:

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

### Ternary expressions

Form:

```fidan
var label = "hot" if temp > 30 else "cold"
```

Fidan also supports the implicit-subject shorthand:

```fidan
var actual = value if is not nothing else fallback
```

Equivalent to:

```fidan
var actual = value if (value != nothing) else fallback
```

### `for`

```fidan
for item in items {
    print(item)
}
```

Ranges:

- `1..10` exclusive end
- `1...10` inclusive end

```fidan
for i in 0..10 {
    print(i)
}
```

### `while`

```fidan
while running {
    tick()
}
```

### `break` and `continue`

Canonical:

- `break`
- `continue`

Alias:

- `stop` = `break`

## Error handling

### `attempt`

```fidan
attempt {
    do_work()
} catch error {
    print(error)
} otherwise {
    print("success")
} finally {
    cleanup()
}
```

Accepted aliases:

- `try` = `attempt`
- `rescue` = `catch`

Typed catches:

```fidan
attempt {
    risky()
} catch error -> string {
    print(error)
}
```

### `panic`

Canonical:

```fidan
panic("boom")
```

Alias:

- `throw` = `panic`

## Pattern matching with `check`

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

## Concurrency syntax

### Same-thread cooperative work

```fidan
var handle = spawn fetch_data()
var result = await handle
```

### Structured concurrent block

```fidan
concurrent {
    task {
        load_user()
    }

    task audit {
        write_audit_log()
    }
}
```

### Real thread parallelism

```fidan
parallel {
    task { crunch_a() }
    task { crunch_b() }
}
```

### Parallel iteration

```fidan
parallel for item in items {
    process(item)
}
```

## Imports and exports

### Module import

```fidan
use std.math
use std.math as math
use utils.helpers
use "./local/module.fdn" as module
```

### Grouped import

```fidan
use std.math.{sqrt, floor, ceil}
```

### Re-export

```fidan
export use std.math
```

## Expressions

### Field access and calls

```fidan
user.name
math.sqrt(144)
queue.push(10)
```

### Indexing

```fidan
items[0]
dict["name"]
```

### Slices

Examples:

```fidan
items[1..5]
items[1...5]
items[..5]
items[2..]
items[..]
items[0..10 step 2]
```

### Lists, dicts, and tuples

```fidan
var list = [1, 2, 3]
var dict = {"name": "Ada", "age": 37}
var pair = ("Ada", 37)
```

### Comprehensions

```fidan
var doubled = [x * 2 for x in values]
var filtered = [x for x in values if x % 2 == 0]
var lookup = {x: x * x for x in values}
```

## Operators

### Logical operators

Canonical:

- `and`
- `or`
- `not`

Punctuation aliases:

- `&&` = `and`
- `||` = `or`
- `!` = `not`

### Comparison operators

Canonical punctuation:

- `==`
- `!=`
- `<`
- `<=`
- `>`
- `>=`

Readable aliases:

- `is`
- `equals`
- `notequals`
- `lessthan`
- `lessthanorequals`
- `greaterthan`
- `greaterthanorequals`
- `is not`

### Arithmetic operators

- `+`
- `-`
- `*`
- `/`
- `%`
- `**`

Readable aliases:

- `mod` = `%`
- `pow` = `**`

### Bitwise operators

- `^`
- `&`
- `|`
- `<<`
- `>>`

### Null-aware operator

```fidan
var actual = maybe_value ?? fallback
```

## Operator precedence

From lower to higher:

1. ternary `a if cond else b`
2. null-coalescing `??`
3. `or`
4. `and`
5. comparisons
6. `+`, `-`, `|`
7. `*`, `/`, `%`, `&`, shifts
8. power `**` and `^`
9. unary prefix `+`, `-`, `not`, `spawn`, `await`
10. postfix call, field access, indexing, slicing

## Type syntax

### Named types

```fidan
integer
float
string
boolean
dynamic
nothing
```

Accepted primitive/type aliases:

- `int` = `integer`
- `decimal` = `float`
- `bool` = `boolean`
- `text` = `string`
- `flexible` = `dynamic`
- `map` is accepted as a dictionary/hashmap-style type spelling alongside `dict`

Example:

```fidan
var id oftype int
var ratio oftype decimal
var enabled oftype bool
var label oftype text
var values oftype map oftype string
```

### Generic-like chained `oftype`

Fidan uses `oftype` chaining rather than angle brackets:

```fidan
list oftype integer
dict oftype string oftype integer
Shared oftype integer
Pending oftype string
```

### Tuple types

```fidan
tuple
(integer, string)
```

### Alias note

`dynamic` and `flexible` are equivalent at lex time. The formatter prefers `dynamic`.

## Decorators

Current built-in decorators:

- `@precompile`
- `@deprecated`
- `@extern`
- `@unsafe`

Reserved spelling:

- `@gpu`

Decorators appear immediately above actions:

```fidan
@precompile
action hot_path returns nothing {
}
```

## Canonical style recommendations

Even though Fidan accepts aliases, the docs recommend these spellings for consistency:

- `=` instead of `set`
- `dynamic` instead of `flexible`
- `else` or `otherwise`, but stay consistent within a codebase
- punctuation operators (`==`, `!=`, `>=`) in dense logic, readable aliases in prose-like code only when they clearly help
- `;` only for single-line multi-statements, not as the default style

## Syntax that is reserved or intentionally absent

- `@gpu` is reserved, not implemented
- there is no `println` or `eprintln`; use `print` and `eprint`
- typed containers use `oftype`, not `list<int>` or `list[int]`
- raw strings are `r"..."`; there is no hash-delimited raw string form today
