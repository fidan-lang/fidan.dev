import type { PageLoad } from "./$types";
import { loadDocPage } from "$lib/utils/load-doc-page";

export const load: PageLoad = async ({ params, parent, url }) => {
  const data = await parent();
  const slug = params.slug?.split("/").filter(Boolean) ?? [];
  return loadDocPage({
    slug,
    host: data.host,
    hostname: url.hostname,
    search: url.search,
  });
};
