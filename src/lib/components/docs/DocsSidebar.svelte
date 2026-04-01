<script lang="ts">
  import type { DocPage } from "$lib/content/docs";
  import type { SidebarGroup } from "$lib/utils/docs";

  let { groups, currentPath, search = "" } = $props<{
    groups: SidebarGroup[];
    currentPath: string;
    search?: string;
  }>();

  function matches(page: DocPage) {
    if (!search.trim()) return true;
    const query = search.trim().toLowerCase();
    return [page.title, page.description, page.summary].some((value) => value.toLowerCase().includes(query));
  }
</script>

<aside class="panel-soft sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[var(--radius-lg)] p-4 xl:block">
  {#each groups as group}
    <section class="mb-6">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        {group.label}
      </h2>
      <ul class="space-y-1">
        {#each group.pages.filter(matches) as page}
          <li>
            <a
              href="/{page.slug.join('/')}"
              class="block rounded-xl px-3 py-2 text-sm transition hover:bg-white/4 hover:text-white {currentPath === `/${page.slug.join('/')}` ? 'bg-[var(--color-primary)]/10 text-white ring-1 ring-[var(--color-primary)]/30' : 'text-[var(--color-text-muted)]'}"
            >
              {page.sidebarLabel}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</aside>
