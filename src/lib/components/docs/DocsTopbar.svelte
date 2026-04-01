<script lang="ts">
  import BrandMark from "$lib/components/BrandMark.svelte";
  import { docsBySection } from "$lib/utils/docs";

  let { currentPath = "/" } = $props<{ currentPath?: string }>();
</script>

<header class="sticky top-0 z-30 border-b border-white/6 bg-[rgba(7,12,8,0.82)] backdrop-blur-xl">
  <div class="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex min-w-0 items-center gap-4">
      <a href="/" class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10">
          <BrandMark size={34} alt="Fidan" />
        </div>
        <div class="min-w-0">
          <div class="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">docs.fidan.dev</div>
          <div class="truncate text-sm font-semibold text-white">Fidan Documentation</div>
        </div>
      </a>
      <div class="hidden h-8 w-px bg-white/8 lg:block"></div>
      <nav class="hidden flex-wrap items-center gap-2 lg:flex">
        {#each docsBySection as group}
          <a
            href="/{group.pages[0].slug.join('/')}"
            class="rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition {currentPath === `/${group.pages[0].slug.join('/')}` || currentPath.startsWith(`/${group.section}`) ? 'bg-[var(--color-primary)]/12 text-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]/25' : 'text-[var(--color-text-muted)] hover:bg-white/4 hover:text-white'}"
          >
            {group.label}
          </a>
        {/each}
      </nav>
    </div>

    <div class="hidden items-center gap-3 md:flex">
      <a href="https://fidan.dev" class="text-sm text-[var(--color-text-muted)] transition hover:text-white">Main site</a>
      <a href="/releases" class="text-sm text-[var(--color-text-muted)] transition hover:text-white">Releases</a>
      <a href="https://dal.fidan.dev" class="text-sm text-[var(--color-text-muted)] transition hover:text-white">Dal</a>
      <a
        href="https://github.com/fidan-lang/fidan"
        class="rounded-full border border-white/8 px-4 py-2 text-sm text-white transition hover:border-[var(--color-primary)]/25 hover:text-[var(--color-primary-light)]"
      >
        GitHub
      </a>
    </div>
  </div>
</header>
