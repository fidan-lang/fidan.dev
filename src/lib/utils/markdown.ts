import { marked } from "marked";

export type TocItem = {
  id: string;
  level: number;
  text: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function collectToc(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^(##|###)\s+(.*)$/);
    if (!match) continue;
    toc.push({
      id: slugify(match[2].trim()),
      level: match[1].length,
      text: match[2].trim()
    });
  }
  return toc;
}

export function renderMarkdown(markdown: string): string {
  const renderer = new marked.Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((token) => ("text" in token ? token.text : "")).join("");
    const id = slugify(text);
    return `<h${depth} id="${id}"><a href="#${id}">${text}</a></h${depth}>`;
  };

  renderer.code = ({ text, lang }) => {
    const language = lang?.trim() || "text";
    const escapedCode = escapeHtml(text);
    return `<div class="code-frame"><div class="code-frame__meta"><span>${escapeHtml(language)}</span><button type="button" class="code-copy" data-copy="${escapeHtml(text)}">Copy</button></div><pre><code class="language-${escapeHtml(language)}">${escapedCode}</code></pre></div>`;
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
    renderer
  });

  return marked.parse(markdown) as string;
}
