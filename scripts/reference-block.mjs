// Blank boundaries keep managed references stable under the repository Markdown formatter.
export function referenceBlock(marker, body) {
  return `<!-- ${marker}:start -->\n\n${body.trim()}\n\n<!-- ${marker}:end -->`;
}
