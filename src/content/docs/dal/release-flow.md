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
