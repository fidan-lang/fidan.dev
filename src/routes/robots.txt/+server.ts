import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://fidan.dev/sitemap.xml
Sitemap: https://docs.fidan.dev/sitemap.xml
`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
};
