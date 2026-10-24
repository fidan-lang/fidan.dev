<script lang="ts">
  import CopyToast from "$lib/components/CopyToast.svelte";
  import type { DocPage } from "$lib/content/docs";
  import { renderInlineMarkdown, type TocItem } from "$lib/utils/markdown";

  let {
    page,
    html,
    previousHref,
    previousLabel,
    nextHref,
    nextLabel,
  }: {
    page: DocPage;
    html: string;
    previousHref?: string;
    previousLabel?: string;
    nextHref?: string;
    nextLabel?: string;
    toc?: TocItem[];
  } = $props();

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

  function activateTab(button: HTMLButtonElement, focus = false) {
    const tabset = button.closest<HTMLElement>("[data-tabset]");
    if (!tabset) return;
    const triggers = Array.from(tabset.querySelectorAll<HTMLButtonElement>(
      ":scope > .doc-tabs__list > [data-tab-trigger]",
    ));
    const index = triggers.indexOf(button);
    if (index < 0) return;
    for (const [position, trigger] of triggers.entries()) {
      const active = position === index;
      trigger.classList.toggle("is-active", active);
      trigger.setAttribute("aria-selected", String(active));
      trigger.tabIndex = active ? 0 : -1;
    }
    for (const [position, panel] of Array.from(tabset.querySelectorAll<HTMLElement>(
      ":scope > .doc-tabs__panels > .doc-tabs__panel",
    )).entries()) {
      const active = position === index;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    }
    if (focus) button.focus();
  }

  function handleArticleKeydown(event: KeyboardEvent) {
    const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>("[data-tab-trigger]");
    if (!button?.parentElement) return;
    const triggers = Array.from(button.parentElement.querySelectorAll<HTMLButtonElement>(":scope > [data-tab-trigger]"));
    const current = triggers.indexOf(button);
    if (current < 0) return;
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (current + 1) % triggers.length; break;
      case "ArrowLeft": next = (current - 1 + triggers.length) % triggers.length; break;
      case "Home": next = 0; break;
      case "End": next = triggers.length - 1; break;
      default: return;
    }
    event.preventDefault();
    activateTab(triggers[next], true);
  }

  async function handleArticleClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-copy]")) {
      await handleCopy(event);
      return;
    }

    const tab = target?.closest<HTMLButtonElement>("[data-tab-trigger]");
    if (tab) activateTab(tab);
  }
</script>

<article class="panel min-w-0 rounded-[var(--radius-xl)] p-5 sm:p-10">
  <div class="mb-8 border-b border-white/6 pb-8">
    <div
      class="mb-4 inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-primary-light)]"
    >
      {page.section}
    </div>
    <h1
      class="mb-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
    >
      {@html renderInlineMarkdown(page.title)}
    </h1>
    <p class="max-w-2xl text-base leading-8 text-[var(--color-text-muted)]">
      {@html renderInlineMarkdown(page.description)}
    </p>
  </div>

  <div
    class="prose max-w-none"
    role="presentation"
    tabindex="-1"
    onclick={handleArticleClick}
    onkeydown={handleArticleKeydown}
  >
    {@html html}
  </div>

  <div class="mt-10 grid gap-4 border-t border-white/6 pt-8 sm:grid-cols-2">
    {#if previousHref}
      <a
        href={previousHref}
        class="group rounded-[var(--radius-lg)] border border-white/6 bg-white/2 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:bg-[color-mix(in_srgb,var(--color-surface-3)_78%,white_6%)]"
      >
        <div
          class="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
        >
          <svg
            aria-hidden="true"
            class="arrow-icon arrow-icon--left h-3.5 w-3.5"
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
        <div class="text-sm font-medium text-white">
          {@html renderInlineMarkdown(previousLabel ?? "")}
        </div>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if nextHref}
      <a
        href={nextHref}
        class="group rounded-[var(--radius-lg)] border border-white/6 bg-white/2 p-4 text-right transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:bg-[color-mix(in_srgb,var(--color-surface-3)_78%,white_6%)]"
      >
        <div
          class="mb-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]"
        >
          <span>Next</span>
          <svg
            aria-hidden="true"
            class="arrow-icon h-3.5 w-3.5"
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
        <div class="text-sm font-medium text-white">
          {@html renderInlineMarkdown(nextLabel ?? "")}
        </div>
      </a>
    {/if}
  </div>
</article>

<CopyToast visible={copied} />
