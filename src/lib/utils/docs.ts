import { docs, type DocPage, type DocSection } from "$lib/content/docs";
import { collectToc } from "$lib/utils/markdown";

export type SidebarGroup = {
  section: DocSection;
  label: string;
  pages: DocPage[];
};

const sectionLabels: Record<DocSection, string> = {
  "getting-started": "Getting Started",
  language: "Language",
  stdlib: "Stdlib",
  tools: "Tools",
  toolchains: "Toolchains",
  dal: "Dal",
  reference: "Reference",
};

export const docsBySection: SidebarGroup[] = Object.entries(
  docs.reduce<Record<string, DocPage[]>>((groups, page) => {
    groups[page.section] ??= [];
    groups[page.section].push(page);
    return groups;
  }, {}),
)
  .map(([section, pages]) => ({
    section: section as DocSection,
    label: sectionLabels[section as DocSection],
    pages: [...pages].sort((a, b) => a.order - b.order),
  }))
  .sort((a, b) => a.pages[0].order - b.pages[0].order);

export function docsHomeCards() {
  return docsBySection.map((group) => ({
    section: group.section,
    label: group.label,
    description: group.pages[0]?.summary ?? "",
    href: `/${group.pages[0]?.slug.join("/")}`,
  }));
}

export function findDocBySlug(slug: string[]): DocPage | undefined {
  return docs.find((page) => page.slug.join("/") === slug.join("/"));
}

export function flattenDocs(): DocPage[] {
  return docsBySection.flatMap((group) => group.pages);
}

export function getDocNeighbors(slug: string[]) {
  const flat = flattenDocs();
  const currentIndex = flat.findIndex(
    (page) => page.slug.join("/") === slug.join("/"),
  );
  return {
    previous: currentIndex > 0 ? flat[currentIndex - 1] : undefined,
    next:
      currentIndex >= 0 && currentIndex < flat.length - 1
        ? flat[currentIndex + 1]
        : undefined,
  };
}

export function docsSearchIndex() {
  return flattenDocs().map((page) => ({
    href: `/${page.slug.join("/")}`,
    title: page.title,
    description: page.description,
    section: sectionLabels[page.section],
    tokens: collectToc(page.markdown).map((item) => item.text),
  }));
}

function validateDocs() {
  const seen = new Set<string>();
  for (const page of docs) {
    const key = page.slug.join("/");
    if (seen.has(key)) {
      throw new Error(`Duplicate docs slug detected: ${key}`);
    }
    seen.add(key);
  }

  for (const group of docsBySection) {
    const first = group.pages[0];
    if (!first || first.slug[0] !== group.section) {
      throw new Error(
        `Docs section ${group.section} must start with an overview page at /${group.section}`,
      );
    }
  }
}

validateDocs();
