const RELEASE_TAG =
  /^v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

// Validate before constructing either API paths or public links. Do not trim
// control characters into a valid tag, and reject numeric prerelease leading zeros.
export function releaseVersion(tag: string): string {
  if (/[\s\x00-\x1f\x7f]/.test(tag) || !RELEASE_TAG.test(tag)) {
    throw new Error("GitHub release has an invalid SemVer tag");
  }
  const version = tag.replace(/^v/, "");
  const prerelease = version.split("+")[0].split("-").slice(1).join("-");
  if (prerelease.split(".").some((part) => /^0\d+$/.test(part))) {
    throw new Error("GitHub release has an invalid SemVer tag");
  }
  return version;
}

export function officialGitHubReleaseUrl(tag: string): string {
  releaseVersion(tag);
  return `https://github.com/fidan-lang/fidan/releases/tag/${encodeURIComponent(tag)}`;
}
