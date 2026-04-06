import { APIRequestContext, expect, test } from "@playwright/test";

type GitHubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getLatestStableReleaseVersion(
  request: APIRequestContext,
): Promise<string> {
  const response = await request.get(
    "https://api.github.com/repos/fidan-lang/fidan/releases",
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "fidan.dev-e2e",
      },
    },
  );

  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as GitHubRelease[];
  const release = payload.find((entry) => !entry.draft && !entry.prerelease);
  expect(release).toBeTruthy();

  return release!.tag_name.trim().replace(/^v/i, "");
}

test("marketing home renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /build native software in/i }),
  ).toBeVisible();
});

test("release page renders", async ({ page, request }) => {
  const version = await getLatestStableReleaseVersion(request);

  await page.goto(`/releases/${version}`);
  await expect(
    page.getByText(new RegExp(`release\\s+${escapeRegex(version)}`, "i")),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: new RegExp(`fidan\\s+${escapeRegex(version)}`, "i"),
    }),
  ).toBeVisible();
});

test("docs home renders", async ({ page }) => {
  await page.goto("/docs");
  await expect(
    page.getByRole("heading", {
      name: /the docs are built to feel like a product/i,
    }),
  ).toBeVisible();
});

test("language page renders", async ({ page }) => {
  await page.goto("/language/variables-and-types");
  await expect(
    page.getByRole("heading", { name: /variables and types/i }),
  ).toBeVisible();
});

test("toolchains page renders", async ({ page }) => {
  await page.goto("/toolchains/llvm-aot");
  await expect(page.getByRole("heading", { name: /llvm aot/i })).toBeVisible();
});
