import { marked } from "marked";

export type TocItem = {
  id: string;
  level: number;
  text: string;
};

type CalloutKind = "note" | "tip" | "warning" | "success";

let tabsetCounter = 0;

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

function getCalloutIcon(kind: CalloutKind): string {
  const baseClass = "doc-callout__icon";

  switch (kind) {
    case "note":
      return `<svg class="${baseClass}" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 5.75a.75.75 0 0 1 .75.75v3.25a.75.75 0 0 1-1.5 0V6.5a.75.75 0 0 1 .75-.75Z" fill="currentColor"/><path d="M10 12.5a.875.875 0 1 0 0 1.75.875.875 0 0 0 0-1.75Z" fill="currentColor"/><path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" fill="currentColor"/></svg>`;
    case "tip":
      return `<svg class="${baseClass}" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.75a5.75 5.75 0 0 0-3.8 10.07c.5.44.82 1.07.89 1.73h5.82c.07-.66.4-1.29.89-1.73A5.75 5.75 0 0 0 10 2.75Zm-1.9 12.75h3.8a1.9 1.9 0 0 1-3.8 0Zm1.9-11.25a4.25 4.25 0 0 1 2.8 7.43 4.72 4.72 0 0 0-1.32 1.82H8.52a4.72 4.72 0 0 0-1.32-1.82A4.25 4.25 0 0 1 10 4.25Z" fill="currentColor"/></svg>`;
    case "warning":
      return `<svg class="${baseClass}" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M9.33 3.56a.77.77 0 0 1 1.34 0l6.01 10.76A.77.77 0 0 1 16 15.5H4a.77.77 0 0 1-.67-1.18L9.33 3.56Zm.67 2.1L5.31 14h9.38L10 5.66Zm0 2.09a.75.75 0 0 1 .75.75v2.75a.75.75 0 0 1-1.5 0V8.5a.75.75 0 0 1 .75-.75Zm0 5.5a.875.875 0 1 0 0 1.75.875.875 0 0 0 0-1.75Z" fill="currentColor"/></svg>`;
    case "success":
      return `<svg class="${baseClass}" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" fill="currentColor"/><path d="M12.98 7.97a.75.75 0 1 1 1.04 1.08l-4 3.84a.75.75 0 0 1-1.04 0L6.96 10.9A.75.75 0 0 1 8 9.82l1.5 1.44 3.48-3.29Z" fill="currentColor"/></svg>`;
  }
}

function getPromptForLanguage(language: string): string | null {
  const normalized = language.trim().toLowerCase();

  if (["bash", "sh", "shell", "zsh"].includes(normalized)) {
    return "$";
  }

  if (["powershell", "pwsh", "ps1", "ps"].includes(normalized)) {
    return "PS>";
  }

  return null;
}

function renderPromptedCode(text: string, language: string, prompt: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (text.endsWith("\n") && lines.at(-1) === "") {
    lines.pop();
  }

  const content = lines
    .map((line) => {
      const lineContent = line.length > 0 ? escapeHtml(line) : "&nbsp;";
      return `<span class="code-line"><span class="code-prompt" aria-hidden="true">${escapeHtml(prompt)}</span><span class="code-line__content">${lineContent}</span></span>`;
    })
    .join("\n");

  return `<code class="language-${escapeHtml(language)} code-block--prompted">${content}</code>`;
}

function createRenderer() {
  const renderer = new marked.Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((token) => ("text" in token ? token.text : "")).join("");
    const id = slugify(text);
    return `<h${depth} id="${id}"><a href="#${id}">${text}</a></h${depth}>`;
  };

  renderer.code = ({ text, lang }) => {
    const language = lang?.trim() || "text";
    const prompt = getPromptForLanguage(language);
    const escapedCode = escapeHtml(text);
    const codeHtml = prompt
      ? renderPromptedCode(text, language, prompt)
      : `<code class="language-${escapeHtml(language)}">${escapedCode}</code>`;
    const promptedClass = prompt ? " code-frame--prompted" : "";
    return `<div class="code-frame${promptedClass}"><div class="code-frame__meta"><span>${escapeHtml(language)}</span><button type="button" class="code-copy" data-copy="${escapeHtml(text)}">Copy</button></div><pre>${codeHtml}</pre></div>`;
  };

  renderer.image = ({ href, text, title }) => {
    const caption = title || text || "";
    return `<figure class="doc-figure"><img src="${escapeHtml(href)}" alt="${escapeHtml(text || caption)}" loading="lazy" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
  };

  return renderer;
}

function renderPlainMarkdown(markdown: string): string {
  marked.setOptions({
    gfm: true,
    breaks: false,
    renderer: createRenderer()
  });

  return marked.parse(markdown) as string;
}

function renderCallout(kind: CalloutKind, title: string | undefined, body: string) {
  const label =
    title?.trim() ||
    ({
      note: "Note",
      tip: "Tip",
      warning: "Warning",
      success: "Success"
    } satisfies Record<CalloutKind, string>)[kind];

  return `<div class="doc-callout doc-callout--${kind}"><div class="doc-callout__header"><span class="doc-callout__header-main">${getCalloutIcon(kind)}<span>${escapeHtml(label)}</span></span></div><div class="doc-callout__body">${renderRichMarkdown(body)}</div></div>`;
}

function renderTabs(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const tabs: Array<{ label: string; content: string }> = [];

  let currentLabel: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^@tab\s+(.+)$/);
    if (match) {
      if (currentLabel) {
        tabs.push({ label: currentLabel, content: currentLines.join("\n").trim() });
      }
      currentLabel = match[1].trim();
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }

  if (currentLabel) {
    tabs.push({ label: currentLabel, content: currentLines.join("\n").trim() });
  }

  if (tabs.length === 0) {
    return renderPlainMarkdown(markdown);
  }

  const tabsetId = `tabset-${++tabsetCounter}`;

  const triggers = tabs
    .map(
      (tab, index) =>
        `<button type="button" class="doc-tabs__trigger${index === 0 ? " is-active" : ""}" role="tab" aria-selected="${index === 0 ? "true" : "false"}" aria-controls="${tabsetId}-panel-${index}" id="${tabsetId}-tab-${index}" data-tab-trigger data-tabset-id="${tabsetId}" data-tab-index="${index}">${escapeHtml(tab.label)}</button>`
    )
    .join("");

  const panels = tabs
    .map(
      (tab, index) =>
        `<div class="doc-tabs__panel${index === 0 ? " is-active" : ""}" role="tabpanel" id="${tabsetId}-panel-${index}" aria-labelledby="${tabsetId}-tab-${index}" ${index === 0 ? "" : "hidden"}>${renderRichMarkdown(tab.content)}</div>`
    )
    .join("");

  return `<div class="doc-tabs" data-tabset="${tabsetId}"><div class="doc-tabs__list" role="tablist" aria-label="Documentation tabs">${triggers}</div><div class="doc-tabs__panels">${panels}</div></div>`;
}

function renderRichMarkdown(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const chunks: string[] = [];
  let buffer: string[] = [];

  const flushBuffer = () => {
    const raw = buffer.join("\n").trim();
    if (raw) {
      chunks.push(renderPlainMarkdown(raw));
    }
    buffer = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const calloutMatch = line.match(/^:::(note|tip|warning|success)\s*(.*)$/);
    if (calloutMatch) {
      flushBuffer();

      const kind = calloutMatch[1] as CalloutKind;
      const title = calloutMatch[2]?.trim();
      const inner: string[] = [];
      index += 1;
      while (index < lines.length && lines[index] !== ":::") {
        inner.push(lines[index]);
        index += 1;
      }
      chunks.push(renderCallout(kind, title, inner.join("\n").trim()));
      continue;
    }

    if (line.trim() === ":::tabs") {
      flushBuffer();
      const inner: string[] = [];
      index += 1;
      while (index < lines.length && lines[index] !== ":::") {
        inner.push(lines[index]);
        index += 1;
      }
      chunks.push(renderTabs(inner.join("\n").trim()));
      continue;
    }

    buffer.push(line);
  }

  flushBuffer();
  return chunks.join("\n");
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
  return renderRichMarkdown(markdown);
}
