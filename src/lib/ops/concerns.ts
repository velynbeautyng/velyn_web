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
    /acne|blemish|salicylic|\bbha\b|benzoyl|tea tree|oil[ -]?control|oil[ -]?free|\bpores?\b|zinc|effaclar|clarif/i,
    "acne-oily",
  ],
  [
    /dark spot|spots? fading|pigment|hydroquinone|melasma|licorice|bright|arbutin|vitamin c|\bvit\.? ?c\b|vita c|tranexamic|\btxa\b|kojic|niacin|azelaic|azealic|\btone\b|glutathione|lightening|whitening|turmeric|glow|glycolic|lactic|\baha\b|exfoliat/i,
    "dark-spots",
  ],
  [
    /sensitiv|sooth|calm|cica|centella|heartleaf|barrier|gentle|redness|relief|fragrance[ -]?free/i,
    "sensitive",
  ],
  [
    /ceramide|hyaluron|hyalu|moistur|hydrat|\bhydro\b|lotion|body oil|butter|\bdry\b|nourish|\bcream\b|replenish/i,
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

export function inferConcerns(name: string, category?: string): SkinConcern[] {
  const hay = `${name} ${category ?? ""}`;
  return RULES.filter(([re]) => re.test(hay)).map(
    ([, slug]) => bySlug.get(slug)!.label,
  );
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
