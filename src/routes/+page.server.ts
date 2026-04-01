import type { PageServerLoad } from "./$types";
import { getLatestRelease } from "$lib/server/releases";

export const load: PageServerLoad = async ({ fetch }) => {
  return {
    latestRelease: await getLatestRelease(fetch)
  };
};
