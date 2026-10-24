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
- optional `[package].fidan` compiler SemVer requirement (audit candidate; coordinated compiler/registry release required)
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
fidan dal add 'demo[pretty]'
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
- `LICENSE*`, `NOTICE*`
- `CHANGELOG.md`
- `.dalignore`

## Recommended style

- keep the manifest minimal and explicit
- use features for real optional behavior, not to hide core package requirements
- document feature names clearly in the package README

## Compiler compatibility (relaunch candidate)

The relaunch candidate adds an optional compiler requirement independently of the package version:

```toml
[package]
name = "args"
version = "0.1.0"
# RELEASE-ONLY BLOCKER: args requires an unreleased compiler/helper pair.
fidan = "=0.0.0-args-unreleased"
```

This `args` example deliberately blocks normal installation: no published compiler
supports its required callback contract yet. Replace the sentinel only after an
owner-approved compatible compiler/helper release. Local tests use a separate,
capability-probed staging manifest; they do not certify the public 1.0.16 binary.

The registry validates and exposes this requirement; the matching candidate CLI filters versions and checks installation and imports. Legacy manifests without it remain unrestricted. SemVer prereleases require explicit opt-in; build metadata does not change version precedence. This describes the coordinated local audit candidate, not support already present in the published 1.0.16 CLI.

`[dev-dependencies]` is retained as development metadata; it is not implicitly installed into runtime graphs. Both `[optional-dependencies]` and `optional = true` entries in `[dependencies]` can be enabled by named features using `dep:name`. Git/rev dependencies are rejected: registry resolution must not silently substitute a different source. Package names use lowercase letters, digits and single hyphens, with no required `fidan-` prefix. The feature command above assumes a package named `demo` with that feature exists in the selected registry.

## Complete manifest field map

`[package]` requires `name` and `version`. Optional fields are `fidan`, `description`, `license`, `repository`, `homepage`, `docs`, `readme`, `keywords`, `categories`, `include` and `exclude`. Keywords allow at most five entries of at most 20 characters; categories allow at most five. The default README path is `README.md`.

A dependency is either a SemVer string or a table with `version`, `optional` and `features`. The parser retains `git`/`rev` fields to diagnose them, but validation rejects those unsupported sources. `[features]` maps feature names to activation lists, including `dep:name`. `[cli]` has required `entry` and optional `name`; the entry must be included in the validated package.

```toml
[package]
name = "my-tool"
version = "0.1.0"
description = "An example package"
license = "Apache-2.0"
readme = "README.md"
keywords = ["cli"]

[dependencies]
# Add only packages that exist in your selected registry.

[features]
default = []

[cli]
entry = "src/main.fdn"
name = "my-tool"
```

`dal.lock` schema 1 records each package's `name`, import `module`, resolved `version`, dependency mapping and selected `features`, plus optional archive `checksum` and compiler `fidan` constraint. Commit the generated lockfile for reproducible applications; do not hand-edit checksums. A lockfile is not a bundled archive or a publisher signature.
