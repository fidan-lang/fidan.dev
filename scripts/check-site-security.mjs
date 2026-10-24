import assert from "node:assert/strict";
import { test } from "node:test";
import {
  readFileSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { loadTypeScript } from "./load-typescript.mjs";
const load = (relative, overrides) =>
  loadTypeScript(new URL(relative, import.meta.url), overrides);
const urls = load("../src/lib/server/release-url.ts");
const fallback = {
  version: "1.0.16",
  date: "2026-10-07",
  title: "Fallback",
  summary: "bundled",
  highlights: [],
  installNotes: [],
  body: "bundled",
  githubUrl: urls.officialGitHubReleaseUrl("v1.0.16"),
  latest: true,
};
function releases() {
  return load("../src/lib/server/releases.ts", {
    "$env/dynamic/private": {
      env: { GITHUB_RELEASES_TOKEN: "fixture-not-a-real-token" },
    },
    "$lib/content/releases": {
      releases: [fallback],
      pickLatestRelease: (items) => items.find((x) => x.latest) ?? items[0],
    },
    "$lib/server/release-url": urls,
    "@sveltejs/kit": {
      error: (status, message) => Object.assign(new Error(message), { status }),
    },
  });
}
const release = (version, extra = {}) => ({
  tag_name: version,
  name: null,
  body: "# Notes",
  draft: false,
  prerelease: false,
  published_at: "2026-10-07T00:00:00Z",
  ...extra,
});
const response = (value, status = 200) =>
  new Response(JSON.stringify(value), { status });
const fails = (status) => (error) => error.status === status;
test("release 31 uses exact tag lookup, independent of bounded catalog", async () => {
  const api = releases();
  let requests = [];
  const all = Array.from({ length: 35 }, (_, i) => release(`v1.0.${35 - i}`));
  const fetch = async (url, options) => {
    requests.push(url);
    assert.equal(options.redirect, "error");
    return response(url.includes("/tags/") ? all[30] : all.slice(0, 30));
  };
  assert.equal((await api.getReleaseNotes(fetch)).length, 30);
  assert.equal(
    (await api.getReleaseByVersion(fetch, "1.0.5")).version,
    "1.0.5",
  );
  assert(requests.at(-1).endsWith("/tags/v1.0.5"));
  assert.equal(requests.length, 2);
});
test("v and non-v inputs canonicalize; repositories with bare tags work", async () => {
  for (const version of ["v1.0.1", "1.0.1"]) {
    const api = releases();
    const calls = [];
    const fetch = async (url) => {
      calls.push(url);
      return url.endsWith("/tags/v1.0.1")
        ? response({}, 404)
        : response(release("1.0.1"));
    };
    assert.equal(
      (await api.getReleaseByVersion(fetch, version)).version,
      "1.0.1",
    );
    assert.equal(calls.length, 2);
    await api.getReleaseByVersion(fetch, version);
    assert.equal(calls.length, 2, "cache hit");
  }
});
test("nonexistent and draft releases return real 404", async () => {
  await assert.rejects(
    releases().getReleaseByVersion(async () => response({}, 404), "1.0.999"),
    fails(404),
  );
  await assert.rejects(
    releases().getReleaseByVersion(
      async () => response(release("v1.0.999", { draft: true })),
      "1.0.999",
    ),
    fails(404),
  );
});
test("malformed tags cannot cause upstream requests or links", async () => {
  for (const tag of [
    "v1.0.0/../../evil",
    "1.0.0%2f..",
    "1.0.0\n",
    "1.0.0\u0000",
    "https://evil.test",
    "1.0.0-01",
  ]) {
    assert.throws(() => urls.officialGitHubReleaseUrl(tag));
    await assert.rejects(
      releases().getReleaseByVersion(async () => {
        throw new Error("must not fetch");
      }, tag),
      fails(404),
    );
  }
});
test("upstream 403/429 and network errors use known fallback, not false 404", async () => {
  for (const status of [403, 429, 503]) {
    assert.equal(
      (
        await releases().getReleaseByVersion(
          async () => response({}, status),
          "1.0.16",
        )
      ).body,
      "bundled",
    );
    await assert.rejects(
      releases().getReleaseByVersion(
        async () => response({}, status),
        "1.0.999",
      ),
      fails(503),
    );
  }
  assert.equal(
    (
      await releases().getReleaseByVersion(async () => {
        throw new DOMException("timeout", "TimeoutError");
      }, "1.0.16")
    ).body,
    "bundled",
  );
});
test("malformed upstream JSON or mismatched identity never renders as valid release", async () => {
  for (const fetch of [
    async () => new Response("{invalid"),
    async () => response({}),
    async () => response(release("v9.0.0")),
  ]) {
    assert.equal(
      (await releases().getReleaseByVersion(fetch, "1.0.16")).body,
      "bundled",
    );
    await assert.rejects(
      releases().getReleaseByVersion(fetch, "1.0.999"),
      fails(503),
    );
  }
  assert.equal(
    (await releases().getReleaseNotes(async () => response({}))).at(0).body,
    "bundled",
  );
});
test("stable latest ignores drafts/prereleases; prerelease detail is available", async () => {
  const api = releases();
  const notes = await api.getReleaseNotes(async () =>
    response([
      release("v2.0.0-rc.1", { prerelease: true }),
      release("v9.0.0", { draft: true }),
      release("v1.0.17"),
    ]),
  );
  assert.equal(notes.length, 2);
  assert.equal(notes.find((x) => x.latest).version, "1.0.17");
  assert.equal(
    (
      await api.getReleaseByVersion(
        async () => response(release("v2.0.0-rc.1", { prerelease: true })),
        "2.0.0-rc.1",
      )
    ).latest,
    false,
  );
});
test("request deadlines abort real stalled work; redirects are not followed", async () => {
  const api = releases();
  let observed;
  const fetch = (_url, options) =>
    new Promise((_, reject) => {
      observed = options;
      options.signal.addEventListener(
        "abort",
        () => reject(options.signal.reason),
        { once: true },
      );
    });
  assert.equal(
    (await api.getReleaseByVersion(fetch, "1.0.16")).body,
    "bundled",
  );
  assert.equal(observed.redirect, "error");
  assert.equal(observed.signal.reason.name, "TimeoutError");
});
test("detail response body and cache have bounded costs", async () => {
  const api = releases();
  let count = 0;
  await api.getReleaseByVersion(async () => {
    count++;
    return response(release("v1.0.1"));
  }, "1.0.1");
  for (let i = 2; i < 75; i++)
    await api.getReleaseByVersion(
      async () => response(release(`v1.0.${i}`)),
      `1.0.${i}`,
    );
  await api.getReleaseByVersion(async () => {
    count++;
    return response(release("v1.0.1"));
  }, "1.0.1");
  assert.equal(count, 2, "bounded eviction");
  assert.equal(
    (
      await releases().getReleaseNotes(async () =>
        response([{ ...release("v1.0.1"), body: "x".repeat(3 * 1024 * 1024) }]),
      )
    )[0].body,
    "bundled",
  );
});
test("documentation block and inline Markdown remove executable HTML and URLs", () => {
  const docs = load("../src/lib/utils/markdown.ts");
  const fixture =
    '# <img src=x onerror=alert(1)>\n<script>alert(1)</script><svg onload=alert(1)><script>alert(2)</script></svg>\n<a href="jav&#x61;script:alert(1)" onclick="alert(1)">bad</a>\n<img src="data:image/svg+xml,evil" onerror="alert(1)">\n[bad](javascript:alert(1))\n[good](/docs/getting-started)';
  for (const html of [
    docs.renderMarkdown(fixture),
    docs.renderInlineMarkdown(fixture),
  ]) {
    assert(
      !/<(?:script|svg|iframe)|on(?:click|load|error)=|(?:href|src)="(?:javascript:|data:)/i.test(
        html,
      ),
      html,
    );
    assert(html.includes('href="/docs/getting-started"'));
  }
});
test("docs code frames, copy data, callouts, tabs and inline formatting survive", () => {
  const docs = load("../src/lib/utils/markdown.ts");
  const html = docs.renderMarkdown(
    '## Heading\n\n```fidan\nprint("<safe>")\n```\n\n:::note Read this\n**Safe** [link](/docs)\n:::\n\n:::tabs\n@tab First\nHello\n@tab Second\nWorld\n:::',
  );
  for (const expected of [
    'id="heading"',
    "code-copy",
    "data-copy=",
    "&lt;safe&gt;",
    "doc-callout",
    "<svg",
    'role="tab"',
    "<strong>Safe</strong>",
  ])
    assert(html.includes(expected), expected);
  assert.equal(docs.renderInlineMarkdown("**bold**"), "<strong>bold</strong>");
});

test("non-success release responses release their body before fallback", async () => {
  for (const status of [404, 429]) {
    let cancellations = 0;
    const fetch = async () =>
      new Response(
        new ReadableStream({
          cancel() {
            cancellations++;
          },
        }),
        { status },
      );
    if (status === 404)
      await assert.rejects(
        releases().getReleaseByVersion(fetch, "1.0.999"),
        fails(404),
      );
    else
      await assert.rejects(
        releases().getReleaseByVersion(fetch, "1.0.999"),
        fails(503),
      );
    assert.equal(cancellations, status === 404 ? 2 : 1);
  }
});

test("bundled stable fallback reflects the released hotfix rather than candidate APIs", () => {
  const content = load("../src/lib/content/releases.ts");
  assert.equal(content.latestRelease.version, "1.0.16");
  assert.equal(content.releases.filter((item) => item.latest).length, 1);
  assert.match(
    content.latestRelease.summary,
    /without language or runtime feature changes/,
  );
  assert.match(
    content.latestRelease.body,
    /not provided by the published 1.0.16 binary/,
  );
});

test("release deadline bounds a stalled response body even when fetch wrappers ignore abort", async () => {
  let stream;
  let cancelled = 0;
  const body = new ReadableStream({
    start(controller) {
      stream = controller;
      controller.enqueue(new TextEncoder().encode("["));
    },
    cancel() {
      cancelled++;
    },
  });
  let safety;
  try {
    const result = await Promise.race([
      releases().getReleaseNotes(async () => new Response(body)),
      new Promise((_, reject) => {
        safety = setTimeout(
          () =>
            reject(new Error("response body exceeded its release deadline")),
          6500,
        );
      }),
    ]);
    assert.equal(result[0].version, "1.0.16");
    assert.equal(cancelled, 1, "timed out body must be cancelled");
  } finally {
    clearTimeout(safety);
    if (!cancelled) stream.close();
  }
});

test(
  "patched local Wrangler/Miniflare proxy preserves binding round trips",
  { timeout: 30000 },
  async () => {
    const { getPlatformProxy } = await import("wrangler");
    const parent = path.resolve("target");
    mkdirSync(parent, { recursive: true });
    const root = mkdtempSync(path.join(parent, "platform-proxy-"));
    const configPath = path.join(root, "wrangler.toml");
    writeFileSync(
      configPath,
      'name = "local-dependency-probe"\ncompatibility_date = "2026-04-01"\n[[kv_namespaces]]\nbinding = "PROBE"\nid = "00000000000000000000000000000000"\n',
    );
    let proxy;
    try {
      proxy = await getPlatformProxy({
        configPath,
        persist: false,
        remoteBindings: false,
        envFiles: [],
      });
      await proxy.env.PROBE.put("fixture", "round trip");
      assert.equal(await proxy.env.PROBE.get("fixture"), "round trip");
      await proxy.env.PROBE.delete("fixture");
      assert.equal(await proxy.env.PROBE.get("fixture"), null);
    } finally {
      await proxy?.dispose();
      rmSync(root, { recursive: true, force: true });
    }
  },
);
