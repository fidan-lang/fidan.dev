import { env } from "$env/dynamic/private";
import {
  releases as fallbackReleases,
  pickLatestRelease,
  type ReleaseNote,
} from "$lib/content/releases";
import {
  officialGitHubReleaseUrl,
  releaseVersion,
} from "$lib/server/release-url";
import { error } from "@sveltejs/kit";

const GITHUB_RELEASES_API =
  "https://api.github.com/repos/fidan-lang/fidan/releases";
const DEFAULT_INSTALL_NOTES = [
  "Use the installer for your platform or download the release archive.",
  "If you need portable binaries, keep the default target CPU or pass --target-cpu explicitly.",
  "If you need maximum local performance, use --release.",
] as const;
const RELEASE_CACHE_TTL_MS = 5 * 60 * 1000;
// Release pages must retain their bundled fallback during upstream outages.
const RELEASE_REQUEST_TIMEOUT_MS = 5000;
const RELEASE_RESPONSE_MAX_BYTES = 2 * 1024 * 1024;
const RELEASE_DETAIL_CACHE_LIMIT = 64;
// Catalog is deliberately the latest 30; exact detail lookup is independent of it.
const RELEASE_CATALOG_SIZE = 30;
const cachedDetails = new Map<
  string,
  { expiresAt: number; release: ReleaseNote | null }
>();

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
};

let cachedReleases:
  | {
      expiresAt: number;
      releases: ReleaseNote[];
    }
  | undefined;

function normalizeVersion(tag: string): string {
  return releaseVersion(tag);
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
    githubUrl: officialGitHubReleaseUrl(release.tag_name),
    latest: version === stableLatestVersion,
  };
}

function parseRelease(value: unknown): GitHubRelease {
  if (!value || typeof value !== "object")
    throw new Error("Invalid release response");
  const item = value as Record<string, unknown>;
  releaseVersion(typeof item.tag_name === "string" ? item.tag_name : "");
  if (
    typeof item.draft !== "boolean" ||
    typeof item.prerelease !== "boolean" ||
    !["name", "body", "published_at"].every(
      (key) => item[key] === null || typeof item[key] === "string",
    )
  ) {
    throw new Error("Invalid release response");
  }
  return item as GitHubRelease;
}

async function requestGitHub(
  fetchFn: typeof fetch,
  suffix: string,
): Promise<unknown | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "fidan.dev",
  };
  const token =
    env.GITHUB_RELEASES_TOKEN?.trim() ||
    env.GITHUB_TOKEN?.trim() ||
    env.GITHUB_API_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  // Only a fixed GitHub origin; redirects must never carry a server credential.
  const response = await fetchFn(`${GITHUB_RELEASES_API}${suffix}`, {
    headers,
    redirect: "error",
    signal: AbortSignal.timeout(RELEASE_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 404) return null;
    throw new Error(`GitHub releases HTTP ${response.status}`);
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Missing release body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > RELEASE_RESPONSE_MAX_BYTES)
        throw new Error("Release response exceeds limit");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

async function fetchGitHubReleases(
  fetchFn: typeof fetch,
): Promise<ReleaseNote[]> {
  const payload = await requestGitHub(
    fetchFn,
    `?per_page=${RELEASE_CATALOG_SIZE}&page=1`,
  );
  if (!Array.isArray(payload)) throw new Error("Invalid release catalog");
  const published = payload
    .map(parseRelease)
    .filter((release) => !release.draft);
  if (published.length === 0) throw new Error("No published releases");
  const stable = published.find((release) => !release.prerelease);
  return published.map((release) =>
    normalizeGitHubRelease(
      release,
      stable ? normalizeVersion(stable.tag_name) : undefined,
    ),
  );
}

function cacheDetail(version: string, release: ReleaseNote | null): void {
  cachedDetails.delete(version);
  if (cachedDetails.size >= RELEASE_DETAIL_CACHE_LIMIT)
    cachedDetails.delete(cachedDetails.keys().next().value!);
  cachedDetails.set(version, {
    release,
    expiresAt: Date.now() + RELEASE_CACHE_TTL_MS,
  });
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
  } catch (error) {
    console.warn(
      "[fidan.dev] Upstream unavailable; using bundled release notes.",
    );
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
  let normalized: string;
  try {
    normalized = releaseVersion(version);
  } catch {
    throw error(404, "Release not found");
  }
  const cached = cachedDetails.get(normalized);
  if (cached && cached.expiresAt > Date.now()) {
    if (!cached.release) throw error(404, "Release not found");
    return cached.release;
  }
  let found: ReleaseNote | null = null;
  try {
    // Fidan tags use v; bare tags remain supported with at most one extra request.
    for (const tag of [`v${normalized}`, normalized]) {
      const payload = await requestGitHub(
        fetchFn,
        `/tags/${encodeURIComponent(tag)}`,
      );
      if (payload === null) continue;
      const release = parseRelease(payload);
      if (normalizeVersion(release.tag_name) !== normalized)
        throw new Error("Release identity mismatch");
      if (!release.draft) {
        const latest =
          cachedReleases?.releases.find((item) => item.latest)?.version ??
          pickLatestRelease(fallbackReleaseNotes()).version;
        found = normalizeGitHubRelease(release, latest);
      }
      break;
    }
  } catch {
    const fallback = fallbackReleaseNotes().find(
      (item) => item.version === normalized,
    );
    if (!fallback)
      throw error(503, "Release information temporarily unavailable");
    cacheDetail(normalized, fallback);
    return fallback;
  }
  cacheDetail(normalized, found);
  if (!found) throw error(404, "Release not found");
  return found;
}
