import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

// Release bodies are external GitHub content, unlike our reviewed docs sources.
const markdown = new Marked({ gfm: true, async: false });

export function renderReleaseMarkdown(source: string): string {
  return sanitizeHtml(markdown.parse(source) as string, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    nestingLimit: 64,
    parseStyleAttributes: false,
  });
}
