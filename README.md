# fidan.dev

The official website and documentation platform for the **Fidan** programming language.

This repository powers:

- `https://fidan.dev`
- `https://docs.fidan.dev`

It contains the marketing site, release pages, install endpoints, and the docs shell for the Fidan ecosystem.

## Stack

- SvelteKit 2 with Svelte 5
- Tailwind 4
- Cloudflare Pages
- Playwright smoke tests

## Local Development

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

## Formatting

Format the repo:

```bash
npm run format:all
```

Check formatting without writing changes:

```bash
npm run format:all:check
```

Git hooks are installed automatically via `npm ci` or `npm install` and run the formatter before each commit.

## Verification

Typecheck:

```bash
npm run check
```

Production build:

```bash
npm run build
```

Browser smoke tests:

```bash
npm run e2e
```

## Deployment

This site is configured for **Cloudflare Pages**.

Relevant files:

- `wrangler.toml`
- `.github/workflows/verification_tests.yaml`
- `.github/workflows/_web-checks.yaml`
- `.github/workflows/deploy-pages.yaml`

The deploy workflow expects:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Repo Scope

This repo is for the **website and docs platform** only.

Compiler, runtime, toolchain, formatter, LSP, and package-manager changes belong in the main Fidan repository:

- `https://github.com/fidan-lang/fidan`

## Related Projects

- Fidan language: `https://github.com/fidan-lang/fidan`
- Dal package registry: `https://dal.fidan.dev`

## License and branding

The software is available under the unmodified [Apache License 2.0](LICENSE),
with attribution in [NOTICE](NOTICE). Commercial use, modification, redistribution,
sale and hosting are permitted under that license. Branding is separate: see the
[Fidan trademark policy](https://github.com/fidan-lang/fidan/blob/main/TRADEMARKS.md).
Truthful descriptive references and independent forks are welcome; do not falsely
claim official affiliation or endorsement.

## Implementation-verified documentation

The public stable installer currently supplies Fidan 1.0.16. Candidate-only pages
are explicitly identified; their CI never substitutes `latest` for the selected
source. `ci/compiler-candidate.json` pins compiler, installer and args commits.
Those commits must be available remotely before dependent PR CI can check them out.

```bash
# Use actual reviewed local checkouts, not PATH fallback.
# Set FIDAN_BIN and FIDAN_ARGS_ROOT first.
npm run docs:check:fidan
npm run docs:check:links
npm run docs:test
```

Every Fidan fence declares its mode: `compile` is a real frontend check, `run`
executes the program, `test` executes inline test bodies, `error` requires the
specified frontend diagnostic and `runtime-error` requires the specified failing
runtime result. Contextual fragments name explicit fixtures in
`ci/doc-examples.json`; args fixtures are read from the actual selected package
source. `expect=stdout`/`stderr` compares the adjacent text block byte-for-byte
apart from platform line endings. Complete examples must not be downgraded to
format-only checks to hide an error. There are no skipped Fidan fences in the
reconciled catalog.

Compiler API tables are generated with `cargo run --locked -p fidan-stdlib
--example documentation_catalog` in the matching compiler checkout, then checked
using `node scripts/sync-api-reference.mjs <catalog.json>`. The CLI reference is
checked using `node scripts/sync-cli-reference.mjs <actual-fidan-binary>`. Both
accept explicit `--write` for reviewed synchronization; CI only checks drift.
Local link checks use the actual Markdown renderer and reject missing docs routes,
anchors and static assets. They do not certify the availability of external sites.
See `DOCUMENTATION_RECONCILIATION.md` for the page-by-page evidence and remaining
external gates.

Configuration and command recipes also have an executable syntax gate:
`python scripts/check-doc-configs.py` (Python 3.11+, PyYAML 6.0.3 and Bash;
set `BASH_BIN` for Git Bash on Windows). It parses TOML/YAML and runs Bash `-n`;
it never executes installer/publish commands or claims remote-service success.
