# Contributing to fidan.dev

Thank you for contributing to **fidan.dev**. This repository contains the
marketing site and documentation platform for the Fidan programming language.

The goal here is not just to make the site look good. It is to make the first
experience with Fidan feel clear, fast, and trustworthy.

## What Belongs Here

Good contributions for this repo include:

- landing-page improvements
- documentation content and structure
- design system and layout refinements
- accessibility fixes
- SEO and metadata improvements
- Cloudflare Pages / deployment configuration
- performance and content-loading improvements
- docs search, navigation, and content tooling

Changes to the compiler, runtime, language server, formatter, or package
manager belong in the main Fidan repository instead.

## Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/fidan-lang/fidan.dev.git
cd fidan.dev
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Start local development

```bash
npm run dev
```

### 4. Run formatting and verification

```bash
npm run format:all
npm run check
npm run build
npm run e2e
```

If you only want to verify formatting without writing changes, run:

```bash
npm run format:all:check
```

Git hooks are installed automatically via `npm ci` or `npm install` and run the formatter before each commit.

Before opening a pull request, make sure the relevant checks pass.

## Project Structure

The app is a SvelteKit project deployed to Cloudflare Pages.

Important areas:

```text
src/
  lib/
    components/   reusable UI components
    content/      structured docs/release content
    data/         shared site data and marketing copy
    server/       server-side loaders and integrations
    utils/        shared content/navigation helpers

  routes/         site, docs, releases, install endpoints

static/           static assets
e2e/              browser smoke tests
```

## Contribution Guidelines

Please keep contributions:

- focused
- well-structured
- easy to review
- aligned with the current design system

When working in this repo:

- avoid introducing one-off visual patterns when a shared component is better
- prefer shared data/config over duplicated literals
- keep copy clear and intentional
- preserve the visual relationship between `fidan.dev`, `docs.fidan.dev`, and
  `dal.fidan.dev`
- make sure changes work on mobile as well as desktop
- keep the repo formatted with `npm run format:all` before committing

## Design Expectations

This site should feel modern, polished, and branded.

Please preserve:

- the green-led Fidan/Dal visual identity
- the dark-first design direction
- a clean, premium docs experience
- restrained, meaningful animation

Do not introduce:

- generic bootstrap-looking layouts
- inconsistent spacing systems
- random accent colors that fight the existing brand
- large visual rewrites unrelated to the contribution

## Pull Requests

Recommended process:

1. create a focused branch
2. make the smallest coherent change that solves the problem
3. run the relevant checks
4. open a pull request with clear context

A good pull request should explain:

- what changed
- why it changed
- whether content, design, or behavior changed
- any follow-up work still worth doing

## Content Changes

For docs and marketing copy:

- prefer concrete, useful language over vague slogans
- avoid overclaiming performance or ecosystem maturity
- keep examples aligned with the actual Fidan language/toolchain behavior
- update related sections if navigation or terminology changes

## Security

If you discover a security issue, do not post exploit details publicly.

See [SECURITY.md](SECURITY.md) for reporting guidance.

## Code of Conduct

Please keep collaboration respectful and constructive.

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
