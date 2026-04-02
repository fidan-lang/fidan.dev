import { expect, test } from "@playwright/test";

test("marketing home renders", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /switch to native software/i }),
  ).toBeVisible();
});

test("release page renders", async ({ page }) => {
  await page.goto("/releases/1.0.0");
  await expect(
    page.getByRole("heading", { name: /fidan 1.0.0/i }),
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
