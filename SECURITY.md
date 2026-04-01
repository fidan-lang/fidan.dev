# Security Policy

## Scope

This repository contains the source for **fidan.dev** and **docs.fidan.dev**.

Security reports for this repo should focus on the website and documentation
delivery surface, including:

- SvelteKit route and server logic
- Cloudflare Pages deployment configuration
- release-note fetching and rendering
- redirect behavior and canonical host handling
- client-side copy/search/navigation behavior when it creates a meaningful
  security risk
- accidental exposure of secrets, tokens, or sensitive configuration

Security issues in the Fidan compiler, runtime, toolchains, package manager, or
language implementation should still be reported against the main Fidan project.

## Supported Versions

Security fixes are generally applied to the latest `main` branch state and the
currently deployed production site.

Older snapshots, preview deployments, or stale forks may not receive fixes.

## Reporting A Vulnerability

If you discover a security issue, please **do not open a public GitHub issue**.

Instead, report it privately with:

- a clear description of the issue
- the affected URL, route, or feature
- reproduction steps
- proof-of-concept details if appropriate
- impact assessment if known
- browser / OS details when relevant

If the issue is clearly website-specific, note that it affects `fidan.dev` or
`docs.fidan.dev`.

If the issue appears to affect the language toolchain itself, mention that too
so it can be triaged with the main Fidan project in mind.

## Disclosure Process

After a report is received:

1. The issue will be investigated.
2. A fix or mitigation will be prepared if needed.
3. Public disclosure may follow after the fix is available or the risk is
   otherwise addressed.

Responsible disclosure is appreciated.

## Thanks

Thank you for helping keep the Fidan web platform and ecosystem safe.
