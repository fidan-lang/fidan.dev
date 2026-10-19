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

## Relaunch candidate integrity and reproducibility

The matching compiler/registry audit candidate verifies sparse-index SHA-256 before extraction, checks package/version/compiler identity, bounds decompression, rejects links/traversal/duplicate destination paths, and commits installation through a sibling staging directory. An existing cache must match the verified archive; use `--force` to repair differences. The HTTPS registry/index remains a trusted checksum source; this is integrity checking, not publisher signing.

`dal.lock` schema1 gains optional `checksum` and `fidan` fields without breaking legacy locks. New resolutions exclude yanked versions. An existing checksum-bearing lock may retain its exact yanked version and checksum, and immutable downloads remain available. Legacy locks do not grant a checksum-free yank exception. Yank and unyank preserve artifacts. Version/constraint changes re-resolve when the previous graph no longer satisfies them; ordinary add preserves still-compatible locked choices.

`[package].include` and `.exclude` narrow the allowed surface. Git metadata, build caches and `.env` files are excluded automatically. Required init/manifest/lock/declared readme/CLI paths still apply. Review the local archive before publishing. Do not put tokens in command arguments or archives; prefer `FIDAN_DAL_API_TOKEN` in CI.

## Local args candidate

`args@0.1.0` is prepared locally and is not published. Its owner-approved API uses `@command` and `run(callback)`: parameter names, types and defaults come from compiler metadata, and parse failures throw `ArgumentError` objects. Flags, typed value options, positionals and `--` pass-through are tested locally. It requires the audit compiler candidate and LLVM helper protocol 7; published Fidan 1.0.16 does not yet expose that metadata/invocation API. Public `fidan dal add args` examples become valid only after the owner approves its registry publication and coordinated compiler/helper release. Test it first against the disposable local Dal gate; no production publish is part of this audit.
