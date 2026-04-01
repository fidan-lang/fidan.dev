---
title: "Cranelift AOT"
sidebarLabel: "Cranelift AOT"
description: "Build native binaries quickly with the Cranelift backend and use it when compile-time speed matters alongside native output."
summary: "The quick native backend for development and practical shipping."
order: 430
---

# Cranelift AOT

Cranelift AOT is the fast native pipeline.

## Why you would choose it

- you want native output
- you care about compile-time speed
- you still want strong runtime performance

## Build example

```bash
fidan build app.fdn --backend cranelift -o app
```
