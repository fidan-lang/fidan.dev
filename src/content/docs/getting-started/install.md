---
title: "Install Fidan"
sidebarLabel: "Install"
description: "Install the Fidan CLI, verify the toolchain, and understand the difference between portable and host-tuned builds."
summary: "Install the CLI and make sure the toolchain is healthy."
order: 10
---

# Install Fidan

Fidan ships as a native CLI toolchain.

## Recommended install path

Use the platform bootstrap command from `fidan.dev`:

```powershell
iwr https://fidan.dev/install.ps1 -UseBasicParsing | iex
```

```bash
curl -fsSL https://fidan.dev/install.sh | sh
```

The install endpoints redirect to the canonical bootstrap scripts in the main
Fidan repository.

## Manual install path

If you want explicit artifact control, download the latest release archive:

```text
https://github.com/fidan-lang/fidan/releases/latest
```

Extract the archive and add the `fidan` binary to your `PATH`.

## Verify the toolchain

```bash
fidan --version
```

If the CLI resolves and prints a version, your install is working.

## Portable vs host-tuned builds

- default builds stay portable
- `--release` enables the aggressive performance build policy
- `--target-cpu` lets you override the default when you need portability or a
  specific CPU/features target

Example portable release build:

```bash
fidan build app.fdn --release --target-cpu generic
```

Example host-tuned build:

```bash
fidan build app.fdn --release
```
