---
title: "Publishing and .dalignore"
sidebarLabel: "Publishing"
description: "How Dal validates packages, what `.dalignore` can exclude, and how local package creation and publishing fit together."
summary: "Strict package shape, explicit publishing, and controlled exclusion."
order: 530
---

# Publishing and .dalignore

Dal package publishing is intentionally strict. The registry is not meant to accept arbitrary archive junk.

## Local packaging

Build a package archive locally first:

```bash
fidan dal package
```

Or choose an output path:

```bash
fidan dal package --output dist/my-package.tar.gz
```

## Publish

Publish the current package:

```bash
fidan dal publish
```

Typical flow:

1. validate locally
2. package locally
3. publish to the registry

## Allowlisted top-level package surface

Dal only allows a controlled top-level package layout such as:

- `src/`
- `examples/`
- `tests/`
- `docs/`
- `assets/`
- `README*`
- `LICENSE*`
- `CHANGELOG.md`
- `.dalignore`
- `dal.toml`
- `dal.lock`

This keeps published packages predictable and safer to consume.

## What `.dalignore` does

`.dalignore` does **not** add new allowed top-level folders.

Instead, it narrows the already-allowed package surface by excluding content you do not want packaged.

Examples:

- large PSDs under `assets/`
- generated fixtures under `tests/`
- benchmark artifacts under `examples/`

Example:

```text
assets/tmp/
assets/**/*.psd
tests/**/*.snap
examples/benchmarks/**
```

## Important limitation

`.dalignore` cannot make an otherwise-disallowed top-level folder publishable. It is a subtractive filter, not an escape hatch around package policy.

## Required paths still matter

Packaging refuses to let you ignore critical package files like:

- `src/init.fdn`
- required `dal.lock`
- declared README
- declared CLI entry

That is intentional. A package should not be able to hide its own required contract.
