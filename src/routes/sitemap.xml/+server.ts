import type { RequestHandler } from "./$types";
import { docs } from "$lib/content/docs";
import { releases } from "$lib/content/releases";

export const GET: RequestHandler = () => {
  const base = "https://fidan.dev";
  const docsBase = "https://docs.fidan.dev";

  const urls = [
    `${base}/`,
    `${base}/releases`,
    ...releases.map((release) => `${base}/releases/${release.version}`),
    `${docsBase}/`,
    ...docs.map((page) => `${docsBase}/${page.slug.join("/")}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
};
