/**
 * Brands with a bundled official logo in /public/brands/logos/<slug>.png.
 * The slug is the storefront brand slug (see slugify in lib/utils).
 *
 * To add a logo: drop `<slug>.png` (transparent, ~500px wide) into
 * public/brands/logos/ and add its slug here. Brands not listed fall back to
 * the elegant text tile — so partial coverage always looks intentional.
 */
const BRAND_LOGOS = new Set<string>([
  "abbott",
  "aveeno",
  "cerave",
  "garnier",
  "neutrogena",
  "nivea",
  "olay",
  "rohto-skin-aqua",
  "vaseline",
]);

/** Public path to a brand's logo, or null when none is bundled. */
export function brandLogoSrc(slug: string): string | null {
  return BRAND_LOGOS.has(slug) ? `/brands/logos/${slug}.png` : null;
}

/** Whether a brand has a bundled logo. */
export function hasBrandLogo(slug: string): boolean {
  return BRAND_LOGOS.has(slug);
}
