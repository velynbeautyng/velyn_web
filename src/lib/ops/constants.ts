import type { SkinConcern } from "./types";
import { slugifyConcern } from "./products";

export const SKIN_CONCERNS: SkinConcern[] = [
  "Acne-Prone",
  "Hyperpigmentation",
  "Dry Skin",
  "Sensitive Skin",
  "Oily Skin",
  "Anti-Ageing",
  "All Skin Types",
];

export const CONCERN_OPTIONS = SKIN_CONCERNS.map((c) => ({
  label: c,
  slug: slugifyConcern(c),
}));
