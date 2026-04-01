<script lang="ts">
  import DocsTopbar from "$lib/components/docs/DocsTopbar.svelte";

  let { cards } = $props<{
    cards: Array<{ label: string; description: string; href: string }>;
  }>();
</script>

<DocsTopbar currentPath="/" />

<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
  <section class="animate-fade-up mb-12">
    <div class="mb-4 inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-primary-light)]">
      docs.fidan.dev
    </div>
    <h1 class="mb-5 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-white">
      The docs are built to feel like a product, not an afterthought.
    </h1>
    <p class="max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
      Learn the language, the runtime model, the toolchains, and the package flow without hunting through stale notes or scattered examples.
    </p>
  </section>

  <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {#each cards as card}
      <a href={card.href} class="panel group flex h-full flex-col rounded-[var(--radius-lg)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_20px_60px_rgba(132,204,22,0.08)]">
        <div class="mb-4 inline-flex rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          {card.label}
        </div>
        <h2 class="mb-3 text-2xl font-semibold text-white">{card.label}</h2>
        <p class="flex-1 text-sm leading-7 text-[var(--color-text-muted)]">{card.description}</p>
        <div class="mt-6 text-sm font-medium text-[var(--color-primary-light)] transition group-hover:translate-x-1">Open section →</div>
      </a>
    {/each}
  </section>

  <section class="mt-16 panel rounded-[var(--radius-xl)] p-8">
    <div class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-earth-light)]">How to use these docs</div>
    <div class="grid gap-6 lg:grid-cols-3">
      <div>
        <h2 class="mb-3 text-xl font-semibold text-white">Start with the flow</h2>
        <p class="text-sm leading-7 text-[var(--color-text-muted)]">
          Install, first program, build modes, then jump into language and toolchains. The docs are organized to take you from first run to real native builds without dead ends.
        </p>
      </div>
      <div>
        <h2 class="mb-3 text-xl font-semibold text-white">Use search locally</h2>
        <p class="text-sm leading-7 text-[var(--color-text-muted)]">
          Every docs page has a local search field. It is lightweight by design and works from the same content manifest that drives the sidebar and prev-next links.
        </p>
      </div>
      <div>
        <h2 class="mb-3 text-xl font-semibold text-white">Trust the shared metadata</h2>
        <p class="text-sm leading-7 text-[var(--color-text-muted)]">
          The docs track the same builtin, decorator, and stdlib metadata that powers the formatter and LSP, so this content is meant to stay aligned with the product instead of drifting.
        </p>
      </div>
    </div>
  </section>
</main>
