---
title: "dal.toml"
sidebarLabel: "dal.toml"
description: "The Dal manifest defines package identity, dependencies, optional dependencies, feature flags, and CLI entry metadata."
summary: "Everything the package manager needs to understand your package."
order: 520
---

# dal.toml

`dal.toml` is the package manifest for Dal packages.

## What it controls

Typical manifest responsibilities:

- package identity
- published version
- README reference
- dependency declarations
- optional dependencies
- feature flags
- CLI metadata for package-provided executables

## Core package fields

The package section typically identifies:

- package name
- version
- readme
- optional descriptive metadata such as homepage/repository/license depending on the wider Dal schema in use

## Dependencies

Direct dependencies live in the dependency table and are resolved into the local or global package store by `fidan dal add`.

The manifest can also describe:

- optional dependencies
- feature wiring
- `dep:`-style feature activation relationships

## Features

Dal supports feature flags and optional dependency activation. That is why package requests can look like:

```bash
fidan dal add torch[pybindings,gpu]
```

## CLI packages

Packages can declare CLI entry metadata so `fidan dal add` can build an executable entry for the installed package.

That is how a Dal package can install both:

- an importable module layout
- a CLI binary

## Relationship to `dal.lock`

`dal.toml` is the declared intent.

`dal.lock` is the resolved package graph and concrete version lock.

## Required package layout

A valid Dal package must include at least:

- `dal.toml`
- `src/init.fdn`

And packaging validation only allows a controlled top-level surface such as:

- `src/`
- `examples/`
- `tests/`
- `docs/`
- `assets/`
- `README*`
- `LICENSE*`
- `CHANGELOG.md`
- `.dalignore`

## Recommended style

- keep the manifest minimal and explicit
- use features for real optional behavior, not to hide core package requirements
- document feature names clearly in the package README
