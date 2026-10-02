/**
 * Sanitize + tidy the product description HTML coming from ops (imported from
 * WooCommerce). Descriptions carry real structure (<h4>Benefits</h4>,
 * <h4>Key Ingredients</h4>, <h4>How to Use</h4> etc.) that we want to render
 * as proper sub-headings instead of one flat blob.
 *
 * Security: only a small allowlist of structural tags survives; ALL attributes
 * are stripped (except a scheme-checked href on links) and <script>/<style>
 * are removed outright. So the output is safe to inject.
 */

const ALLOWED = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
  "br",
]);

function safeHref(raw: string): string {
  const u = raw.trim();
  return /^(https?:|mailto:|tel:|\/|#)/i.test(u) ? u : "#";
}

export function cleanProductHtml(input: string): string {
  if (!input) return "";
  let html = input;

  // Drop script/style blocks entirely (content included).
  html = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Remove the redundant WooCommerce-appended "How to use:" paragraph; the
  // structured <h4>How to Use</h4> section already covers it.
  html = html.replace(
    /<p>\s*<strong>\s*how to use:\s*<\/strong>[\s\S]*?<\/p>/gi,
    "",
  );

  // Normalise every tag: keep allowlisted structural tags (attributes stripped),
  // convert <h1> to <h3>, keep scheme-checked links, drop everything else while
  // preserving its inner text.
  html = html.replace(
    /<(\/?)([a-zA-Z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
    (_m, slash: string, tagRaw: string, attrs: string) => {
      let tag = tagRaw.toLowerCase();
      if (tag === "h1") tag = "h3";

      if (tag === "a") {
        if (slash) return "</a>";
        const href = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
        const url = safeHref(href?.[2] ?? href?.[3] ?? "");
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">`;
      }

      if (!ALLOWED.has(tag)) return "";
      return slash ? `</${tag}>` : `<${tag}>`;
    },
  );

  // Tidy whitespace and drop empty paragraphs.
  html = html
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();

  return html;
}
