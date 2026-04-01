<script lang="ts">
  import Footer from "$lib/components/marketing/Footer.svelte";
  import Nav from "$lib/components/marketing/Nav.svelte";
  import { primaryNav } from "$lib/data/site";

  let { data } = $props();
</script>

<svelte:head>
  <title>Fidan Releases</title>
  <meta
    name="description"
    content="Release notes, highlights, and install guidance for Fidan."
  />
</svelte:head>

<Nav links={primaryNav} />

<main class="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
  <section class="mb-12 max-w-3xl">
    <div
      class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-light)]"
    >
      Releases
    </div>
    <h1 class="mb-5 text-5xl font-semibold tracking-[-0.05em] text-white">
      Version history with actual substance.
    </h1>
    <p class="text-lg leading-8 text-[var(--color-text-muted)]">
      Track what changed, what stabilized, and what to do when upgrading.
      Release pages mirror GitHub releases automatically and fall back locally
      when the network is unavailable.
    </p>
  </section>

  <section class="panel mb-8 rounded-[var(--radius-xl)] p-8">
    <div
      class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-earth-light)]"
    >
      Latest stable
    </div>
    <div class="mb-3 text-4xl font-semibold text-white">
      {data.latestRelease.version}
    </div>
    <p
      class="mb-5 max-w-3xl text-base leading-8 text-[var(--color-text-muted)]"
    >
      {data.latestRelease.summary}
    </p>
    <a
      href="/releases/{data.latestRelease.version}"
      class="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--color-primary-light)]"
    >
      Read {data.latestRelease.version}
    </a>
  </section>

  <section class="grid gap-5">
    {#each data.releases as release}
      <a
        href="/releases/{release.version}"
        class="panel group rounded-[var(--radius-lg)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-primary)]/30"
      >
        <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-2xl font-semibold text-white">{release.title}</h2>
          <div class="text-sm text-[var(--color-text-muted)]">
            {release.date}
          </div>
        </div>
        <p class="mb-4 text-sm leading-7 text-[var(--color-text-muted)]">
          {release.summary}
        </p>
        <div
          class="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary-light)]"
        >
          <span>Open release</span>
          <svg
            aria-hidden="true"
            class="arrow-icon h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M8.25 4.75 13.5 10l-5.25 5.25"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.7"
            />
          </svg>
        </div>
      </a>
    {/each}
  </section>
</main>

<Footer />
