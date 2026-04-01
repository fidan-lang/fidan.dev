<script lang="ts">
  import type { TocItem } from "$lib/utils/markdown";

  let { items } = $props<{ items: TocItem[] }>();
</script>

{#if items.length}
  <aside class="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[var(--radius-lg)] border border-white/6 bg-[rgba(12,18,13,0.72)] p-4 2xl:block">
    <div class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">On this page</div>
    <ul class="space-y-2">
      {#each items as item}
        <li class={item.level === 3 ? "pl-3" : ""}>
          <a href="#{item.id}" class="text-sm text-[var(--color-text-muted)] transition hover:text-white">
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
{/if}
