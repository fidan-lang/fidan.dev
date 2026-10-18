import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // This site has no local persistent bindings; isolated previews avoid stale SQLite locks.
    adapter: adapter({ platformProxy: { persist: false } }),
  },
};

export default config;
