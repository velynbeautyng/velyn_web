/**
 * Brands with a bundled official logo in /public/brands/logos/.
 * Keyed by storefront brand slug (see slugify in lib/utils) → logo filename.
 *
 * To add a logo: drop the file in public/brands/logos/ and add a
 * `slug: "filename.ext"` entry here. Brands not listed fall back to the
 * elegant text tile, so partial coverage always looks intentional.
 */
const BRAND_LOGOS: Record<string, string> = {
  abbott: "abbott.png",
  acewell: "acewell.png",
  anua: "anua.jpeg",
  "advanced-clinicals": "advanced-clinicals.png",
  aveeno: "aveeno.png",
  cerave: "cerave.png",
  cosrx: "cosrx.png",
  dove: "dove.png",
  eos: "eos.png",
  facefacts: "facefacts.png",
  garnier: "garnier.png",
  jumiso: "jumiso.png",
  "la-roche-posay": "la-roche-posay.png",
  medicube: "medicube.png",
  "medix-5-5": "medix-5-5.jpeg",
  menarini: "menarini.png",
  neutrogena: "neutrogena.png",
  nivea: "nivea.png",
  olay: "olay.png",
  "palmer-s": "palmer-s.png",
  panoxyl: "panoxyl.png",
  "rohto-skin-aqua": "rohto-skin-aqua.png",
  simple: "simple.jpeg",
  "the-ordinary": "the-ordinary.png",
  vaseline: "vaseline.png",
};

/** Public path to a brand's logo, or null when none is bundled. */
export function brandLogoSrc(slug: string): string | null {
  const file = BRAND_LOGOS[slug];
  return file ? `/brands/logos/${file}` : null;
}

/** Whether a brand has a bundled logo. */
export function hasBrandLogo(slug: string): boolean {
  return slug in BRAND_LOGOS;
}
