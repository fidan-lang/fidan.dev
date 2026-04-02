import type { PageServerLoad } from "./$types";
import { getReleaseByVersion } from "$lib/server/releases";

export const load: PageServerLoad = async ({ fetch, params }) => {
  return {
    release: await getReleaseByVersion(fetch, params.version),
  };
};
