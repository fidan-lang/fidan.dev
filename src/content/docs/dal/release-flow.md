---
title: "Release and package flow"
sidebarLabel: "Release flow"
description: "Go from validated local package to canonical archive to published package version with a predictable workflow."
summary: "A package release path that stays explicit from start to finish."
order: 540
---

# Release and package flow

The Dal release path is meant to be explicit and boring.

## Typical shape

1. validate local metadata and layout
2. build the canonical archive
3. apply `.dalignore` exclusions
4. publish to the registry

## Before publishing

Run formatting, frontend checks, source tests and representative native executions with the declared compatible compiler. Confirm the package name/version, selected feature graph, archive checksum, mandatory entry files and README/license. `fidan dal package` is the local inspection step; `fidan dal publish` is the explicit authenticated remote mutation.

Do not replace an existing version to fix code: publish a new SemVer version after review. Use yank/unyank to control new dependency selection while preserving already locked immutable downloads. Removal and ownership transfer are distinct privileged operations.

## Coordinated candidate releases

The upcoming compiler, protocol-8 LLVM helper and args package must be tested together before publication. A source package can pass local/CI tests before its final public version constraint is selected; that is different from claiming compatibility with a previously published binary. Public installer `latest` must not substitute for the pinned compiler in candidate CI.

Recommended order: make the reviewed Setup Action and compiler source SHAs available, run dependent package/editor/website PR CI against those exact sources, obtain independent review and OS-runner results, then approve releases separately. A successful docs build does not authorize package publication or production deployment.
