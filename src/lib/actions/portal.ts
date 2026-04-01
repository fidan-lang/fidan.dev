export function portal(node: HTMLElement) {
  if (typeof document === "undefined") {
    return {
      destroy() {}
    };
  }

  const target = document.body;
  const originalParent = node.parentNode;
  const nextSibling = node.nextSibling;

  target.appendChild(node);

  return {
    destroy() {
      if (originalParent) {
        originalParent.insertBefore(node, nextSibling);
      } else {
        node.remove();
      }
    }
  };
}
