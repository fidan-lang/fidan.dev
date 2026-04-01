---
title: "Your first program"
sidebarLabel: "First program"
description: "Write, run, and build your first real Fidan file."
summary: "A tiny program from file to native binary."
order: 20
---

# Your first program

Create a file named `hello.fdn`.

```fidan
print("hello from Fidan")
```

Run it:

```bash
fidan run hello.fdn
```

That uses the fast iteration path and is the right default while you are still
editing.

## Build a native binary

```bash
fidan build hello.fdn -o hello
```

That gives you a native executable instead of interpreted execution.

## Try a slightly less trivial example

```fidan
action greet with (certain name oftype string) returns nothing {
    print("hello, {name}")
}

greet("Fidan")
```

## What to notice

- `print` is a top-level builtin
- action declarations are explicit and readable
- string interpolation is built in
- the same source can be run or built without changing the program
