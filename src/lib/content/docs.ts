export type DocSection =
  | "getting-started"
  | "language"
  | "stdlib"
  | "tools"
  | "editors"
  | "toolchains"
  | "dal"
  | "reference";

export type DocPage = {
  slug: string[];
  section: DocSection;
  order: number;
  title: string;
  sidebarLabel: string;
  description: string;
  summary: string;
  markdown: string;
  sourcePath: string;
};

const DOC_SECTIONS: DocSection[] = [
  "getting-started",
  "language",
  "stdlib",
  "tools",
  "editors",
  "toolchains",
  "dal",
  "reference",
];

const rawDocs = import.meta.glob("/src/content/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(raw: string, sourcePath: string) {
  if (!raw.startsWith("---")) {
    throw new Error(`Docs file is missing frontmatter: ${sourcePath}`);
  }

  const normalized = raw.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  if (lines[0] !== "---") {
    throw new Error(`Docs file has invalid frontmatter start: ${sourcePath}`);
  }

  const endIndex = lines.indexOf("---", 1);
  if (endIndex === -1) {
    throw new Error(`Docs file has unclosed frontmatter: ${sourcePath}`);
  }

  const fields = new Map<string, string>();
  for (const line of lines.slice(1, endIndex)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) {
      throw new Error(
        `Docs frontmatter line is invalid in ${sourcePath}: ${trimmed}`,
      );
    }
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1);
    fields.set(key, stripQuotes(value));
  }

  return {
    fields,
    body: lines
      .slice(endIndex + 1)
      .join("\n")
      .trim(),
  };
}

function toSlug(sourcePath: string) {
  const relative = sourcePath
    .replace(/^\/src\/content\/docs\//, "")
    .replace(/\.md$/, "");
  const parts = relative.split("/").filter(Boolean);
  if (parts[parts.length - 1] === "index") {
    parts.pop();
  }
  if (parts.length === 0) {
    throw new Error(
      `Docs file must not resolve to an empty slug: ${sourcePath}`,
    );
  }
  return parts;
}

function parseDoc(sourcePath: string, raw: string): DocPage {
  const slug = toSlug(sourcePath);
  const section = slug[0] as DocSection;
  if (!DOC_SECTIONS.includes(section)) {
    throw new Error(`Unknown docs section '${slug[0]}' from ${sourcePath}`);
  }

  const { fields, body } = parseFrontmatter(raw, sourcePath);
  const title = fields.get("title");
  const description = fields.get("description");
  const summary = fields.get("summary");
  const orderRaw = fields.get("order");
  const sidebarLabel = fields.get("sidebarLabel") ?? title;

  if (!title || !description || !summary || !orderRaw || !sidebarLabel) {
    throw new Error(
      `Docs file is missing required frontmatter fields: ${sourcePath}`,
    );
  }

  const order = Number(orderRaw);
  if (!Number.isFinite(order)) {
    throw new Error(
      `Docs file has invalid numeric order '${orderRaw}': ${sourcePath}`,
    );
  }

  return {
    slug,
    section,
    order,
    title,
    sidebarLabel,
    description,
    summary,
    markdown: body,
    sourcePath,
  };
}

export const docs: DocPage[] = Object.entries(rawDocs)
  .map(([sourcePath, raw]) => parseDoc(sourcePath, raw))
  .sort((left, right) => {
    if (left.section !== right.section) {
      return (
        DOC_SECTIONS.indexOf(left.section) - DOC_SECTIONS.indexOf(right.section)
      );
    }
    if (left.order !== right.order) {
      return left.order - right.order;
    }
    return left.slug.join("/").localeCompare(right.slug.join("/"));
  });
