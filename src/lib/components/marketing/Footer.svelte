<script lang="ts">
  import BrandMark from "$lib/components/BrandMark.svelte";
  import { footerColumns } from "$lib/data/site";
</script>

<footer class="border-t border-white/6 bg-[rgba(7,12,8,0.92)]">
  <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
    <div>
      <div class="mb-4 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10">
          <BrandMark size={34} alt="Fidan" />
        </div>
        <div>
          <div class="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">fidan</div>
          <div class="text-lg font-semibold text-white">Build native software with less drag.</div>
        </div>
      </div>
      <p class="max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
        Fidan is a native-first language and toolchain with a compact language surface, real concurrency primitives, and a package story built around Dal.
      </p>
    </div>

    {#each footerColumns as column}
      <div>
        <h2 class="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {column.title}
        </h2>
        <ul class="space-y-3">
          {#each column.links as link}
            <li>
              <a
                href={link.href}
                target={"external" in link && link.external ? "_blank" : undefined}
                rel={"external" in link && link.external ? "noreferrer" : undefined}
                class="text-link text-sm text-[var(--color-text)]/85 transition hover:text-[var(--color-primary-light)]"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
  <div class="border-t border-white/6 px-4 py-5 text-center text-xs text-[var(--color-text-muted)]">
    <p>&copy; {new Date().getFullYear()} Fidan. All rights reserved.</p>
    <p class="mt-2.5">Fidan™ and Dal™ are trademarks of Kaan Gönüldinc (AppSolves).</p>
  </div>
</footer>
