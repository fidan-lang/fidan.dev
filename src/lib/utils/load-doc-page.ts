import { error, redirect } from "@sveltejs/kit";
import { findDocBySlug, getDocNeighbors } from "$lib/utils/docs";
import { collectToc, renderMarkdown } from "$lib/utils/markdown";
import { docsCanonical, isLocalHost, type HostKind } from "$lib/utils/hosts";

export function loadDocPage({
  slug,
  host,
  hostname,
  search
}: {
  slug: string[];
  host?: HostKind;
  hostname: string;
  search: string;
}) {
  const page = findDocBySlug(slug);

  if (!page) {
    throw error(404, "Page not found");
  }

  if (host === "main" && !isLocalHost(hostname)) {
    throw redirect(308, docsCanonical(`/${slug.join("/")}`, search));
  }

  const neighbors = getDocNeighbors(slug);
  const bodyMarkdown = page.markdown.replace(/^#\s+.*(?:\r?\n){1,2}/, "");

  return {
    doc: page,
    html: renderMarkdown(bodyMarkdown),
    toc: collectToc(bodyMarkdown),
    previous: neighbors.previous,
    next: neighbors.next
  };
}
