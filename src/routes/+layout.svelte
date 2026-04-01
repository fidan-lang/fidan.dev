<script lang="ts">
  import "../app.css";

  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href={data.canonicalUrl} />
</svelte:head>

{@render children()}
