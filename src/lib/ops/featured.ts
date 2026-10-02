/**
 * ops has no "featured" flag, so the storefront picks one product per brand,
 * leading with the established names the brand charter puts up front.
 */

export const FEATURED_BRANDS = [
  "cerave",
  "the-ordinary",
  "cosrx",
  "anua",
  "la-roche-posay",
  "medicube",
  "dove",
  "neutrogena",
];

export function pickFeatured(
  products: { id: string; brandSlug: string }[],
  limit: number,
): string[] {
  const rank = (slug: string) => {
    const i = FEATURED_BRANDS.indexOf(slug);
    return i === -1 ? FEATURED_BRANDS.length : i;
  };
  const firstPerBrand = new Map<string, string>();
  for (const p of products) {
    if (p.brandSlug && !firstPerBrand.has(p.brandSlug)) firstPerBrand.set(p.brandSlug, p.id);
  }
  // Array.prototype.sort is stable, so brands outside the list keep catalogue order.
  return [...firstPerBrand.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .slice(0, limit)
    .map(([, id]) => id);
}
