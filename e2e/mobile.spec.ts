import { displayedReleaseVersion } from "./releases";
import { Page, expect, test } from "@playwright/test";

const mobileViewport = { width: 390, height: 844 };

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

  test("mobile menu toggles open and closed", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const toggle = page.getByRole("button", { name: /toggle navigation/i });
    const panel = page.locator("#mobile-nav-panel");
    const installLink = page.locator("#mobile-nav-panel a", {
      hasText: "Install",
    });

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveAttribute("aria-hidden", "true");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(installLink).toBeVisible();

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  test("marketing home stays inside the viewport", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: /expressive code\. native software\./i,
      }),
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
    const version = await displayedReleaseVersion(request);

    await page.goto(`/releases/${version}`);
    await expect(
      page.getByText(new RegExp(`release\\s+${escapeRegex(version)}`, "i")),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
