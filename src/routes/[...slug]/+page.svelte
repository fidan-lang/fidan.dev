<script lang="ts">
  import DocsArticle from "$lib/components/docs/DocsArticle.svelte";
  import DocsSidebar from "$lib/components/docs/DocsSidebar.svelte";
  import DocsToc from "$lib/components/docs/DocsToc.svelte";
  import DocsTopbar from "$lib/components/docs/DocsTopbar.svelte";
  import Footer from "$lib/components/marketing/Footer.svelte";
  import { docsBySection, docsSearchIndex } from "$lib/utils/docs";

  let { data } = $props();
  let query = $state("");
  const searchIndex = docsSearchIndex();
</script>

<svelte:head>
  <title>{data.doc.title} — Fidan Docs</title>
  <meta name="description" content={data.doc.description} />
</svelte:head>

<DocsTopbar currentPath={`/${data.doc.slug.join("/")}`} />

<main class="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
  <div
    class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
  >
    <div>
      <a
        href="/"
        class="group mb-3 inline-flex items-center gap-2 text-sm text-[var(--color-primary-light)]"
      >
        <svg
          aria-hidden="true"
          class="arrow-icon arrow-icon--left h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M11.75 4.75 6.5 10l5.25 5.25"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.7"
          />
        </svg>
        <span>Back to docs home</span>
      </a>
      <div
        class="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
      >
        docs.fidan.dev
      </div>
    </div>
    <div class="w-full max-w-md">
      <label
        for="docs-search"
        class="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
        >Search docs</label
      >
      <input
        id="docs-search"
        bind:value={query}
        type="search"
        placeholder="Search language, tools, stdlib..."
        class="w-full rounded-[var(--radius-lg)] border border-white/8 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]/30 focus:outline-none"
      />
      {#if query.trim()}
        <div class="panel-soft mt-3 rounded-[var(--radius-lg)] p-3">
          <div class="max-h-64 overflow-y-auto">
            {#each searchIndex
              .filter( (entry) => `${entry.title} ${entry.description} ${entry.tokens.join(" ")}`
                    .toLowerCase()
                    .includes(query.toLowerCase()), )
              .slice(0, 8) as entry}
              <a
                href={entry.href}
                class="block rounded-xl px-3 py-2 transition hover:bg-white/4"
              >
                <div class="text-sm font-medium text-white">{entry.title}</div>
                <div class="text-xs text-[var(--color-text-muted)]">
                  {entry.section}
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div
    class="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)_240px]"
  >
    <DocsSidebar
      groups={docsBySection}
      currentPath={`/${data.doc.slug.join("/")}`}
      search={query}
    />
    <DocsArticle
      page={data.doc}
      html={data.html}
      previousHref={data.previous
        ? `/${data.previous.slug.join("/")}`
        : undefined}
      previousLabel={data.previous?.title}
      nextHref={data.next ? `/${data.next.slug.join("/")}` : undefined}
      nextLabel={data.next?.title}
    />
    <DocsToc items={data.toc} />
  </div>
</main>

<Footer />
