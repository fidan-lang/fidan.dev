import { APIRequestContext, Page, expect, test } from "@playwright/test";

type GitHubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
};

const mobileViewport = { width: 390, height: 844 };

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
        "User-Agent": "fidan.dev-e2e-mobile",
      },
    },
  );

  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as GitHubRelease[];
  const release = payload.find((entry) => !entry.draft && !entry.prerelease);
  expect(release).toBeTruthy();

  return release!.tag_name.trim().replace(/^v/i, "");
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;

    return {
      viewportWidth: window.innerWidth,
      rootScrollWidth: root.scrollWidth,
      bodyScrollWidth: body?.scrollWidth ?? 0,
    };
  });

  expect(
    dimensions.rootScrollWidth,
    `documentElement overflowed the mobile viewport: ${JSON.stringify(dimensions)}`,
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);

  expect(
    dimensions.bodyScrollWidth,
    `body overflowed the mobile viewport: ${JSON.stringify(dimensions)}`,
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

test.describe("mobile layout", () => {
  test.use({ viewport: mobileViewport });

  test("marketing home stays inside the viewport", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /build native software in/i }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("docs article stays inside the viewport", async ({ page }) => {
    await page.goto("/language/variables-and-types");
    await expect(
      page.getByRole("heading", { name: /variables and types/i }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("releases index stays inside the viewport", async ({ page }) => {
    await page.goto("/releases");
    await expect(
      page.getByRole("heading", {
        name: /version history with actual substance/i,
      }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("release detail stays inside the viewport", async ({
    page,
    request,
  }) => {
    const version = await getLatestStableReleaseVersion(request);

    await page.goto(`/releases/${version}`);
    await expect(
      page.getByText(new RegExp(`release\\s+${escapeRegex(version)}`, "i")),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
