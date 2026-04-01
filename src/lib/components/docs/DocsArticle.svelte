<script lang="ts">
  import { goto } from "$app/navigation";
  import CopyToast from "$lib/components/CopyToast.svelte";
  import type { DocPage } from "$lib/content/docs";
  import type { TocItem } from "$lib/utils/markdown";

  let { page, html, previousHref, previousLabel, nextHref, nextLabel } =
    $props<{
      page: DocPage;
      html: string;
      previousHref?: string;
      previousLabel?: string;
      nextHref?: string;
      nextLabel?: string;
      toc?: TocItem[];
    }>();

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function handleCopy(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>("[data-copy]");
    if (!button) return;
    await navigator.clipboard.writeText(button.dataset.copy ?? "");
    copied = true;
    button.textContent = "Copied!";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
      button.textContent = "Copy";
    }, 1500);
  }

  function handleTabs(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>("[data-tab-trigger]");
    if (!button) return;

    const tabset = button.closest<HTMLElement>("[data-tabset]");
    if (!tabset) return;

    const index = Number(button.dataset.tabIndex ?? "-1");
    if (!Number.isFinite(index) || index < 0) return;

    for (const trigger of tabset.querySelectorAll<HTMLButtonElement>(
      "[data-tab-trigger]",
    )) {
      const active = Number(trigger.dataset.tabIndex ?? "-1") === index;
      trigger.classList.toggle("is-active", active);
      trigger.setAttribute("aria-selected", active ? "true" : "false");
    }

    for (const [panelIndex, panel] of Array.from(
      tabset.querySelectorAll<HTMLElement>(".doc-tabs__panel"),
    ).entries()) {
      const active = panelIndex === index;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    }
  }

  async function handleArticleClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-copy]")) {
      await handleCopy(event);
      return;
    }

    if (target?.closest("[data-tab-trigger]")) {
      handleTabs(event);
    }
  }

  async function handleDocPagerClick(event: MouseEvent, href: string) {
    event.preventDefault();
    await goto(href, { keepFocus: true, noScroll: false });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
</script>

<article class="panel rounded-[var(--radius-xl)] p-6 sm:p-10">
  <div class="mb-8 border-b border-white/6 pb-8">
    <div
      class="mb-4 inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-primary-light)]"
    >
      {page.section}
    </div>
    <h1 class="mb-4 text-4xl font-semibold tracking-[-0.04em] text-white">
      {page.title}
    </h1>
    <p class="max-w-2xl text-base leading-8 text-[var(--color-text-muted)]">
      {page.description}
    </p>
  </div>

  <div
    class="prose max-w-none"
    role="presentation"
    tabindex="-1"
    onclick={handleArticleClick}
    onkeydown={() => {}}
  >
    {@html html}
  </div>

  <div class="mt-10 grid gap-4 border-t border-white/6 pt-8 sm:grid-cols-2">
    {#if previousHref}
      <a
        href={previousHref}
        class="rounded-[var(--radius-lg)] border border-white/6 bg-white/2 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:bg-[color-mix(in_srgb,var(--color-surface-3)_78%,white_6%)]"
        onclick={(event) => handleDocPagerClick(event, previousHref)}
      >
        <div
          class="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
        >
          <svg
            aria-hidden="true"
            class="h-3.5 w-3.5"
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
          <span>Previous</span>
        </div>
        <div class="text-sm font-medium text-white">{previousLabel}</div>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if nextHref}
      <a
        href={nextHref}
        class="rounded-[var(--radius-lg)] border border-white/6 bg-white/2 p-4 text-right transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:bg-[color-mix(in_srgb,var(--color-surface-3)_78%,white_6%)]"
        onclick={(event) => handleDocPagerClick(event, nextHref)}
      >
        <div
          class="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
        >
          <span>Next</span>
          <svg
            aria-hidden="true"
            class="h-3.5 w-3.5"
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
        <div class="text-sm font-medium text-white">{nextLabel}</div>
      </a>
    {/if}
  </div>
</article>

<CopyToast visible={copied} />
