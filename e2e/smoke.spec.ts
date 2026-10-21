import { displayedReleaseVersion } from "./releases";
import { expect, test } from "@playwright/test";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("marketing home renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /build native software in/i }),
  ).toBeVisible();
  await expect(page.getByTestId("ambient-scene")).toBeVisible();
  await expect(page.getByTestId("proof-stat-panel")).toHaveCount(4);
});

test("release page renders", async ({ page, request }) => {
  const version = await displayedReleaseVersion(request);

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
  await expect(page.getByTestId("ambient-scene")).toHaveCount(0);
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
