import { expect, test } from "@playwright/test";
import {
  aiDemoCommands,
  heroSnippet,
  installCommands,
} from "../src/lib/data/site";

const quickstartPath = "/tools/compiler-grounded-ai-quickstart";
const quickstartUrl = `https://docs.fidan.dev${quickstartPath}`;

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

for (const width of [320, 390, 768, 1440]) {
  test(`compiler-grounded AI terminal stays readable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const section = page.locator("#compiler-ai");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      "Ask the compiler. Then ask your AI.",
    );
    await expect(section).toContainText(
      "Try deterministic analysis without an API key",
    );
    await expect(section).toContainText("not live runtime inspection");

    const lines = section.locator(".code-line");
    await expect(lines).toHaveCount(7);
    await expect(lines.locator(".code-prompt")).toHaveCount(5);
    const comment = lines.nth(3);
    await expect(comment).toHaveText(
      "# Optional: a configured provider is required for model-assisted explain.",
    );
    await expect(comment).toHaveClass(/code-line--comment/);
    await expect(comment).toHaveCSS("font-style", "italic");
    await expect(comment).toHaveCSS("filter", "saturate(0)");
    await expect(comment.locator(".code-prompt")).toHaveCount(0);
    const blank = lines.nth(2);
    expect((await blank.textContent())?.trim()).toBe("");
    await expect(blank.locator(".code-prompt")).toHaveCount(0);
    const firstCommand = lines.nth(0);
    await expect(firstCommand).toHaveCSS("font-style", "normal");
    await expect(firstCommand.locator(".code-prompt")).toHaveText("$");
    await expect(firstCommand.locator(".code-prompt")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    const freeCommandsEnd = await lines.nth(1).boundingBox();
    const optionalStart = await comment.boundingBox();
    const blankBounds = await blank.boundingBox();
    expect(freeCommandsEnd).not.toBeNull();
    expect(optionalStart).not.toBeNull();
    expect(blankBounds!.height).toBeGreaterThan(0);
    expect(
      optionalStart!.y - (freeCommandsEnd!.y + freeCommandsEnd!.height),
    ).toBeGreaterThanOrEqual(blankBounds!.height - 1);

    expect(
      await page.evaluate(() => ({
        root: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        viewport: innerWidth,
      })),
    ).toEqual({ root: width, body: width, viewport: width });
    expect(
      await section
        .locator("pre")
        .evaluate((pre) => pre.scrollWidth <= pre.clientWidth + 1),
    ).toBe(true);
    await expect(section.locator(".code-line__content").last()).toHaveText(
      'fidan explain test/examples/check_val.fdn --line 2 --ai "Explain this branch selection"',
    );

    await expect(page.locator("code.language-fidan")).toHaveText(
      heroSnippet.trim(),
    );
    await expect(page.locator("code.language-fidan .code-prompt")).toHaveCount(
      0,
    );
    await expect(page.locator("#install .code-prompt")).toHaveText([
      "PS>",
      "$",
    ]);
    await page.screenshot({
      path: test.info().outputPath(`home-${width}.png`),
      fullPage: true,
    });
    await section.screenshot({
      path: test.info().outputPath(`terminal-${width}.png`),
    });
  });
}

test("quickstart links lead to Fidan docs and terminal copy preserves source text", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.locator(`a[href="${quickstartUrl}"]`)).toHaveCount(2);
  for (const name of [
    "Follow the reproducible AI quickstart",
    "Compiler-grounded AI quickstart",
  ]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      quickstartUrl,
    );
  }
  await page
    .locator("#compiler-ai")
    .getByRole("button", { name: "Copy", exact: true })
    .click();
  await expect(
    page
      .locator("#compiler-ai")
      .getByRole("button", { name: "Copied!", exact: true }),
  ).toBeVisible();
  const copiedText = await page.evaluate(() => navigator.clipboard.readText());

  expect(copiedText.replace(/\r\n/g, "\n")).toBe(
    aiDemoCommands.replace(/\r\n/g, "\n"),
  );

  await page
    .locator("code.language-fidan")
    .locator(
      "xpath=ancestor::div[contains(@class, 'code-window-shell__frame')]",
    )
    .getByRole("button", { name: "Copy", exact: true })
    .click();
  expect(
    normalizeLineEndings(
      await page.evaluate(() => navigator.clipboard.readText()),
    ),
  ).toBe(normalizeLineEndings(heroSnippet.trim()));
  for (const [index, install] of installCommands.entries()) {
    await page
      .locator("#install .code-window-shell")
      .nth(index)
      .getByRole("button", { name: "Copy", exact: true })
      .click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      install.command,
    );
  }
});

test("AI quickstart supports docs-host routing, search, navigation and anchors", async ({
  page,
  request,
}) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-host": "docs.fidan.dev" });
  await page.setViewportSize({ width: 1600, height: 1000 });
  const response = await page.goto(quickstartPath);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(
    "Compiler-grounded AI quickstart — Fidan Docs",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /without an API key.*AI Analysis Helper 1\.0\.6/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    quickstartUrl,
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compiler-grounded AI quickstart",
  );
  await expect(page.locator("article")).toContainText(
    "AI Analysis Helper 1.0.6",
  );
  await expect(page.locator("article")).toContainText(
    "not sampled values, live stack frames",
  );
  await expect(page.locator("article")).toContainText(
    "the model is not guaranteed to produce a useful fix",
  );
  await expect(page.locator("article code.language-fidan").first()).toHaveText(
    heroSnippet.trim(),
  );
  await expect(
    page
      .locator("aside")
      .getByRole("link", { name: "AI quickstart", exact: true }),
  ).toHaveAttribute("href", quickstartPath);
  const anchors = await page
    .locator('article a[href^="#"]')
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")!.slice(1)),
    );
  expect(anchors).toHaveLength(6);
  for (const anchor of anchors) {
    await expect(page.locator(`[id="${anchor}"]`)).toHaveCount(1);
  }
  await page
    .getByRole("link", { name: "2. Ask the compiler, without AI", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/#2-ask-the-compiler-without-ai$/);
  await page
    .getByRole("searchbox", { name: "Search docs" })
    .fill("compiler-grounded AI quickstart");
  const searchResult = page.getByRole("link", {
    name: "Compiler-grounded AI quickstart Tools",
    exact: true,
  });
  await expect(searchResult).toHaveAttribute("href", quickstartPath);
  await searchResult.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compiler-grounded AI quickstart",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain(`<loc>${quickstartUrl}</loc>`);

  await page.goto("/tools/ai-native-tooling");
  await page
    .locator("article")
    .getByRole("link", { name: "compiler-grounded AI quickstart", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/docs${quickstartPath}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compiler-grounded AI quickstart",
  );
});

for (const width of [320, 768, 1440]) {
  test(`AI quickstart renders locally without overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(quickstartPath);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Compiler-grounded AI quickstart",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth + 1),
    ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`quickstart-${width}.png`),
      fullPage: true,
    });
  });
}
