<script lang="ts">
  import CopyToast from "$lib/components/CopyToast.svelte";

  let {
    title = "Fidan",
    code,
    language = "fidan",
    compact = false,
  } = $props<{
    title?: string;
    code: string;
    language?: string;
    compact?: boolean;
  }>();

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1400);
  }
</script>

<div class="panel overflow-hidden rounded-[var(--radius-lg)]">
  <div
    class="flex items-center justify-between border-b border-white/8 px-4 py-3"
  >
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-[var(--color-danger)]/70"></span>
      <span class="h-3 w-3 rounded-full bg-[var(--color-warning)]/70"></span>
      <span class="h-3 w-3 rounded-full bg-[var(--color-success)]/70"></span>
      <span class="ml-3 text-sm text-[var(--color-text-muted)]">{title}</span>
    </div>
    <button
      class="rounded-full border border-white/8 px-3 py-1 text-xs text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)]/40 hover:text-white"
      onclick={copyCode}
      type="button"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  </div>
  <pre
    class="overflow-x-auto px-5 text-sm leading-7 text-[var(--color-text)]"
    class:py-4={compact}
    class:py-6={!compact}><code class="language-{language}">{code}</code></pre>
</div>

<CopyToast visible={copied} />
