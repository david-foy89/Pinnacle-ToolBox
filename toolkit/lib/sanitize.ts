const BLOCKED_TAGS = new Set([
  "SCRIPT",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "LINK",
  "STYLE",
  "FORM",
  "META",
  "BASE",
]);

export function sanitizeHtml(html: string): string {
  if (typeof document === "undefined") return html;

  const template = document.createElement("template");
  template.innerHTML = html;

  const walk = (node: Element) => {
    if (BLOCKED_TAGS.has(node.tagName)) {
      node.remove();
      return;
    }

    for (const attr of [...node.attributes]) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();
      if (name.startsWith("on") || name === "srcdoc") {
        node.removeAttribute(attr.name);
        continue;
      }
      if ((name === "href" || name === "src" || name === "xlink:href") && /^javascript:/i.test(value)) {
        node.removeAttribute(attr.name);
      }
    }

    for (const child of [...node.children]) {
      walk(child);
    }
  };

  for (const child of [...template.content.children]) {
    walk(child);
  }

  return template.innerHTML;
}
