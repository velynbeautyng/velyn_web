/**
 * Minimal, dependency-free Markdown → HTML renderer for blog posts authored
 * in the ops admin. Deliberately small: it covers the constructs a beauty
 * brand's articles use — headings, paragraphs, bold/italic, links, images,
 * bullet & numbered lists, blockquotes, code, and horizontal rules.
 *
 * Security: all raw HTML is escaped FIRST, so the only tags in the output are
 * the ones this function emits. Author input can't inject markup or attributes
 * (quotes inside link/image URLs are escaped to entities before use).
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allow only safe URL schemes. Blocks javascript:/vbscript:/data: (etc.) that
 * could execute when a link is clicked. Input is already HTML-escaped, so a
 * blocked URL degrades to "#". Images may additionally be data:image/*.
 */
function safeUrl(url: string, allowDataImage = false): string {
  const u = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(u)) return url;
  if (u.startsWith("/") || u.startsWith("#")) return url;
  if (allowDataImage && /^data:image\//i.test(u)) return url;
  return "#";
}

/** Inline formatting. Input must already be HTML-escaped. */
function inline(s: string): string {
  // Images: ![alt](url)
  s = s.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt, url) =>
      `<img alt="${alt}" src="${safeUrl(url, true)}" loading="lazy" />`,
  );
  // Links: [text](url)
  s = s.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, text, url) =>
      `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  );
  // Bold then italic (bold first so ** isn't eaten by *)
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
  // Inline code
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

export function renderMarkdown(md: string): string {
  if (!md) return "";
  const lines = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) {
      out.push(`<p>${inline(esc(buf.join(" ")))}</p>`);
      buf.length = 0;
    }
  };

  const paragraph: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Fenced code block
    if (trimmed.startsWith("```")) {
      flushParagraph(paragraph);
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
      continue;
    }

    // Blank line → paragraph break
    if (trimmed === "") {
      flushParagraph(paragraph);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph(paragraph);
      out.push("<hr />");
      i++;
      continue;
    }

    // Heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph(paragraph);
      const level = heading[1].length;
      out.push(`<h${level}>${inline(esc(heading[2].trim()))}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote (one or more consecutive > lines)
    if (/^>\s?/.test(trimmed)) {
      flushParagraph(paragraph);
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(esc(quote.join(" ")))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      flushParagraph(paragraph);
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      out.push(
        `<ul>${items.map((it) => `<li>${inline(esc(it))}</li>`).join("")}</ul>`,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph(paragraph);
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push(
        `<ol>${items.map((it) => `<li>${inline(esc(it))}</li>`).join("")}</ol>`,
      );
      continue;
    }

    // Default: accumulate into a paragraph
    paragraph.push(trimmed);
    i++;
  }

  flushParagraph(paragraph);
  return out.join("\n");
}
