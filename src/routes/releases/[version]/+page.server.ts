import type { PageServerLoad } from "./$types";
import { getReleaseByVersion } from "$lib/server/releases";

import { renderReleaseMarkdown } from "$lib/server/release-markdown";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const release = await getReleaseByVersion(fetch, params.version);
  return { release, bodyHtml: renderReleaseMarkdown(release.body) };
};
