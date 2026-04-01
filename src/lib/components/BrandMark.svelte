<script lang="ts">
  let {
    size = 40,
    alt = "Fidan",
    className = ""
  } = $props<{
    size?: number;
    alt?: string;
    className?: string;
  }>();
</script>

<img
  src="/favicon.svg"
  width={size}
  height={size}
  alt={alt}
  class={`pointer-events-none select-none block shrink-0 object-contain ${className}`.trim()}
  decoding="async"
  loading="eager"
  draggable="false"
/>
