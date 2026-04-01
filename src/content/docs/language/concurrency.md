---
title: "Concurrency model"
sidebarLabel: "Concurrency"
description: "Fidan separates same-thread cooperative scheduling from real threaded parallelism. This page explains `spawn`, `await`, `concurrent`, `parallel`, `parallel for`, and `Shared` clearly."
summary: "Know exactly when you are yielding, when you are threading, and when you need `Shared`."
order: 150
---

# Concurrency model

Fidan has **two distinct concurrency families**, and understanding the split is one of the most important things to get right.

## The two families

### Same-thread cooperative work

These stay on the current thread:

- `spawn`
- `await`
- `concurrent`
- `std.async.*`

### Real threaded parallel work

These use real OS threads:

- `parallel`
- `parallel for`
- `std.parallel.*`

That distinction is deliberate. Fidan does **not** pretend that all concurrency is the same thing.

## `spawn`

`spawn` creates a pending handle for same-thread cooperative work:

```fidan
var handle = spawn fetch_user()
var user = await handle
```

The result is a `Pending` handle, not a thread.

## `await`

`await` resolves a `Pending` handle:

```fidan
var handle = spawn fetch_user()
var user = await handle
```

Use it:

- on handles produced by `spawn`
- on handles returned by `std.async` helpers

## `concurrent`

`concurrent` groups multiple same-thread tasks:

```fidan
concurrent {
    task {
        var user = await spawn load_user()
        print(user)
    }

    task audit {
        write_audit_log()
    }
}
```

Important properties:

- same-thread
- cooperative
- preserves normal mutable-state semantics
- suitable when you want structure and yielding, not multicore execution

## `parallel`

`parallel` runs tasks on real worker threads:

```fidan
parallel {
    task { crunch_a() }
    task { crunch_b() }
    task { crunch_c() }
}
```

Use `parallel` for actual CPU-bound multicore work.

## `parallel for`

Parallel iteration is built in:

```fidan
parallel for item in items {
    process(item)
}
```

This is the clearest choice when:

- the loop body is independent per item
- you want real thread-backed throughput
- the work is naturally data-parallel

## `Shared`

Real threaded parallelism requires safe shared state. In Fidan, that means `Shared`.

```fidan
var counter = Shared(0)

parallel for item in [1, 2, 3, 4] {
    counter.update(action with (value oftype integer) returns integer {
        return value + 1
    })
}

print(counter.get())
```

If you try to mutate ordinary cross-thread state inside `parallel`, the compiler reports a data-race error instead of hoping you get lucky.

## `std.async`

`std.async` gives cooperative helpers like:

- `sleep`
- `ready`
- `gather`
- `waitAny`
- `timeout`

Example:

```fidan
use std.async as async

var one = async.sleep(100)
var two = async.sleep(200)
var all = async.gather([one, two])

await all
```

These are same-thread async helpers, not thread spawners.

## `std.parallel`

`std.parallel` gives thread-backed collection helpers like:

- `parallelMap`
- `parallelFilter`
- `parallelForEach`
- `parallelReduce`

Example:

```fidan
use std.parallel as parallel

var out = parallel.parallelMap(items, action with (item) returns integer {
    return item * 2
})
```

## Choosing the right model

Use `spawn` / `await` / `concurrent` / `std.async` when:

- you want structured, same-thread work
- you need cooperative scheduling
- you are orchestrating dependent tasks rather than saturating CPUs

Use `parallel` / `parallel for` / `std.parallel` when:

- the work is CPU-bound
- tasks are truly independent
- multicore speedup is the goal

## Mental model examples

### Same-thread

```fidan
concurrent {
    task {
        var a = spawn first()
        var b = spawn second()
        print(await a)
        print(await b)
    }
}
```

This is structured, cooperative scheduling.

### Real threads

```fidan
var total = Shared(0)

parallel for item in data {
    total.update(action with (value oftype integer) returns integer {
        return value + item
    })
}
```

This is real threaded execution and requires `Shared` for mutation.

## Tooling and diagnostics

The compiler enforces the model difference:

- misuse of cross-thread mutable state in `parallel` is a compile-time error
- same-thread `concurrent` blocks do not get treated like thread races
- unawaited pending handles are diagnosed so async-style code does not silently drift

## Recommended style

- reach for `concurrent` before inventing a custom same-thread task orchestration pattern
- reach for `parallel for` before hand-writing thread fan-out loops
- use `Shared` explicitly in threaded code so the synchronization boundary is obvious
- do not use `parallel` for work that is mostly coordination or latency hiding; that is what the cooperative model is for
