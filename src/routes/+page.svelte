<script lang="ts">
  import CodeWindow from "$lib/components/CodeWindow.svelte";
  import Footer from "$lib/components/marketing/Footer.svelte";
  import Nav from "$lib/components/marketing/Nav.svelte";
  import {
    compareRows,
    featureCards,
    heroSnippet,
    installCommands,
    marketingSections,
    primaryNav,
    proofStats,
    switchCards,
  } from "$lib/data/site";
  import { docsHomeCards } from "$lib/utils/docs";
  import DocsHome from "./docs-home.svelte";

  let { data } = $props();

  const docsCards = docsHomeCards();
</script>

<svelte:head>
  <title
    >{data.host === "docs"
      ? "Fidan Docs"
      : "Fidan — The AI-Native Language for Native Software"}</title
  >
  <meta
    name="description"
    content={data.host === "docs"
      ? "The Fidan documentation: language, stdlib, toolchains, DAL, and practical guides."
      : "Fidan is the AI-native language for native software, with interpreter, JIT, Cranelift AOT, LLVM AOT, real concurrency, direct native interop, and built-in AI-assisted explain, fix, and improve workflows."}
  />
</svelte:head>

{#if data.host === "docs"}
  <DocsHome cards={docsCards} />
{:else}
  <Nav links={primaryNav} />

  <main>
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.14),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(186,143,97,0.14),transparent_20%)]"
      ></div>
      <div
        class="mx-auto grid max-w-7xl gap-14 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20"
      >
        <div class="animate-fade-up">
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-4 py-2 text-sm text-[var(--color-primary-light)]"
          >
            <span
              class="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-glow-float"
            ></span>
            AI-native language, native output
          </div>
          <h1
            class="mb-6 max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl"
          >
            Build native software in <span class="gradient-text"
              >a language designed for AI-native work.</span
            >
          </h1>
          <p
            class="mb-10 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]"
          >
            Fidan is for people who are tired of choosing between Python-level
            ergonomics, Rust-level ceremony, and C++-level legacy drag. You get
            interpreter, JIT, Cranelift AOT, and LLVM AOT in one coherent
            toolchain, with real concurrency, direct native interop, tracing,
            replay, and AI-assisted explain, fix, and improve workflows that
            belong to the product instead of sitting beside it.
          </p>
          <div class="mb-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="#install"
              class="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[var(--color-primary-light)]"
            >
              Install Fidan
            </a>
            <a
              href="https://docs.fidan.dev/"
              class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/3 px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-primary)]/30 hover:bg-white/6"
            >
              Read the docs
            </a>
            <a
              href="https://github.com/fidan-lang/fidan"
              class="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-white/20 hover:text-white"
            >
              GitHub
            </a>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            {#each proofStats as stat}
              <div class="panel-soft rounded-[var(--radius-lg)] p-4">
                <div class="mb-1 text-2xl font-semibold text-white">
                  {stat.value}
                </div>
                <div
                  class="mb-1 text-sm font-medium text-[var(--color-primary-light)]"
                >
                  {stat.label}
                </div>
                <div class="text-xs leading-6 text-[var(--color-text-muted)]">
                  {stat.note}
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div class="animate-fade-up [animation-delay:120ms]">
          <CodeWindow title="concurrency_showcase.fdn" code={heroSnippet} />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 max-w-3xl">
        <div
          class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-earth-light)]"
        >
          Why people switch
        </div>
        <h2 class="mb-4 text-4xl font-semibold tracking-[-0.04em] text-white">
          Fidan is built for shipping, not for ceremony.
        </h2>
        <p class="text-lg leading-8 text-[var(--color-text-muted)]">
          It is built to be the language you actually want to ship native
          software with in 2026: compact, direct, fast, and designed like a
          product instead of a puzzle.
        </p>
      </div>
      <div class="grid gap-5 lg:grid-cols-3">
        {#each switchCards as card}
          <div
            class="panel rounded-[var(--radius-lg)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-earth-light)]/25 hover:shadow-[0_20px_60px_rgba(186,143,97,0.08)]"
          >
            <div
              class="mb-4 inline-flex rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-earth-light)]"
            >
              {card.eyebrow}
            </div>
            <h3 class="mb-3 text-xl font-semibold text-white">{card.title}</h3>
            <p class="text-sm leading-7 text-[var(--color-text-muted)]">
              {card.description}
            </p>
          </div>
        {/each}
      </div>
    </section>

    <section
      id="why-fidan"
      class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <div class="mb-10 max-w-3xl">
        <div
          class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-light)]"
        >
          Why Fidan
        </div>
        <h2 class="mb-4 text-4xl font-semibold tracking-[-0.04em] text-white">
          {marketingSections.whyHeading}
        </h2>
        <p class="text-lg leading-8 text-[var(--color-text-muted)]">
          {marketingSections.whyIntro}
        </p>
      </div>
      <div class="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {#each featureCards as card}
          <div
            class="panel rounded-[var(--radius-lg)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_20px_60px_rgba(132,204,22,0.08)]"
          >
            <div
              class="mb-4 inline-flex rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-earth-light)]"
            >
              {card.eyebrow}
            </div>
            <h3 class="mb-3 text-xl font-semibold text-white">{card.title}</h3>
            <p class="text-sm leading-7 text-[var(--color-text-muted)]">
              {card.description}
            </p>
          </div>
        {/each}
      </div>
    </section>

    <section class="border-y border-white/6 bg-[rgba(12,18,13,0.65)]">
      <div
        class="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8"
      >
        <div>
          <div
            class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-earth-light)]"
          >
            Reality check
          </div>
          <h2 class="mb-4 text-4xl font-semibold tracking-[-0.04em] text-white">
            Built-in tooling, not bolted-on AI.
          </h2>
          <p class="mb-6 text-base leading-8 text-[var(--color-text-muted)]">
            {marketingSections.reliability}
          </p>
          <p class="text-base leading-8 text-[var(--color-text-muted)]">
            {marketingSections.ecosystem}
          </p>
        </div>
        <div class="panel rounded-[var(--radius-xl)] p-6">
          <div
            class="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
          >
            What makes Fidan different
          </div>
          <div class="space-y-5">
            {#each compareRows as row}
              <div
                class="rounded-[var(--radius-lg)] border border-white/8 bg-white/2 p-5"
              >
                <div class="mb-2 text-lg font-semibold text-white">
                  Compared with {row.name}
                </div>
                <div class="mb-2 text-sm text-[var(--color-primary-light)]">
                  {row.edge}
                </div>
                <div class="text-sm leading-7 text-[var(--color-text-muted)]">
                  {row.nuance}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <section id="install" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="mb-10 max-w-2xl">
        <div
          class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-light)]"
        >
          Install
        </div>
        <h2 class="mb-4 text-4xl font-semibold tracking-[-0.04em] text-white">
          Get from zero to native output quickly.
        </h2>
        <p class="text-base leading-8 text-[var(--color-text-muted)]">
          Use the installer for the smooth path, or pull the release archive
          directly if you want explicit artifact control.
        </p>
      </div>
      <div class="grid gap-5 lg:grid-cols-3">
        {#each installCommands as install}
          <div class="panel rounded-[var(--radius-lg)] p-6">
            <div
              class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-earth-light)]"
            >
              {install.label}
            </div>
            <CodeWindow
              title={install.label}
              code={install.command}
              language={install.language}
              compact={true}
            />
          </div>
        {/each}
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div
        class="panel grid gap-8 rounded-[var(--radius-xl)] p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10"
      >
        <div>
          <div
            class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-light)]"
          >
            Releases
          </div>
          <h2 class="mb-4 text-3xl font-semibold tracking-[-0.04em] text-white">
            {data.latestRelease.title}
          </h2>
          <p
            class="mb-6 max-w-2xl text-base leading-8 text-[var(--color-text-muted)]"
          >
            {data.latestRelease.summary}
          </p>
          <ul class="space-y-3">
            {#each data.latestRelease.highlights as highlight}
              <li
                class="flex items-start gap-3 text-sm leading-7 text-[var(--color-text-muted)]"
              >
                <span
                  class="mt-2 h-2 w-2 rounded-full bg-[var(--color-primary)]"
                ></span>
                <span>{highlight}</span>
              </li>
            {/each}
          </ul>
        </div>
        <div
          class="rounded-[var(--radius-lg)] border border-white/8 bg-[rgba(255,255,255,0.02)] p-6"
        >
          <div
            class="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
          >
            Latest stable
          </div>
          <div class="mb-2 text-4xl font-semibold text-white">
            {data.latestRelease.version}
          </div>
          <div class="mb-6 text-sm text-[var(--color-earth-light)]">
            {data.latestRelease.date}
          </div>
          <a
            href="/releases/{data.latestRelease.version}"
            class="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--color-primary-light)]"
          >
            Read release notes
          </a>
        </div>
      </div>
    </section>
  </main>

  <Footer />
{/if}
