import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import {
  detectHost,
  docsCanonical,
  isLocalHost,
  mainCanonical,
} from "$lib/utils/hosts";

export const load: LayoutServerLoad = ({ url, request }) => {
  const hostname = request.headers.get("x-forwarded-host") ?? url.hostname;
  const host = detectHost(hostname);
  const pathname = url.pathname;
  const search = url.search;

  if (
    !isLocalHost(hostname) &&
    host === "main" &&
    pathname.startsWith("/docs")
  ) {
    const trimmed = pathname.replace(/^\/docs/, "") || "/";
    throw redirect(308, docsCanonical(trimmed, search));
  }

  const canonicalUrl =
    host === "docs" || pathname.startsWith("/docs")
      ? docsCanonical(
          pathname === "/docs" ? "/" : pathname.replace(/^\/docs/, "") || "/",
          search,
        )
      : mainCanonical(pathname, search);

  return {
    host,
    pathname,
    canonicalUrl,
  };
};
