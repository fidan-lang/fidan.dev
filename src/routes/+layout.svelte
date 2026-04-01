<script lang="ts">
  import { browser } from "$app/environment";
  import { onNavigate } from "$app/navigation";
  import "../app.css";

  let { children, data } = $props();

  type ViewTransitionCapableDocument = Document & {
    startViewTransition?: (callback: () => Promise<void> | void) => {
      finished: Promise<void>;
    };
  };

  if (browser) {
    const viewTransitionDocument = document as ViewTransitionCapableDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const root = document.documentElement;

    onNavigate((navigation) => {
      const isRouteChange =
        navigation.type !== "popstate" &&
        !!navigation.to &&
        (!navigation.from ||
          navigation.from.url.pathname !== navigation.to.url.pathname ||
          navigation.from.url.search !== navigation.to.url.search);

      if (isRouteChange) {
        root.classList.add("is-route-changing");
        void navigation.complete.finally(() => {
          requestAnimationFrame(() => {
            root.classList.remove("is-route-changing");
          });
        });
      }

      if (
        !viewTransitionDocument.startViewTransition ||
        prefersReducedMotion.matches
      ) {
        return;
      }

      return new Promise<void>((resolve) => {
        viewTransitionDocument.startViewTransition!(async () => {
          resolve();
          await navigation.complete;
        });
      });
    });
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href={data.canonicalUrl} />
</svelte:head>

<div class="route-shell">
  {@render children()}
</div>
