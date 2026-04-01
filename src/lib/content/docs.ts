export type DocSection =
  | "getting-started"
  | "language"
  | "stdlib"
  | "tools"
  | "toolchains"
  | "dal"
  | "reference";

export type DocPage = {
  slug: string[];
  section: DocSection;
  order: number;
  title: string;
  sidebarLabel: string;
  description: string;
  summary: string;
  markdown: string;
};

export const docs: DocPage[] = [
  {
    slug: ["getting-started"],
    section: "getting-started",
    order: 0,
    title: "Getting Started",
    sidebarLabel: "Overview",
    description: "Install Fidan, run your first program, set up a project, and understand the build workflow without guesswork.",
    summary: "The shortest path from zero to a native Fidan build.",
    markdown: `# Getting Started

This section is for the first hour with Fidan.

## What you should do first

- install the CLI
- verify the toolchain
- run a tiny program
- learn the difference between \`run\`, \`build\`, and \`--release\`

## What comes next

Once the toolchain is on your machine, move straight into language basics and the concurrency model.`
  },
  {
    slug: ["getting-started", "install"],
    section: "getting-started",
    order: 10,
    title: "Install Fidan",
    sidebarLabel: "Install",
    description: "Install the Fidan CLI, understand release builds, and get ready for your first project.",
    summary: "Set up the CLI and verify the toolchain is healthy.",
    markdown: `# Install Fidan

Fidan ships as a native toolchain. The main entry point is the \`fidan\` CLI.

## Recommended path

Use the platform installer from \`fidan.dev\` or download the latest archive from the release page.

## Verify the install

\`\`\`bash
fidan --version
fidan doctor
\`\`\`

## Build profiles

- default builds stay portable
- \`--release\` enables the aggressive performance profile
- \`--target-cpu\` lets you override the release default when needed`
  },
  {
    slug: ["getting-started", "first-program"],
    section: "getting-started",
    order: 20,
    title: "Your first program",
    sidebarLabel: "First program",
    description: "Write, run, and build your first Fidan program.",
    summary: "A tiny but real Fidan program, from edit to run.",
    markdown: `# Your first program

Create a file named \`hello.fdn\`.

\`\`\`fidan
print("hello from Fidan")
\`\`\`

Run it:

\`\`\`bash
fidan run hello.fdn
\`\`\`

Build a native binary:

\`\`\`bash
fidan build hello.fdn -o hello
\`\`\``
  },
  {
    slug: ["getting-started", "project-setup"],
    section: "getting-started",
    order: 25,
    title: "Project setup",
    sidebarLabel: "Project setup",
    description: "Structure a small Fidan project, keep formatting consistent, and prepare for package publishing later.",
    summary: "A sensible project shape from the beginning saves cleanup later.",
    markdown: `# Project setup

Even simple Fidan projects benefit from a small amount of structure.

## Recommended basics

- keep source files under a predictable project root
- use \`.fidanfmt\` for project-wide formatting defaults
- treat examples and tests as first-class content
- add \`dal.toml\` when the project starts turning into a package`
  },
  {
    slug: ["getting-started", "build-vs-run-vs-release"],
    section: "getting-started",
    order: 30,
    title: "Build vs run vs release",
    sidebarLabel: "Build vs run",
    description: "Choose the right workflow for editing, testing, and shipping.",
    summary: "Understand interpreter, build, and release behavior.",
    markdown: `# Build vs run vs release

\`fidan run\` is for rapid iteration.

\`fidan build\` produces an executable.

\`--release\` is the performance-focused build preset:

- \`O3\`
- full LTO
- stripped output
- native CPU targeting by default

If you need portability, override the CPU target explicitly:

\`\`\`bash
fidan build app.fdn --release --target-cpu generic
\`\`\``
  },
  {
    slug: ["language"],
    section: "language",
    order: 100,
    title: "Language",
    sidebarLabel: "Overview",
    description: "Learn the core Fidan language surface: values, actions, objects, control flow, strings, concurrency, decorators, and native interop.",
    summary: "The language stays compact on purpose, but it still covers the real native-software story.",
    markdown: `# Language

Fidan's language design is about clarity under pressure.

## The core ideas

- keep the surface compact
- keep native deployment real
- keep concurrency explicit
- keep interop practical

## Where to focus first

If you already know another language, start with values and types, then jump straight to concurrency and extern interop.`
  },
  {
    slug: ["language", "variables-and-types"],
    section: "language",
    order: 110,
    title: "Variables and types",
    sidebarLabel: "Variables and types",
    description: "Learn how Fidan models values, typing, and typed containers.",
    summary: "A compact type surface with explicit readability.",
    markdown: `# Variables and types

Fidan keeps the type surface compact.

\`\`\`fidan
var count = 42
var title oftype string = "release"
var ids oftype list oftype integer = [1, 2, 3]
\`\`\`

## Typed containers

The language already supports typed containers with the \`oftype\` style:

- \`list oftype integer\`
- \`dict oftype string oftype integer\`
- \`Shared oftype integer\`
- \`Pending oftype string\``
  },
  {
    slug: ["language", "actions"],
    section: "language",
    order: 120,
    title: "Actions",
    sidebarLabel: "Actions",
    description: "Define callable behavior with action declarations and clear signatures.",
    summary: "Actions are the core callable unit in Fidan.",
    markdown: `# Actions

Actions are Fidan's callable building block.

\`\`\`fidan
action greet with (certain name oftype string) returns nothing {
    print("hello {name}")
}
\`\`\`

## Signatures

Use \`certain\` to make intent explicit in signatures. Long signatures stay readable, and the formatter preserves multiline layouts when needed.`
  },
  {
    slug: ["language", "objects-and-inheritance"],
    section: "language",
    order: 125,
    title: "Objects and inheritance",
    sidebarLabel: "Objects and inheritance",
    description: "Use objects and extends where shared behavior is clearer than repetition.",
    summary: "Object support exists to model behavior cleanly, not to drown code in ceremony.",
    markdown: `# Objects and inheritance

Fidan supports objects and inheritance when shared state and behavior belong together.

## When to use them

- stateful services
- domain models with attached behavior
- cases where shared implementation is clearer than repeating actions`
  },
  {
    slug: ["language", "control-flow"],
    section: "language",
    order: 130,
    title: "Control flow",
    sidebarLabel: "Control flow",
    description: "If, while, return, and the dead-code diagnostics that keep logic honest.",
    summary: "Control flow stays readable, and the toolchain points out unreachable code.",
    markdown: `# Control flow

Fidan's flow control is intentionally direct.

\`\`\`fidan
if retries > 3 {
    panic("too many retries")
}

while index < len(items) {
    print(items[index])
    set index = index + 1
}
\`\`\`

## Dead code warnings

The compiler warns on structurally unreachable code after \`return\`, \`panic\`, constant-false branches, and related obvious cases.`
  },
  {
    slug: ["language", "check"],
    section: "language",
    order: 135,
    title: "Check expressions",
    sidebarLabel: "Check",
    description: "Use check when you want explicit validation-style branching instead of vague control flow.",
    summary: "Check is for intent-heavy decision logic.",
    markdown: `# Check expressions

Use \`check\` when you want decision logic to read like validation or rule selection instead of a chain of loosely related conditionals.

## Why it exists

Some branching is easier to understand when each branch reads like a named check instead of a raw boolean expression.`
  },
  {
    slug: ["language", "strings-and-raw-strings"],
    section: "language",
    order: 140,
    title: "Strings and raw strings",
    sidebarLabel: "Strings",
    description: "Interpolation, escape sequences, and raw string literals.",
    summary: "Use interpolation by default and raw strings when literal text matters.",
    markdown: `# Strings and raw strings

Normal strings support interpolation and escapes.

\`\`\`fidan
print("hello {name}\\n")
\`\`\`

## Raw strings

Raw strings disable interpolation and escape handling.

\`\`\`fidan
var pattern = r"^\\w+\\{literal\\}$"
\`\`\``
  },
  {
    slug: ["language", "error-handling"],
    section: "language",
    order: 145,
    title: "Error handling",
    sidebarLabel: "Error handling",
    description: "Fail explicitly, trace meaningfully, and use replay when you need more than a surface stack trace.",
    summary: "Errors should stay understandable in the terminal and the editor.",
    markdown: `# Error handling

Fidan aims for error handling that stays visible and inspectable.

## Practical tools

- panic when execution cannot sensibly continue
- use trace modes for richer failure context
- use replay bundles when you need to re-examine a failure path`
  },
  {
    slug: ["language", "concurrency"],
    section: "language",
    order: 150,
    title: "Concurrency model",
    sidebarLabel: "Concurrency",
    description: "Understand parallel, concurrent, spawn, and await without mixing up their runtime model.",
    summary: "Real threads where you want them, cooperative structure where you do not.",
    markdown: `# Concurrency model

Fidan gives you two distinct concurrency families.

## Real threaded work

- \`parallel\`
- \`parallel for\`

## Same-thread structured work

- \`concurrent\`
- \`spawn\`
- \`await\`
- \`std.async\`

\`\`\`fidan
concurrent {
    task {
        await async.sleep(40)
        print("done")
    }
}
\`\`\``
  },
  {
    slug: ["language", "decorators"],
    section: "language",
    order: 160,
    title: "Decorators",
    sidebarLabel: "Decorators",
    description: "Use language decorators like @extern, @deprecated, and @precompile intentionally.",
    summary: "Decorators annotate intent without bloating the language core.",
    markdown: `# Decorators

Decorators are reserved language annotations.

- \`@extern\`
- \`@deprecated\`
- \`@precompile\`
- \`@unsafe\`
- reserved \`@gpu\``
  },
  {
    slug: ["language", "imports-and-modules"],
    section: "language",
    order: 165,
    title: "Imports and modules",
    sidebarLabel: "Imports and modules",
    description: "Import stdlib modules, structure your own modules, and keep names readable.",
    summary: "Imports should clarify boundaries, not hide them.",
    markdown: `# Imports and modules

Fidan supports both top-level builtins and imported module members.

\`\`\`fidan
use std.env as env
var argv = env.args()
\`\`\`

## Shared metadata

The stdlib module catalog is shared with tooling, so module hover, completions, and return-type inference stay aligned.`
  },
  {
    slug: ["language", "extern-native-interop"],
    section: "language",
    order: 170,
    title: "Extern and native interop",
    sidebarLabel: "Extern interop",
    description: "Call native code through @extern and keep performance-sensitive boundaries explicit.",
    summary: "Fidan does not lock you away from native libraries.",
    markdown: `# Extern and native interop

\`@extern\` is the bridge from Fidan into native code.

\`\`\`fidan
@extern("kernel32", "GetTickCount64")
action get_tick_count returns integer
\`\`\`

## Why it matters

The goal is practical interop, not sandbox purity.`
  },
  {
    slug: ["stdlib"],
    section: "stdlib",
    order: 200,
    title: "Standard library",
    sidebarLabel: "Overview",
    description: "Understand the current std.* surface and how it stays consistent across the runtime, LSP, and docs.",
    summary: "The stdlib is intentionally compact, but it already covers the practical essentials.",
    markdown: `# Standard library

Fidan's standard library is still young, but it is already shaped around real use instead of filler.

## The current model

- keep modules focused
- share metadata across docs and tooling
- avoid duplicate catalogs drifting apart`
  },
  {
    slug: ["stdlib", "overview"],
    section: "stdlib",
    order: 210,
    title: "Standard library overview",
    sidebarLabel: "Overview",
    description: "Get a feel for the current std.* modules and what each one is for.",
    summary: "A small but growing standard library with real metadata and editor support.",
    markdown: `# Standard library overview

Current core modules include:

- \`std.async\`
- \`std.collections\`
- \`std.env\`
- \`std.io\`
- \`std.math\`
- \`std.parallel\`
- \`std.regex\`
- \`std.string\`
- \`std.test\`
- \`std.time\`

## Shared metadata

The docs, hover, completions, and return-type inference all use shared stdlib metadata so the surface stays consistent across the toolchain.`
  },
  {
    slug: ["stdlib", "async"],
    section: "stdlib",
    order: 220,
    title: "std.async",
    sidebarLabel: "std.async",
    description: "Use async helpers for cooperative waiting and handle orchestration without blocking the scheduler.",
    summary: "The async module is for same-thread orchestration, not fake threaded work.",
    markdown: `# std.async

\`std.async\` is built on top of Fidan's pending-handle model.

## Core functions

- \`async.sleep\`
- \`async.ready\`
- \`async.gather\`
- \`async.waitAny\`
- \`async.timeout\`

## Important distinction

This is not the same as \`time.sleep\`. \`async.sleep\` participates in same-thread cooperative scheduling.`
  },
  {
    slug: ["stdlib", "collections"],
    section: "stdlib",
    order: 230,
    title: "std.collections",
    sidebarLabel: "std.collections",
    description: "Work with lists and related container helpers without rewriting the same boilerplate everywhere.",
    summary: "Collections stay practical and readable.",
    markdown: `# std.collections

\`std.collections\` contains the sequence and container helpers that show up in real code.

## Useful helpers

- \`enumerate\`
- \`chunk\`
- \`window\`
- \`partition\`
- \`groupBy\`
- \`zip\`
- \`flatten\``
  },
  {
    slug: ["stdlib", "env-and-io"],
    section: "stdlib",
    order: 240,
    title: "std.env and std.io",
    sidebarLabel: "std.env and std.io",
    description: "Read program arguments, interact with standard I/O, and understand the builtin overlap cleanly.",
    summary: "The stdlib and builtin surface stay small, but the border is documented.",
    markdown: `# std.env and std.io

\`std.env\` and \`std.io\` are the modules you touch immediately.

## Common calls

- \`env.args()\`
- \`io.print()\`
- \`io.eprint()\`
- \`io.input()\`

## Builtins vs std.io

Top-level builtins like \`print\`, \`eprint\`, and \`input\` exist for convenience.
The \`std.io\` versions make names explicit once you are already in module style.`
  },
  {
    slug: ["tools"],
    section: "tools",
    order: 300,
    title: "Tools",
    sidebarLabel: "Overview",
    description: "CLI, formatter, diagnostics, replay, LSP, and VS Code support are part of the product, not optional side quests.",
    summary: "The tooling story is a core part of why Fidan feels cohesive.",
    markdown: `# Tools

Fidan is not just a parser and a compiler binary.

## The goal

Tooling should make the language easier to trust.

## Current core tools

- CLI
- formatter
- diagnostics
- LSP and VS Code extension
- replay and tracing`
  },
  {
    slug: ["tools", "cli"],
    section: "tools",
    order: 310,
    title: "CLI",
    sidebarLabel: "CLI",
    description: "Use the Fidan CLI to run, build, trace, replay, and manage releases.",
    summary: "The CLI is the front door to every toolchain mode.",
    markdown: `# CLI

Core commands:

- \`fidan run\`
- \`fidan build\`
- \`fidan test\`
- \`fidan fmt\`
- \`fidan dal\`

## Trace and replay

\`\`\`bash
fidan run app.fdn --trace full
fidan replay trace.bundle
\`\`\``
  },
  {
    slug: ["tools", "formatter-and-fidanfmt"],
    section: "tools",
    order: 320,
    title: "Formatter and .fidanfmt",
    sidebarLabel: "Formatter",
    description: "Use the formatter defaults or refine them with .fidanfmt.",
    summary: "One formatter path shared by the CLI and the editor.",
    markdown: `# Formatter and .fidanfmt

Fidan's formatter is shared between the CLI and the LSP.

## Configuration

Use a \`.fidanfmt\` file to control formatting defaults for a project. CLI flags still win when you need a one-off override.`
  },
  {
    slug: ["tools", "diagnostics"],
    section: "tools",
    order: 325,
    title: "Diagnostics",
    sidebarLabel: "Diagnostics",
    description: "Warnings and errors are designed to be discoverable and explainable, not opaque noise.",
    summary: "Diagnostics should make you faster, not just more nervous.",
    markdown: `# Diagnostics

Diagnostics are part of the product quality story.

## Current expectations

- codes are stable
- explanations exist
- warnings stay useful in the editor and terminal`
  },
  {
    slug: ["tools", "lsp-and-vscode"],
    section: "tools",
    order: 330,
    title: "LSP and VS Code",
    sidebarLabel: "LSP and VS Code",
    description: "Hover, formatting, diagnostics, dimmed unreachable code, and shared language metadata.",
    summary: "Editor tooling is part of the core experience.",
    markdown: `# LSP and VS Code

The Fidan language server understands:

- builtins and decorators
- stdlib modules and members
- shared hover metadata
- formatter configuration
- unreachable-code dimming`
  },
  {
    slug: ["tools", "replay-and-tracing"],
    section: "tools",
    order: 340,
    title: "Replay and tracing",
    sidebarLabel: "Replay and tracing",
    description: "Capture failures with structured trace modes and replay workflows.",
    summary: "Tracing is useful, not ornamental.",
    markdown: `# Replay and tracing

Fidan supports \`none\`, \`compact\`, \`short\`, and \`full\` trace output modes.

## Full traces

The \`full\` mode keeps meaningful user-level stack frames while replay gives you a path to diagnose failures without guessing what happened live.`
  },
  {
    slug: ["tools", "testing"],
    section: "tools",
    order: 350,
    title: "Testing",
    sidebarLabel: "Testing",
    description: "Use built-in test flows, example sweeps, and backend-specific runs to keep the language honest.",
    summary: "Fidan relies on a real test bar, not a vague promise of stability.",
    markdown: `# Testing

The current workflow already leans heavily on tests:

- workspace test runs
- example sweeps
- backend-specific AOT runs
- benchmark comparisons`
  },
  {
    slug: ["toolchains"],
    section: "toolchains",
    order: 400,
    title: "Toolchains",
    sidebarLabel: "Overview",
    description: "Understand the interpreter, JIT, Cranelift AOT, LLVM AOT, and the release-build semantics that tie them together.",
    summary: "Different execution modes, one language story.",
    markdown: `# Toolchains

Fidan has more than one execution mode because different stages of work need different tradeoffs.

## The modes

- interpreter
- JIT
- Cranelift AOT
- LLVM AOT

## The rule

The language surface should stay coherent across all of them.`
  },
  {
    slug: ["toolchains", "interpreter"],
    section: "toolchains",
    order: 410,
    title: "Interpreter",
    sidebarLabel: "Interpreter",
    description: "The fastest path to edit-run feedback and language experimentation.",
    summary: "Start here when iteration speed matters more than binary output.",
    markdown: `# Interpreter

The interpreter is for fast iteration, tests, and straightforward execution while you are still shaping code.

It shares language semantics with the compiled paths, so you are not dealing with a toy mode.`
  },
  {
    slug: ["toolchains", "jit"],
    section: "toolchains",
    order: 420,
    title: "JIT",
    sidebarLabel: "JIT",
    description: "Use the JIT path when you want faster execution without a full AOT build step.",
    summary: "A good middle ground for hot-path acceleration during iteration.",
    markdown: `# JIT

The JIT uses the Cranelift path to accelerate eligible code while staying close to the edit-run loop.

Unsupported pieces can still fall back safely instead of making the whole path brittle.`
  },
  {
    slug: ["toolchains", "cranelift-aot"],
    section: "toolchains",
    order: 430,
    title: "Cranelift AOT",
    sidebarLabel: "Cranelift AOT",
    description: "Fast AOT builds with strong native execution performance.",
    summary: "The quick native pipeline when you want speed now.",
    markdown: `# Cranelift AOT

Cranelift AOT is a strong default when you want native output with fast compile times.

The goal is to keep this path performance-focused instead of needlessly dropping into boxed dynamic behavior when the MIR already exposes scalar opportunities.`
  },
  {
    slug: ["toolchains", "llvm-aot"],
    section: "toolchains",
    order: 440,
    title: "LLVM AOT",
    sidebarLabel: "LLVM AOT",
    description: "The most aggressive native backend for final binaries and release tuning.",
    summary: "Use LLVM when you want the strongest low-level optimization path.",
    markdown: `# LLVM AOT

LLVM AOT is the highest-ceiling native backend in the current toolchain.

## Target CPU

- default builds remain portable
- \`--release\` defaults to host-native tuning
- \`--target-cpu\` lets you override CPU and features directly`
  },
  {
    slug: ["toolchains", "release-builds"],
    section: "toolchains",
    order: 445,
    title: "Release builds",
    sidebarLabel: "Release builds",
    description: "Understand what --release means in Fidan and how it differs from a plain optimization level alias.",
    summary: "Release is a build policy, not just a number.",
    markdown: `# Release builds

In Fidan, \`--release\` is not just shorthand for a single optimization level.

## Current release preset

- aggressive optimization
- full LTO
- stripped output
- host-native CPU by default`
  },
  {
    slug: ["toolchains", "target-cpu-and-portability"],
    section: "toolchains",
    order: 450,
    title: "Target CPU and portability",
    sidebarLabel: "Target CPU",
    description: "Choose between portable binaries and host-tuned builds without guessing what the compiler does.",
    summary: "Portable by default, aggressive when you ask for it.",
    markdown: `# Target CPU and portability

Default builds stay portable.

\`--release\` chooses \`native\` unless you override it.

\`\`\`bash
fidan build app.fdn --target-cpu znver4,+avx2,-avx512f
\`\`\``
  },
  {
    slug: ["toolchains", "libfidan-embedding"],
    section: "toolchains",
    order: 460,
    title: "libfidan embedding",
    sidebarLabel: "libfidan embedding",
    description: "Embed or integrate the toolchain from native environments where that makes architectural sense.",
    summary: "The runtime and toolchain are meant to be practical in larger systems too.",
    markdown: `# libfidan embedding

Fidan is not only about the CLI.

## Why embedding matters

If a language wants to matter in real products, it needs a credible path into larger native systems too.`
  },
  {
    slug: ["dal"],
    section: "dal",
    order: 500,
    title: "Dal",
    sidebarLabel: "Overview",
    description: "Learn how Dal fits into the Fidan product story and how package metadata, publishing, and release flow work.",
    summary: "Dal is the package system, registry, and publishing workflow for Fidan.",
    markdown: `# Dal

Dal is the package story for Fidan.

## Why it matters

A language without a credible package workflow feels unfinished.

## What Dal covers

- package metadata
- versioning
- publishing
- package archive rules`
  },
  {
    slug: ["dal", "package-basics"],
    section: "dal",
    order: 510,
    title: "DAL package basics",
    sidebarLabel: "Package basics",
    description: "Understand dal.toml, package layout, and publishing expectations.",
    summary: "Dal is the package flow for Fidan, not a disconnected side project.",
    markdown: `# DAL package basics

Dal packages are defined by \`dal.toml\` and a clean allowlisted project shape.

Current package workflows support:

- package metadata
- release packaging
- publishing
- feature flags
- optional dependencies`
  },
  {
    slug: ["dal", "publishing-and-dalignore"],
    section: "dal",
    order: 520,
    title: "Publishing and .dalignore",
    sidebarLabel: "Publishing",
    description: "Publish packages cleanly and trim allowed package content with .dalignore.",
    summary: "A controlled package surface without losing flexibility.",
    markdown: `# Publishing and .dalignore

\`.dalignore\` lets you exclude files from the allowed package surface.

That means you can keep top-level packaging strict while still trimming large fixtures, temporary assets, or docs subsets from a publish.`
  },
  {
    slug: ["dal", "release-flow"],
    section: "dal",
    order: 530,
    title: "Release and package flow",
    sidebarLabel: "Release flow",
    description: "From local package validation to archive creation and registry publication.",
    summary: "The release path should stay obvious from local project to published package.",
    markdown: `# Release and package flow

The package flow is deliberately constrained so packages stay predictable.

## Shape of the flow

- validate project metadata
- package allowed content
- apply \`.dalignore\`
- publish the resulting archive`
  },
  {
    slug: ["reference"],
    section: "reference",
    order: 600,
    title: "Reference",
    sidebarLabel: "Overview",
    description: "Use the reference section for the stable catalog of syntax, builtins, decorators, and diagnostics behavior.",
    summary: "This section is the map when you already know roughly what you are looking for.",
    markdown: `# Reference

The reference section is for lookup, not storytelling.

## What belongs here

- syntax references
- builtin listings
- decorator listings
- diagnostics catalog material`
  },
  {
    slug: ["reference", "builtins"],
    section: "reference",
    order: 610,
    title: "Builtins",
    sidebarLabel: "Builtins",
    description: "Top-level builtins, their intent, and where stdlib begins instead.",
    summary: "The language keeps the builtin surface intentionally small.",
    markdown: `# Builtins

Top-level builtins include:

- \`print\`
- \`eprint\`
- \`input\`
- type-like builtins such as \`integer\` and \`string\`

The standard library holds the richer surface under \`std.*\`.`
  },
  {
    slug: ["reference", "syntax-reference"],
    section: "reference",
    order: 615,
    title: "Syntax reference",
    sidebarLabel: "Syntax reference",
    description: "A compact overview of the major Fidan syntax forms without turning the page into a grammar dump.",
    summary: "The shapes you reach for most often, collected in one place.",
    markdown: `# Syntax reference

Common syntax families:

- variable declarations
- action declarations
- object declarations
- control flow
- string interpolation and raw strings
- concurrency blocks
- decorators`
  },
  {
    slug: ["reference", "decorators-reference"],
    section: "reference",
    order: 617,
    title: "Decorators reference",
    sidebarLabel: "Decorators reference",
    description: "A direct reference page for language decorators and reserved annotations.",
    summary: "The quick lookup page when you already know the language feature exists.",
    markdown: `# Decorators reference

Current decorators and reserved annotations:

- \`@extern\`
- \`@deprecated\`
- \`@precompile\`
- \`@unsafe\`
- reserved \`@gpu\``
  },
  {
    slug: ["reference", "diagnostics-index"],
    section: "reference",
    order: 620,
    title: "Diagnostics index",
    sidebarLabel: "Diagnostics",
    description: "Diagnostic codes, explanations, and the expectation that every code is documented.",
    summary: "Errors and warnings are meant to be discoverable, not cryptic.",
    markdown: `# Diagnostics index

Every registered diagnostic code in the codebase has a corresponding explanation.

That matters for:

- CLI output
- hover docs
- editor discoverability
- future docs automation`
  }
];
