---
title: "GitHub Actions and CI"
description: "Pin installer and compiler identities, validate package integrity and separate stable from candidate CI."
summary: "Reproducible CI without accidental latest-version substitution."
order: 365
---

# GitHub Actions and CI

## Released compiler jobs

The Setup Action installs a release archive selected from the configured release manifest. Pin the action itself to a reviewed full commit and select an exact compiler version for reproducible jobs. `latest` is accepted by the action for intentionally moving stable jobs; it is unsuitable for validating candidate-only documentation.

```yaml
steps:
  - uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803
  # Requires the audited action commit to be available remotely.
  - uses: fidan-lang/fidan-actions/setup@d0599e1e8df6f6a2d96d89b57e17afa91848dd52
    with:
      version: "1.0.16"
      cache: "true"
  - run: fidan check .
  - run: fidan test .
```

This installs the **released** compiler; do not use this job to certify new callable/decorator APIs.

## Action inputs and outputs

Inputs: `version` (default `latest`), `manifest-url` (official release manifest by default), `install-dir` (runner-temporary by default), and `cache` (default `true`). A custom manifest URL changes the trusted manifest authority: use only a controlled registry endpoint. No authentication token is required for ordinary public release downloads.

Outputs are `fidan-bin`, `install-dir`, `version-resolved`, `host-triple`, and `cache-hit`. Use `fidan-bin` explicitly when multiple compiler installations could be on PATH. The action supports Windows x86_64, Linux x86_64 and macOS ARM64 release targets; a runner of another architecture needs a corresponding supported artifact.

The audited implementation verifies the archive SHA-256, bounds extraction/download work, rejects unsafe paths/links and stages installation before replacement. Cached installs are verified before finalization. Bounded retries do not turn checksum failures into successes. Concurrent installs and rollback are tested in the installer regression suite. HTTPS manifest trust remains important: a checksum from an attacker-controlled manifest is not an independent publisher signature.

## Upcoming compiler and package checks

This website's `ci/compiler-candidate.json` selects exact compiler, Setup Action and args commits. Its documentation job verifies checkout identities, builds the selected compiler with the lockfile, checks actual reflection/decorator behavior, reads API metadata from that compiler source, and executes website examples with the pinned args source. It never falls back to a public old compiler when a source checkout is unavailable.

For a local reproduction, set `FIDAN_BIN` to the exact isolated compiler and `FIDAN_ARGS_ROOT` to the reviewed args checkout, then run `npm run docs:check:fidan`. Use the same source identities in native/compiler/editor integration gates. See [candidate compatibility](/docs/getting-started/release-candidate).

## Workflow trust boundaries

Pull-request validation has read-only repository permissions and must not receive signing/publishing credentials. Pass externally supplied workflow data through scoped environment variables, then validate it; never interpolate it directly into executable shell text. Release workflows validate versions, tags, artifact identifiers and paths before signing or publishing. Production publication remains a separate authorized workflow, not a side effect of documentation checks.
