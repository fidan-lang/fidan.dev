# fidan.dev

The official website and documentation platform for the **Fidan** programming language.

This repository powers:

- `https://fidan.dev`
- `https://docs.fidan.dev`

It contains the marketing site, release pages, install endpoints, and the docs shell for the Fidan ecosystem.

## Stack

- SvelteKit 5
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
- `.github/workflows/ci.yaml`
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
