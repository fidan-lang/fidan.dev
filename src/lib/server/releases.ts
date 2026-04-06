import {
  releases as fallbackReleases,
  pickLatestRelease,
  type ReleaseNote,
} from "$lib/content/releases";
import { error } from "@sveltejs/kit";

const GITHUB_RELEASES_API =
  "https://api.github.com/repos/fidan-lang/fidan/releases";
const DEFAULT_INSTALL_NOTES = [
  "Use the installer for your platform or download the release archive.",
  "If you need portable binaries, keep the default target CPU or pass --target-cpu explicitly.",
  "If you need maximum local performance, use --release.",
] as const;
const RELEASE_CACHE_TTL_MS = 5 * 60 * 1000;

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
};

let cachedReleases:
  | {
      expiresAt: number;
      releases: ReleaseNote[];
    }
  | undefined;

function normalizeVersion(tag: string): string {
  return tag.trim().replace(/^v/i, "");
}

function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

function firstMeaningfulParagraph(body: string): string | undefined {
  const blocks = body
    .split(/\r?\n\r?\n/)
    .map((block) => stripMarkdown(block))
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return blocks.find(
    (block) => !/^(highlights|install|upgrade|notes?)$/i.test(block),
  );
}

function extractBulletHighlights(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => stripMarkdown(line.replace(/^[-*]\s+/, "")))
    .filter(Boolean)
    .slice(0, 4);
}

function toReleaseDate(publishedAt: string | null): string {
  if (!publishedAt) return new Date().toISOString().slice(0, 10);
  return publishedAt.slice(0, 10);
}

function resolveReleaseTitle(
  release: GitHubRelease,
  fallback: ReleaseNote | undefined,
  version: string,
): string {
  const rawName = release.name?.trim();
  if (rawName && !/^v?\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/i.test(rawName)) {
    return rawName;
  }

  return fallback?.title ?? `Fidan ${version}`;
}

function normalizeGitHubRelease(
  release: GitHubRelease,
  stableLatestVersion: string | undefined,
): ReleaseNote {
  const version = normalizeVersion(release.tag_name);
  const fallback = fallbackReleases.find((entry) => entry.version === version);
  const body =
    release.body?.trim() ||
    fallback?.body ||
    "Release notes are not available yet.";
  const summary =
    firstMeaningfulParagraph(body) ??
    fallback?.summary ??
    `Release notes for Fidan ${version}.`;
  const highlights = extractBulletHighlights(body);

  return {
    version,
    date: toReleaseDate(release.published_at),
    title: resolveReleaseTitle(release, fallback, version),
    summary,
    highlights:
      highlights.length > 0 ? highlights : (fallback?.highlights ?? []),
    installNotes: fallback?.installNotes ?? [...DEFAULT_INSTALL_NOTES],
    body,
    githubUrl: release.html_url,
    latest: version === stableLatestVersion,
  };
}

async function fetchGitHubReleases(
  fetchFn: typeof fetch,
): Promise<ReleaseNote[]> {
  const response = await fetchFn(GITHUB_RELEASES_API, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "fidan.dev",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub releases request failed with ${response.status}`);
  }

  const payload = (await response.json()) as GitHubRelease[];
  const published = payload.filter((release) => !release.draft);
  if (published.length === 0) {
    throw new Error("GitHub returned no published releases");
  }

  const latestStableVersion = normalizeVersion(
    (published.find((release) => !release.prerelease) ?? published[0]).tag_name,
  );

  return published.map((release) =>
    normalizeGitHubRelease(release, latestStableVersion),
  );
}

function fallbackReleaseNotes(): ReleaseNote[] {
  return fallbackReleases.map((release, index) => ({
    ...release,
    latest: release.latest ?? index === 0,
  }));
}

export async function getReleaseNotes(
  fetchFn: typeof fetch,
): Promise<ReleaseNote[]> {
  const now = Date.now();
  if (cachedReleases && cachedReleases.expiresAt > now) {
    return cachedReleases.releases;
  }

  try {
    const releases = await fetchGitHubReleases(fetchFn);
    cachedReleases = {
      expiresAt: now + RELEASE_CACHE_TTL_MS,
      releases,
    };
    return releases;
  } catch {
    const releases = fallbackReleaseNotes();
    cachedReleases = {
      expiresAt: now + RELEASE_CACHE_TTL_MS,
      releases,
    };
    return releases;
  }
}

export async function getLatestRelease(
  fetchFn: typeof fetch,
): Promise<ReleaseNote> {
  return pickLatestRelease(await getReleaseNotes(fetchFn));
}

export async function getReleaseByVersion(
  fetchFn: typeof fetch,
  version: string,
): Promise<ReleaseNote> {
  const normalizedVersion = normalizeVersion(version);
  const releases = await getReleaseNotes(fetchFn);
  const release = releases.find((entry) => entry.version === normalizedVersion);
  if (!release) {
    throw error(404, "Release not found");
  }

  return release;
}
