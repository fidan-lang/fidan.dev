const RELEASE_TAG =
  /^v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

// GitHub release API fields are external input. Construct the public link from
// a validated tag instead of letting an API-supplied URL choose the origin.
export function officialGitHubReleaseUrl(tag: string): string {
  const normalizedTag = tag.trim();
  if (!RELEASE_TAG.test(normalizedTag)) {
    throw new Error("GitHub release has an invalid SemVer tag");
  }
  return `https://github.com/fidan-lang/fidan/releases/tag/${encodeURIComponent(normalizedTag)}`;
}
