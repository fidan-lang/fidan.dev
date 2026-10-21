import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1440, 1920]) {
  test(`public docs remain usable at ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "/",
      "/dal/dal-toml",
      "/dal/publishing-and-dalignore",
    ]) {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(
        page.locator('head meta[name="description"]'),
      ).toHaveAttribute("content", /.+/);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      await page.screenshot({
        path: test
          .info()
          .outputPath(`${width}-${route.replaceAll("/", "_") || "home"}.png`),
        fullPage: false,
      });
    }
    expect(errors).toEqual([]);
    await page.goto("/not-a-real-audit-page");
    await expect(page.getByText(/404|not found/i).first()).toBeVisible();
  });
}

test("published documentation sitemap and internal links resolve locally", async ({
  request,
}) => {
  test.setTimeout(60000);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const urls = [
    ...(await sitemap.text()).matchAll(
      /<loc>(https:\/\/docs\.fidan\.dev[^<]*)<\/loc>/g,
    ),
  ].map((match) => new URL(match[1]));
  expect(urls.length).toBeGreaterThan(1);
  const paths = new Set(
    urls.map((url) => (url.pathname === "/" ? "/docs" : url.pathname)),
  );
  const links = new Set<string>();
  for (const path of paths) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    for (const match of (await response.text()).matchAll(
      /href=["']([^"']+)["']/g,
    )) {
      const href = match[1].replaceAll("&amp;", "&");
      if (href.startsWith("/") && !href.startsWith("//"))
        links.add(href.split("#")[0]);
      if (href.startsWith("https://docs.fidan.dev/")) {
        const url = new URL(href);
        links.add(url.pathname === "/" ? "/docs" : url.pathname);
      }
    }
  }
  for (const path of links) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
  }
});

test("legal navigation separates the software license from draft branding", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const legal = page.getByRole("navigation", { name: "Legal", exact: true });
  for (const [label, url] of [
    ["Apache 2.0", "/LICENSE.txt"],
    ["Attribution", "/NOTICE.txt"],
    [
      "Branding (draft)",
      "https://github.com/fidan-lang/fidan/blob/main/TRADEMARKS.md",
    ],
  ]) {
    await expect(
      legal.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("href", url);
  }
  for (const name of ["LICENSE", "NOTICE"]) {
    const response = await request.get(`/${name}.txt`);
    expect(response.status()).toBe(200);
    expect(await response.body()).toEqual(
      readFileSync(new URL(`../${name}`, import.meta.url)),
    );
  }
});
