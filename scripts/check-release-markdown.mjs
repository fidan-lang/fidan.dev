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
