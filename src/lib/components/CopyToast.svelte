<script lang="ts">
  import { portal } from "$lib/actions/portal";

  let {
    visible = false,
    text = "Copied!"
  } = $props<{
    visible?: boolean;
    text?: string;
  }>();
</script>

<div
  use:portal
  aria-live="polite"
  aria-atomic="true"
  class="pointer-events-none fixed bottom-6 right-6 z-50 transition duration-200 ease-out motion-reduce:transition-none {visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}"
>
  <div class="rounded-full border border-[var(--color-primary)]/30 bg-[rgba(7,12,8,0.95)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-light)] shadow-[0_12px_40px_rgba(132,204,22,0.16)]">
    {text}
  </div>
</div>
