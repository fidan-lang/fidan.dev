import { type APIRequestContext, expect } from "@playwright/test";

// Follow the release selected by the actual SSR response, including its fallback.
// A separate live GitHub request can disagree with SSR or hang during an outage.
export async function displayedReleaseVersion(
  request: APIRequestContext,
): Promise<string> {
  const response = await request.get("/releases");
  expect(response.ok()).toBeTruthy();
  const version =
    /href="\/releases\/(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)"/.exec(
      await response.text(),
    )?.[1];
  expect(
    version,
    "Release index must expose a real release detail link",
  ).toBeTruthy();
  return version!;
}
