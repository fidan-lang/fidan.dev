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
