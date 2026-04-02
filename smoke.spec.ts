import { expect, test } from "@playwright/test";

test("marketing home renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /build native software/i }),
  ).toBeVisible();
});

test("release page renders", async ({ page }) => {
  await page.goto("/releases/1.0.0");
  await expect(
    page.getByRole("heading", { name: /fidan 1.0.0/i }),
  ).toBeVisible();
});
