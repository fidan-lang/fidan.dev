<script lang="ts">
  import BrandMark from "$lib/components/BrandMark.svelte";
  import type { NavLink } from "$lib/data/site";

  let { links } = $props<{ links: NavLink[] }>();
  let mobileOpen = $state(false);
</script>

<nav class="sticky top-0 z-40 border-b border-white/6 bg-[rgba(8,13,9,0.72)] backdrop-blur-xl">
  <div class="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
    <a href="/" class="group flex items-center gap-3">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 shadow-[0_0_32px_rgba(132,204,22,0.08)]">
        <BrandMark size={34} alt="Fidan" />
      </div>
      <div class="leading-tight">
        <div class="text-sm uppercase tracking-[0.22em] text-[var(--color-text-muted)]">fidan</div>
        <div class="text-base font-semibold text-white transition group-hover:text-[var(--color-primary-light)]">
          Native, refreshed
        </div>
      </div>
    </a>

    <div class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
      {#each links as link}
        <a
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          class="text-sm text-[var(--color-text-muted)] transition hover:text-white"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <a
      href="https://docs.fidan.dev/getting-started/install"
      class="hidden rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-black transition hover:bg-[var(--color-primary-light)] md:inline-flex"
    >
      Install
    </a>

    <button
      type="button"
      class="rounded-xl border border-white/8 p-2 text-[var(--color-text-muted)] md:hidden"
      aria-label="Toggle navigation"
      onclick={() => (mobileOpen = !mobileOpen)}
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="round" />
      </svg>
    </button>
  </div>

  {#if mobileOpen}
    <div class="border-t border-white/6 px-4 py-4 md:hidden">
      <div class="flex flex-col gap-3">
        {#each links as link}
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            class="rounded-2xl px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:bg-white/4 hover:text-white"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</nav>
