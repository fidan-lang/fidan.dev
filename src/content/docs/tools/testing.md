---
title: "Testing"
sidebarLabel: "Testing"
description: "Use inline test blocks, std.test helpers, workspace sweeps, and backend-specific runs to keep Fidan code honest."
summary: "Testing is a workflow, not just a command name."
order: 360
---

# Testing

Fidan treats testing as a normal part of the language workflow.

## Source-level tests

Inline test blocks keep simple checks close to the code they exercise:

```fidan check=test
test "basic addition" {
    assert_eq(2 + 2, 4)
}
```

Run them with:

```bash
fidan test math.fdn
```

## Directories and equality

`fidan test .` recursively discovers `.fdn` files in deterministic order without following directory symlinks. An explicit file must still have the supported filename extension. `fidan check`, `format` and `fix` also support directory input; `run` and `build` require a program entry instead of executing every file.

Core `assert_eq`/`assert_ne` use exact structural equality and preserve explicit assertion-failure behavior. `std.test.assertEq`/`assertNe` use recursive floating tolerance (about `1e-12`) inside supported lists, tuples and dictionaries. Both accept an optional custom failure message. Do not use tolerant test equality as a description of normal `==`.

Frontend checking only establishes syntax/types. `fidan test` executes inline test bodies; `fidan run` executes top-level program behavior. Native build-and-run checks must execute the resulting artifact as well. Use both backend configurations when your application depends on native behavior; a green interpreter test alone is not a parity claim.
