import assert from "node:assert/strict";
import { renderReleaseMarkdown } from "../src/lib/server/release-markdown.ts";
import { officialGitHubReleaseUrl } from "../src/lib/server/release-url.ts";
const unsafe = renderReleaseMarkdown(`
# Release
<script>alert(1)</script><svg onload="alert(1)"><script>alert(2)</script></svg>
<a href="javascript:alert(1)" onclick="alert(1)">bad</a>
<a href="jav&#x61;script:alert(1)">encoded</a>
<img src="x" onerror="alert(1)"><iframe src="https://evil.example"></iframe>
<a href="//evil.example">relative scheme</a>
[Safe link](https://github.com/fidan-lang/fidan)

~~~fidan
print("hello")
~~~
`);
assert(
  !/<(?:script|svg|iframe)|on(?:click|load|error)=|javascript:|href="\/\//i.test(
    unsafe,
  ),
);
assert(unsafe.includes("<h1>Release</h1>"));
assert(unsafe.includes('href="https://github.com/fidan-lang/fidan"'));
assert(unsafe.includes("<pre><code"));
assert.equal(renderReleaseMarkdown(""), "");
assert.equal(
  officialGitHubReleaseUrl("v1.0.16"),
  "https://github.com/fidan-lang/fidan/releases/tag/v1.0.16",
);
assert.throws(
  () => officialGitHubReleaseUrl("v1.0.16/../../attacker"),
  /invalid SemVer tag/i,
);
console.log(
  "Release Markdown: executable HTML/URLs removed; safe Markdown and release links retained.",
);

// Exercise the actual request function without framework aliases or public network.
const { readFileSync } = await import("node:fs");
const ts = (await import("typescript")).default;
const releaseSource = ts.createSourceFile(
  "releases.ts",
  readFileSync(
    new URL("../src/lib/server/releases.ts", import.meta.url),
    "utf8",
  ),
  ts.ScriptTarget.Latest,
  true,
);
const requestFunction = releaseSource.statements.find(
  (node) =>
    ts.isFunctionDeclaration(node) && node.name?.text === "fetchGitHubReleases",
);
assert(requestFunction);
const timeoutDeclaration = releaseSource.statements.find(
  (node) =>
    ts.isVariableStatement(node) &&
    node.declarationList.declarations.some(
      (declaration) =>
        declaration.name.getText(releaseSource) ===
        "RELEASE_REQUEST_TIMEOUT_MS",
    ),
);
const code = ts.transpileModule(
  [
    timeoutDeclaration?.getText(releaseSource) ?? "",
    requestFunction.getText(releaseSource),
    "return fetchGitHubReleases;",
  ].join("\n"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.None,
    },
  },
).outputText;
const requestReleases = new Function(
  "env",
  "AbortSignal",
  "GITHUB_RELEASES_API",
  "normalizeVersion",
  "normalizeGitHubRelease",
  code,
)(
  {},
  AbortSignal,
  "https://api.github.com/repos/fidan-lang/fidan/releases",
  (tag) => tag,
  (release) => release,
);
let observedSignal;
await requestReleases(async (_url, options) => {
  observedSignal = options.signal;
  assert(
    observedSignal instanceof AbortSignal,
    "Release API requests need an abort deadline",
  );
  return {
    ok: true,
    json: async () => [
      { tag_name: "v1.0.16", draft: false, prerelease: false },
    ],
  };
});
await new Promise((resolve, reject) => {
  const guard = setTimeout(
    () =>
      reject(
        new Error(
          "Release request deadline did not fire within the test budget",
        ),
      ),
    10000,
  );
  observedSignal.addEventListener(
    "abort",
    () => {
      clearTimeout(guard);
      resolve();
    },
    { once: true },
  );
});
assert.equal(observedSignal.reason.name, "TimeoutError");
console.log("Release API request deadline aborts stalled upstream work.");
