<script lang="ts">
  import DocsHome from "../docs-home.svelte";
  import { docsHomeCards } from "$lib/utils/docs";

  const cards = docsHomeCards();
</script>

<svelte:head>
  <title>Fidan Docs</title>
  <meta
    name="description"
    content="The Fidan documentation: language, stdlib, toolchains, DAL, and practical guides."
  />
</svelte:head>

<DocsHome {cards} />
