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

  const normalizedCode = $derived(
    code.replace(/\r\n/g, "\n").replace(/^\n+/, "").replace(/\n+$/, ""),
  );

  function getPromptForLanguage(value: string): string | null {
    const normalized = value.trim().toLowerCase();

    if (["bash", "sh", "shell", "zsh"].includes(normalized)) {
      return "$";
    }

    if (["powershell", "pwsh", "ps1", "ps"].includes(normalized)) {
      return "PS>";
    }

    return null;
  }

  const prompt = $derived(getPromptForLanguage(language));
  const promptedLines = $derived.by(() => {
    return normalizedCode ? normalizedCode.split("\n") : [];
  });

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function copyCode() {
    await navigator.clipboard.writeText(normalizedCode);
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1400);
  }
</script>

<div class="code-window-shell">
  <div class="code-window-shell__glow" aria-hidden="true"></div>
  <div
    class="panel code-window-shell__frame min-w-0 w-full max-w-full overflow-hidden rounded-[var(--radius-lg)]"
  >
    <div
      class="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3"
    >
      <div class="flex min-w-0 items-center gap-2">
        <span class="h-3 w-3 rounded-full bg-[var(--color-danger)]/70"></span>
        <span class="h-3 w-3 rounded-full bg-[var(--color-warning)]/70"></span>
        <span class="h-3 w-3 rounded-full bg-[var(--color-success)]/70"></span>
        <span class="ml-3 truncate text-sm text-[var(--color-text-muted)]"
          >{title}</span
        >
      </div>
      <button
        class="shrink-0 rounded-full border border-white/8 px-3 py-1 text-xs text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)]/40 hover:text-white"
        onclick={copyCode}
        type="button"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
    <pre
      class="m-0 max-w-full overflow-x-auto px-4 text-sm leading-7 text-[var(--color-text)] sm:px-5"
      class:py-4={compact}
      class:py-6={!compact}>{#if prompt}<code
          class="language-{language} code-block--prompted"
          >{#each promptedLines as line}<span class="code-line"
              ><span class="code-prompt" aria-hidden="true">{prompt}</span><span
                class="code-line__content">{line || "\u00A0"}</span
              ></span
            >{/each}</code
        >{:else}<code class="language-{language}">{normalizedCode}</code
        >{/if}</pre>
  </div>
</div>

<CopyToast visible={copied} />
