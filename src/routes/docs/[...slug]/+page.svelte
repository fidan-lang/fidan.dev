<script lang="ts">
  import DocsCatchAllPage from "../../[...slug]/+page.svelte";

  let { data } = $props();
</script>

<DocsCatchAllPage {data} />
