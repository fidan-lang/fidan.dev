<script lang="ts">
  import BrandMark from "$lib/components/BrandMark.svelte";
  import type { NavLink } from "$lib/data/site";

  let { links } = $props<{ links: NavLink[] }>();
  let mobileOpen = $state(false);

  function closeMobileMenu() {
    mobileOpen = false;
  }
</script>

<nav
  class="sticky top-0 z-40 border-b border-white/6 bg-[rgba(8,13,9,0.72)] backdrop-blur-xl"
>
  <div
    class="relative mx-auto flex min-w-0 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8"
  >
    <a
      href="/"
      class="group flex min-w-0 items-center gap-3"
      onclick={closeMobileMenu}
    >
      <div
        class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 shadow-[0_0_32px_rgba(132,204,22,0.08)] sm:h-12 sm:w-12"
      >
        <BrandMark size={34} alt="Fidan" />
      </div>
      <div class="min-w-0 leading-tight">
        <div
          class="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:text-sm"
        >
          fidan
        </div>
        <div
          class="truncate text-sm font-semibold text-white transition group-hover:text-[var(--color-primary-light)] sm:text-base"
        >
          Native, refreshed
        </div>
      </div>
    </a>

    <div
      class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
    >
      {#each links as link}
        <a
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          class="text-link text-sm text-[var(--color-text-muted)] transition hover:text-white"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <a
      href="https://docs.fidan.dev/getting-started/install"
      class="button-primary hidden rounded-full px-4 py-2 text-sm font-medium md:inline-flex"
    >
      Install
    </a>

    <button
      type="button"
      class="mobile-nav-toggle rounded-xl border p-2 text-[var(--color-text-muted)] transition-[border-color,color,background-color] duration-250 md:hidden {mobileOpen
        ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-white'
        : 'border-white/8 bg-transparent'}"
      aria-label="Toggle navigation"
      aria-controls="mobile-nav-panel"
      aria-expanded={mobileOpen}
      onclick={() => (mobileOpen = !mobileOpen)}
    >
      <span class="mobile-nav-toggle__icon" aria-hidden="true">
        <span
          class="mobile-nav-toggle__line mobile-nav-toggle__line--top"
          class:is-open={mobileOpen}
        ></span>
        <span
          class="mobile-nav-toggle__line mobile-nav-toggle__line--middle"
          class:is-open={mobileOpen}
        ></span>
        <span
          class="mobile-nav-toggle__line mobile-nav-toggle__line--bottom"
          class:is-open={mobileOpen}
        ></span>
      </span>
    </button>
  </div>

  <div
    id="mobile-nav-panel"
    aria-hidden={!mobileOpen}
    class="mobile-nav-panel-shell px-4 md:hidden {mobileOpen
      ? 'is-open pointer-events-auto'
      : 'pointer-events-none'}"
  >
    <div class="mobile-nav-panel">
      <div class="mobile-nav-panel__inner flex flex-col gap-3 py-4">
        {#each links as link, index}
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            class="mobile-nav-panel__item rounded-2xl px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:bg-white/4 hover:text-white"
            style={`--mobile-nav-item-index: ${index};`}
            onclick={closeMobileMenu}
          >
            {link.label}
          </a>
        {/each}
        <a
          href="https://docs.fidan.dev/getting-started/install"
          class="button-primary mobile-nav-panel__item mt-2 inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium"
          style={`--mobile-nav-item-index: ${links.length};`}
          onclick={closeMobileMenu}
        >
          Install
        </a>
      </div>
    </div>
  </div>
</nav>

<style>
  .mobile-nav-toggle__icon {
    position: relative;
    display: block;
    width: 1.25rem;
    height: 1.25rem;
  }

  .mobile-nav-toggle__line {
    position: absolute;
    left: 1px;
    right: 1px;
    height: 1.5px;
    border-radius: 999px;
    background: currentColor;
    transform-origin: center;
    transition:
      transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 180ms ease,
      top 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .mobile-nav-toggle__line--top {
    top: 4px;
  }

  .mobile-nav-toggle__line--middle {
    top: 9px;
  }

  .mobile-nav-toggle__line--bottom {
    top: 14px;
  }

  .mobile-nav-toggle__line--top.is-open {
    top: 9px;
    transform: rotate(45deg);
  }

  .mobile-nav-toggle__line--middle.is-open {
    opacity: 0;
    transform: scaleX(0.4);
  }

  .mobile-nav-toggle__line--bottom.is-open {
    top: 9px;
    transform: rotate(-45deg);
  }

  .mobile-nav-panel-shell {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
      grid-template-rows 300ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 220ms ease,
      border-color 220ms ease;
    border-top: 1px solid transparent;
  }

  .mobile-nav-panel-shell.is-open {
    grid-template-rows: 1fr;
    opacity: 1;
    border-top-color: rgba(255, 255, 255, 0.06);
  }

  .mobile-nav-panel {
    overflow: hidden;
  }

  .mobile-nav-panel__inner {
    transform: translateY(-10px);
    opacity: 0;
    transition:
      transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 180ms ease;
  }

  .mobile-nav-panel__item {
    opacity: 0;
    transform: translateY(-8px) scale(0.985);
    transition:
      transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 180ms ease,
      background-color 160ms ease,
      color 160ms ease;
  }

  .mobile-nav-panel-shell.is-open .mobile-nav-panel__inner {
    transform: translateY(0);
    opacity: 1;
  }

  .mobile-nav-panel-shell.is-open .mobile-nav-panel__item {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition-delay: calc(var(--mobile-nav-item-index, 0) * 32ms + 70ms);
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-nav-toggle,
    .mobile-nav-toggle__line,
    .mobile-nav-panel-shell,
    .mobile-nav-panel__inner,
    .mobile-nav-panel__item {
      transition-duration: 0.01ms !important;
    }
  }
</style>
