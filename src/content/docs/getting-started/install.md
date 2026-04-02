---
title: "Install Fidan"
sidebarLabel: "Install"
description: "Install the Fidan CLI, verify the toolchain, and understand the difference between portable and host-tuned builds."
summary: "Install the CLI and make sure the toolchain is healthy."
order: 10
---

# Install Fidan

Fidan ships as a native CLI toolchain.

:::tip Recommended path
Use the bootstrap install path first. It keeps the install story consistent with official releases and the update commands.
:::

## Bootstrap install

:::tabs
@tab PowerShell

```powershell
iwr https://fidan.dev/install.ps1 -UseBasicParsing | iex
```

@tab Shell

```bash
curl -fsSL https://fidan.dev/install.sh | sh
```

:::

The install endpoints redirect to the canonical bootstrap scripts in the main
Fidan repository.

## Manual install path

If you want explicit artifact control, download the latest release archive:

```url
https://github.com/fidan-lang/fidan/releases/latest
```

Extract the archive and add the `fidan` binary to your `PATH`.

:::note Release archives
Stable release archives also ship the `libfidan` embedding bundle, including the shared library, static library, C header, and a small embedding example.
:::

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

:::tabs
@tab Portable release build

```bash
fidan build app.fdn --release --target-cpu generic
```

@tab Host-tuned release build

```bash
fidan build app.fdn --release
```

:::

:::warning Portability reminder
`--release` defaults to `native` CPU tuning. If the produced binary must run on other machines, override it explicitly with `--target-cpu generic` or another compatible CPU target.
:::
