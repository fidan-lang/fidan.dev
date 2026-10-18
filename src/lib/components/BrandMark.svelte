<script lang="ts">
  let {
    size = 40,
    alt = "Fidan",
    className = "",
  }: {
    size?: number;
    alt?: string;
    className?: string;
  } = $props();
</script>

<img
  src="/favicon.svg"
  width={size}
  height={size}
  {alt}
  class={`pointer-events-none select-none block shrink-0 object-contain ${className}`.trim()}
  decoding="async"
  loading="eager"
  draggable="false"
/>
