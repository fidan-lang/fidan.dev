---
title: "DAL package basics"
sidebarLabel: "Package basics"
description: "Use dal.toml, understand package layout, and keep packages clean before you publish them."
summary: "Package metadata and layout without cargo-cult ceremony."
order: 510
---

# DAL package basics

A Dal package starts with `dal.toml` and a predictable project shape.

## Minimal package shape

```text
my-package/
  dal.toml
  src/
    init.fdn
```

## From a new package to local verification

```bash
fidan new my-package --package
cd my-package
fidan check .
fidan test .
fidan dal package --output dist/my-package.tar.gz
```

Scaffolding creates a new directory and refuses to overwrite an existing destination. The shell quoting rules of your platform still apply to names/paths with spaces. Packaging is local and does not publish. Inspect the archive and declared README/license before an authenticated publish.

`fidan dal add` installs dependencies locally by default, `--into` selects a destination and `--global` uses the global package store; incompatible destination options are rejected. Use `fidan dal remove` for deliberate removal. Package names use lowercase letters/digits and single hyphens; imports replace hyphens with underscores. Use grouped imports such as `use args.{run}` to bring exports directly into scope, or a namespace import and qualified names.

See [the full manifest](/docs/dal/dal-toml), [registry authentication](/docs/dal/registry-and-authentication) and [args applications](/docs/dal/args-framework).
