/**
 * The five skin concerns from the Nuvene brand charter. ops has no concern
 * field, so concerns are inferred from product names and categories.
 */

export const CONCERNS = [
  { slug: "acne-oily", label: "Acne & oily skin", short: "Acne & oily" },
  { slug: "dryness", label: "Dryness", short: "Dryness" },
  { slug: "dark-spots", label: "Dark spots & uneven tone", short: "Dark spots" },
  { slug: "sensitive", label: "Sensitive skin", short: "Sensitive" },
  { slug: "sun", label: "Sun protection", short: "Sun protection" },
] as const;

export type ConcernSlug = (typeof CONCERNS)[number]["slug"];
export type SkinConcern = (typeof CONCERNS)[number]["label"];

// Checked in this order and the first hit becomes the card's concern pill,
// so narrow signals (SPF, acne actives) come before broad ones (any lotion).
const RULES: [RegExp, ConcernSlug][] = [
  [/\bspf\b|sunscreen|\buv\b|\bsun\b/i, "sun"],
  [
    /acne|blemish|salicylic|\bsa\b|\bbha\b|benzoyl|tea tree|oil[ -]?control|oil[ -]?free|\bpores?\b|zinc|effaclar|clarif|succinic|retino|retinal|low ph/i,
    "acne-oily",
  ],
  [
    /dark spot|spots? fading|pigment|hydroquinone|melasma|licorice|bright|arbutin|vitamin c|\bvit\.? ?c\b|vita c|tranexamic|\btxa\b|kojic|niacin|\bb3\b|azelaic|azealic|\btone\b|glutathione|lightening|whitening|turmeric|glow|glycolic|lactic|\baha\b|exfoliat|retino|retinal|bakuchiol|caffeine|\brice\b|renewal|peeling|rough/i,
    "dark-spots",
  ],
  [
    /sensitiv|sooth|calm|cica|centella|heartleaf|barrier|gentle|redness|relief|fragrance[ -]?free|micellar|aloe|cucumber|feminine|\bph\b|kind to skin|soap[ -]?free|cotton|bakuchiol/i,
    "sensitive",
  ],
  [
    /ceramide|hyaluron|hyalu|moistur|\bmoist\b|hydrat|\bhydro\b|lotion|body oil|butter|\bdry\b|nourish|\bcream\b|replenish|peptide|collagen|snail|mucin|body wash|scrub|coconut|argan|bamboo|shea|avocado|firming|repair/i,
    "dryness",
  ],
];

const bySlug = new Map<string, (typeof CONCERNS)[number]>(
  CONCERNS.map((c) => [c.slug, c]),
);
const byLabel = new Map<string, (typeof CONCERNS)[number]>(
  CONCERNS.map((c) => [c.label, c]),
);

const LEGACY_SLUGS: Record<string, ConcernSlug> = {
  "acne-prone": "acne-oily",
  "oily-skin": "acne-oily",
  hyperpigmentation: "dark-spots",
  "dry-skin": "dryness",
  "sensitive-skin": "sensitive",
};

// When no keyword matches, the product's category decides, so a new product
// added in ops always lands under at least one concern filter.
const CATEGORY_FALLBACK: Record<string, ConcernSlug> = {
  sunscreens: "sun",
  moisturisers: "dryness",
  "body lotions": "dryness",
  "body creams": "dryness",
  "body oils": "dryness",
  "body washes": "dryness",
  "body scrubs": "dryness",
  "hand creams": "dryness",
  "face masks": "dryness",
  "bar soaps": "dryness",
  cleansers: "sensitive",
  toners: "sensitive",
  "wipes and pads": "sensitive",
  "feminine care": "sensitive",
  serums: "dark-spots",
  exfoliators: "dark-spots",
  "toner pads": "dark-spots",
};

export function inferConcerns(name: string, category?: string): SkinConcern[] {
  const hay = `${name} ${category ?? ""}`;
  const found = RULES.filter(([re]) => re.test(hay)).map(
    ([, slug]) => bySlug.get(slug)!.label,
  );
  if (found.length > 0) return found;
  const fallback = category ? CATEGORY_FALLBACK[category.trim().toLowerCase()] : undefined;
  return fallback ? [bySlug.get(fallback)!.label] : [];
}

export function concernSlug(label: SkinConcern): ConcernSlug {
  return byLabel.get(label)!.slug;
}

export function concernShort(label: SkinConcern): string {
  return byLabel.get(label)!.short;
}

export function resolveConcernSlug(input?: string | null): ConcernSlug | undefined {
  if (!input) return undefined;
  const key = input.toLowerCase();
  if (bySlug.has(key)) return key as ConcernSlug;
  return LEGACY_SLUGS[key];
}
