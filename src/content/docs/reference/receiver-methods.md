---
title: "Receiver methods"
sidebarLabel: "Receiver methods"
description: "Complete compiler-owned method and field signatures, aliases and container contracts."
summary: "One canonical receiver catalog, shared with type checking and completion."
order: 625
---

# Receiver methods

These signatures are generated from `fidan-config`. T is the element/Shared
value type; K and V are Dict key/value types. The checker substitutes concrete
receiver arguments and validates parameter types and arity. Dynamic inputs still
require runtime checks. A field has no parentheses; a method does. The property column also lists members that support both forms; property access accepts the same member aliases.

Mutating List methods (`append`, `extend`, `sort`, `reverse`, `remove`, `pop`) act on
the existing container. `reversed`, `slice`, `map` and `filter` create a new outer
list. `contains`/`find` use ordinary recursive exact value equality, not std.test's
floating tolerance. `find` returns a matching value or nothing; `indexOf` returns
an index or -1; `firstWhere` takes a predicate. Hashset/Dict keys must be hashable.
`dict.keys()` preserves key values at runtime; don't assume all keys are strings.
The generic placeholder signatures are metadata hints, not runtime coercions.

The action members are explained in [Callable reflection](/docs/language/callable-reflection).
See [Concurrency](/docs/language/concurrency) for Shared locking, typed callbacks
and the distinction between synchronized get/set and atomic update.

<!-- compiler-api:start -->

## integer

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `integer.abs() -> integer` | — | — |
| `integer.sqrt() -> float` | — | — |
| `integer.toFloat() -> float` | `to_float` | — |
| `integer.toString() -> string` | `to_string` | — |

## float

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `float.abs() -> float` | — | — |
| `float.sqrt() -> float` | — | — |
| `float.floor() -> integer` | — | — |
| `float.ceil() -> integer` | — | — |
| `float.round() -> integer` | — | — |
| `float.toInt() -> integer` | `to_int` | — |
| `float.toString() -> string` | `to_string` | — |

## string

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `string.len() -> integer` | `length` | `string.len` |
| `string.byteLen() -> integer` | `byte_len` | `string.byteLen` |
| `string.lower() -> string` | `toLower`, `to_lower` | — |
| `string.upper() -> string` | `toUpper`, `to_upper` | — |
| `string.capitalize() -> string` | — | — |
| `string.trim() -> string` | — | — |
| `string.trimStart() -> string` | `ltrim`, `trim_start` | — |
| `string.trimEnd() -> string` | `rtrim`, `trim_end` | — |
| `string.split(separator oftype string) -> list oftype string` | — | — |
| `string.lines() -> list oftype string` | — | — |
| `string.chars() -> list oftype string` | — | — |
| `string.join(values oftype list oftype dynamic) -> string` | — | — |
| `string.contains(text oftype string) -> boolean` | — | — |
| `string.startsWith(prefix oftype string) -> boolean` | `starts_with` | — |
| `string.endsWith(suffix oftype string) -> boolean` | `ends_with` | — |
| `string.indexOf(value oftype string) -> integer` | `index_of`, `find` | — |
| `string.lastIndexOf(value oftype string) -> integer` | `last_index_of` | — |
| `string.replace(from oftype string, to oftype string) -> string` | — | — |
| `string.replaceAll(from oftype string, to oftype string) -> string` | `replace_all` | — |
| `string.replaceFirst(from oftype string, to oftype string) -> string` | `replace_first` | — |
| `string.repeat(count oftype integer) -> string` | — | — |
| `string.reverse() -> string` | `reversed` | — |
| `string.charAt(index oftype integer) -> string` | `char_at` | — |
| `string.substring(start oftype integer, end oftype integer?) -> string` | `substr`, `slice` | — |
| `string.toInt() -> integer` | `to_int`, `parseInt`, `parse_int` | — |
| `string.toFloat() -> float` | `to_float`, `parseFloat`, `parse_float` | — |
| `string.toBool() -> boolean` | `to_bool` | — |
| `string.toString() -> string` | `to_string` | — |
| `string.padStart(width oftype integer, pad oftype string?) -> string` | `pad_start` | — |
| `string.padEnd(width oftype integer, pad oftype string?) -> string` | `pad_end` | — |
| `string.bytes() -> list oftype integer` | — | — |
| `string.charCode() -> integer` | `char_code` | — |
| `string.format(values oftype dynamic...) -> string` | — | — |
| `string.isEmpty() -> boolean` | `is_empty` | — |

## list

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `list.len() -> integer` | `length`, `size` | `list.len` |
| `list.isEmpty() -> boolean` | `is_empty` | — |
| `list.append(values oftype T...) -> nothing` | `push`, `add` | — |
| `list.pop() -> T` | — | — |
| `list.first() -> T` | `head` | — |
| `list.last() -> T` | — | — |
| `list.get(index oftype integer) -> T` | — | — |
| `list.contains(value oftype T) -> boolean` | — | — |
| `list.indexOf(value oftype T) -> integer` | `index_of` | — |
| `list.reverse() -> nothing` | — | — |
| `list.reversed() -> list oftype T` | — | — |
| `list.sort() -> nothing` | — | — |
| `list.join(separator oftype string?) -> string` | — | — |
| `list.slice(start oftype integer?, end oftype integer?, step oftype integer?) -> list oftype T` | — | — |
| `list.flatten() -> list oftype dynamic` | — | — |
| `list.extend(items oftype list oftype T) -> nothing` | `concat` | — |
| `list.toString() -> string` | `to_string` | — |
| `list.forEach(callback oftype action) -> nothing` | `for_each`, `each` | — |
| `list.map(callback oftype action) -> list oftype dynamic` | `transform`, `collect` | — |
| `list.filter(predicate oftype action) -> list oftype T` | `where_`, `select` | — |
| `list.find(value oftype T) -> dynamic` | — | — |
| `list.firstWhere(predicate oftype action) -> T` | `first_where` | — |
| `list.remove(index oftype integer) -> T` | — | — |
| `list.reduce(callback oftype action, initial oftype dynamic?) -> dynamic` | `fold` | — |

## dict

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `dict.len() -> integer` | `length`, `size` | `dict.len` |
| `dict.isEmpty() -> boolean` | `is_empty` | — |
| `dict.get(key oftype K) -> V` | — | — |
| `dict.set(key oftype K, value oftype V) -> nothing` | `put`, `insert` | — |
| `dict.containsKey(key oftype K) -> boolean` | `has`, `has_key`, `containsKey`, `contains_key` | — |
| `dict.remove(key oftype K) -> nothing` | `delete` | — |
| `dict.keys() -> list oftype K` | — | — |
| `dict.values() -> list oftype V` | — | — |
| `dict.entries() -> list oftype (dynamic, dynamic)` | `items` | — |
| `dict.toString() -> string` | `to_string` | — |

## hashset

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `hashset.len() -> integer` | `length`, `size` | `hashset.len` |
| `hashset.isEmpty() -> boolean` | `is_empty` | — |
| `hashset.insert(value oftype T) -> nothing` | `add` | — |
| `hashset.remove(value oftype T) -> nothing` | `delete` | — |
| `hashset.contains(value oftype T) -> boolean` | `has` | — |
| `hashset.toList() -> list oftype T` | `to_list` | — |
| `hashset.union(other oftype hashset oftype T) -> hashset oftype T` | — | — |
| `hashset.intersect(other oftype hashset oftype T) -> hashset oftype T` | `intersection` | — |
| `hashset.diff(other oftype hashset oftype T) -> hashset oftype T` | `difference` | — |
| `hashset.toString() -> string` | `to_string` | — |

## Shared

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `Shared.type -> string` | — | `Shared.type` |
| `Shared.get() -> T` | — | — |
| `Shared.set(value oftype T) -> nothing` | — | — |
| `Shared.update(callback oftype action) -> T` | — | — |
| `Shared.weak() -> WeakShared oftype T` | `downgrade` | — |

## WeakShared

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `WeakShared.type -> string` | — | `WeakShared.type` |
| `WeakShared.upgrade() -> Shared oftype T` | — | — |
| `WeakShared.isAlive() -> boolean` | `is_alive`, `alive` | — |

## action

<!-- prettier-ignore -->
| Member | Aliases | Property form |
| --- | --- | --- |
| `action.name -> string` | — | `action.name` |
| `action.parameters -> list oftype dynamic` | — | `action.parameters` |
| `action.invoke(arguments oftype list oftype dynamic) -> dynamic` | — | — |

<!-- compiler-api:end -->

## Field forms

```fidan check=run
var text = "é"
assert_eq(text.len, 1)
assert_eq(text.byteLen, 2)
var values = [1, 2]
assert_eq(values.len, 2)
```
