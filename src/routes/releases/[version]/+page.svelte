<script lang="ts">
  import Footer from "$lib/components/marketing/Footer.svelte";
  import Nav from "$lib/components/marketing/Nav.svelte";
  import { primaryNav } from "$lib/data/site";
  import { renderMarkdown } from "$lib/utils/markdown";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.release.title}</title>
  <meta name="description" content={data.release.summary} />
</svelte:head>

<Nav links={primaryNav} />

<main class="mx-auto max-w-5xl px-4 py-18 sm:px-6 lg:px-8">
  <div class="mb-6 inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-primary-light)]">
    Release {data.release.version}
  </div>
  <h1 class="mb-4 text-5xl font-semibold tracking-[-0.05em] text-white">{data.release.title}</h1>
  <p class="mb-8 text-lg leading-8 text-[var(--color-text-muted)]">{data.release.summary}</p>

  <div class="panel mb-8 rounded-[var(--radius-lg)] p-6">
    <div class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-earth-light)]">Highlights</div>
    <ul class="space-y-3">
      {#each data.release.highlights as highlight}
        <li class="flex items-start gap-3 text-sm leading-7 text-[var(--color-text-muted)]">
          <span class="mt-2 h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
          <span>{highlight}</span>
        </li>
      {/each}
    </ul>
  </div>

  <div class="panel prose rounded-[var(--radius-lg)] p-8">
    <h2>Install and upgrade</h2>
    <ul>
      {#each data.release.installNotes as note}
        <li>{note}</li>
      {/each}
    </ul>
    {@html renderMarkdown(data.release.body)}
  </div>

  {#if data.release.githubUrl}
    <div class="mt-6">
      <a
        href={data.release.githubUrl}
        target="_blank"
        rel="noreferrer"
        class="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-primary)]/25 hover:text-[var(--color-primary-light)]"
      >
        View on GitHub
      </a>
    </div>
  {/if}
</main>

<Footer />
