import type { PageServerLoad } from "./$types";
import { getLatestRelease, getReleaseNotes } from "$lib/server/releases";

export const load: PageServerLoad = async ({ fetch }) => {
  const releases = await getReleaseNotes(fetch);
  return {
    releases,
    latestRelease: await getLatestRelease(fetch),
  };
};
