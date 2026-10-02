import { site } from "@/lib/site";

// Char codes that must be escaped inside an inline <script>:
// `<` `>` `&` and the U+2028 / U+2029 line separators.
const JSON_LD_ESCAPE = new Set([0x3c, 0x3e, 0x26, 0x2028, 0x2029]);

/**
 * Serialize structured data for embedding in a <script> tag so dynamic values
 * (e.g. product names from the ops API) can never break out and inject markup.
 */
function serializeJsonLd(data: Record<string, unknown>): string {
  let out = "";
  for (const ch of JSON.stringify(data)) {
    const code = ch.charCodeAt(0);
    out += JSON_LD_ESCAPE.has(code)
      ? "\\u" + code.toString(16).padStart(4, "0")
      : ch;
  }
  return out;
}

/** Renders a JSON-LD script tag from a structured-data object. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        legalName: site.legalName,
        slogan: site.slogan,
        url: site.url,
        logo: `${site.url}/brand/nuvene-primary.png`,
        email: site.contact.email,
        telephone: site.contact.phones[0].tel,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.contact.address.line1}, ${site.contact.address.line2}`,
          addressLocality: site.contact.address.city,
          addressCountry: "NG",
        },
        areaServed: "NG",
        sameAs: [
          site.social.instagram,
          site.social.tiktok,
          site.social.facebook,
        ],
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: it.url,
        })),
      }}
    />
  );
}
