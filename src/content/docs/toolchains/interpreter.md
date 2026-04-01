---
title: "Interpreter"
sidebarLabel: "Interpreter"
description: "Use the interpreter for the fastest edit-run feedback while keeping language semantics aligned with the compiled paths."
summary: "The fastest path to running real Fidan code while editing."
order: 410
---

# Interpreter

The interpreter is the fastest path to edit-run feedback.

## When to use it

- language exploration
- rapid iteration
- small utility scripts
- debugging logic before caring about final binary output

## What matters about the interpreter

It is not supposed to be a toy mode with different semantics. The goal is to
share the same language behavior, builtin handling, stdlib surface, and
diagnostics expectations as the compiled modes.
