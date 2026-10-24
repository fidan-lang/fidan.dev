---
title: "Collections, ranges and enums"
description: "Typed containers, comprehensions, indexing, slicing and finite alternatives."
summary: "Typed containers, comprehensions, indexing, slicing and finite alternatives."
order: 122
---

# Collections, ranges and enums

## Containers and parameterization

Fidan supports Lists, Tuples, Dicts and HashSets. Built-in container types can be parameterized with `oftype`; this is not a declaration syntax for arbitrary user-defined generic types. Receiver methods use the receiver's `T`, `K` and `V` contracts. Known incompatible arguments are frontend errors; flexible values may require runtime checks.

```fidan check=run
var numbers oftype list oftype integer = [1, 2, 3]
numbers.append(4)
var pair = ("Ada", 37)
var (name, age) = pair
assert_eq(name, "Ada")
assert_eq(age, 37)
var table = {"one": 1, "two": 2}
assert_eq(table["two"], 2)
var unique = hashset([1, 1, 2])
assert_eq(len(unique), 2)
var doubled = [x * 2 for x in numbers]
var even = [x for x in numbers if x % 2 == 0]
var squares = {x: x * x for x in numbers}
assert_eq(doubled, [2, 4, 6, 8])
assert_eq(even, [2, 4])
assert_eq(squares[3], 9)
```

Lists and dictionaries are mutable reference values: aliasing a value does not deep-copy it. `const` prevents reassignment of the binding, not mutation of every object reachable through it. HashSets accept only hashable values; invalid members raise a runtime error rather than disappearing. Consult [receiver methods](/docs/reference/receiver-methods) for the complete current method catalog.

`List.contains` and `List.find` use normal exact structural equality, including nested values. `find(value)` returns the matching value or `nothing`; `indexOf` returns an index or `-1`. `firstWhere` is the predicate-based search. Test-helper tolerance does not alter collection membership.

## Ranges

`start..stop` excludes `stop`; `start...stop` includes it. Bounds must be Integer; dynamic bounds are validated without converting Float/Boolean/String. Descending ranges are empty. A mathematical length greater than `i64::MAX` raises a catchable runtime error, including from native `len` and range methods.

```fidan check=run
assert_eq(len(1..4), 3)
assert_eq(len(1...4), 4)
assert_eq(len(4..1), 0)
var total = 0
for number in 1..4 { total += number }
assert_eq(total, 6)
```

A standalone range expression keeps range syntax. It is distinct from a bracket slice.

## Indexing and canonical slicing

String indices count Unicode scalar values, not UTF-8 bytes or grapheme clusters. List and String negative indices count from the end. Wrong target/index types raise a runtime type error; actual invalid indexed access raises `R2002`.

The canonical slice spelling is `value[start:stop:step]`, with an exclusive stop. Omitted bounds depend on direction; omitted step is `1`. Negative steps reverse traversal; zero step raises an error. Slices clamp bounds. The old range-style bracket spelling remains accepted for compatibility and is formatted into colon syntax; ordinary ranges are unchanged.

```fidan check=run
assert_eq("aé🙂z"[1], "é")
assert_eq("aé🙂z"[-1], "z")
assert_eq("somestring"[1:4], "ome")
assert_eq("somestring"[:4], "some")
assert_eq("somestring"[3:], "estring")
assert_eq("somestring"[::2], "smsrn")
assert_eq("somestring"[1:7:2], "oet")
assert_eq("aé🙂z"[::-1], "z🙂éa")
assert_eq([1, 2, 3][::-1], [3, 2, 1])
```

Receiver `substring`/`substr`/`slice` clamp negative bounds to zero and oversized bounds to the character length, returning an empty String when start is at or beyond end. Their end is exclusive and omitted end means the length. They do not accept a slice step. String `charAt` returns an empty String for a negative or out-of-range position, while bracket indexing reports `R2002`. `indexOf` and `lastIndexOf` report character positions, not byte offsets.

## Enums

Enums name a finite set of alternatives. Payload variants carry their constructor arguments; `check` can select variants and bind payloads. Enum equality remains normal language equality. See the [check guide](/docs/language/check) for pattern and fallback rules.

```fidan check=run
enum Color { Red, Green, Blue }
var chosen = Color.Green
assert_eq(chosen, Color.Green)
assert_ne(chosen, Color.Red)
```

### Payload matching

Payload declarations use types, such as `Err(string)`, not named action-parameter syntax. In a `check` pattern, plain identifier arguments bind payload values within that arm; they do not read a surrounding variable of the same name. Literal argument expressions construct values for equality comparison. Payload bindings retain the current boxed/flexible representation rather than inventing a scalar ABI from reflection metadata.

```fidan check=run
enum Result {
    Ok(integer)
    Err(string)
}
var result = Result.Ok(3)
var value = check result {
    Result.Ok(payload) => payload
    otherwise => 0
}
assert_eq(value, 3)
var matched = check result {
    Result.Ok(2) => false
    Result.Ok(3) => true
    otherwise => false
}
assert(matched)
```

```fidan check=run
var text = "é🙂aé🙂z"
assert_eq(text.indexOf("a"), 2)
assert_eq(text.lastIndexOf("🙂"), 4)
assert_eq(text.charAt(-1), "")
assert_eq(text.charAt(100), "")
assert_eq(text.substring(4, 1), "")
assert_eq(text.substring(-3, 2), "é🙂")
```
