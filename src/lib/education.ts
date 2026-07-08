/**
 * Education Hub articles. Currently authored in-repo; will migrate to the ops
 * CMS module later. Each article renders at /education/[slug].
 */

export type Article = {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  /** Ordered content blocks (in-repo articles). */
  body: { heading?: string; paragraphs: string[] }[];
  /** Pre-rendered HTML (ops posts authored in markdown). Rendered instead of `body`. */
  bodyHtml?: string;
  coverImage?: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Where the article came from, lets the UI/pages adapt when needed. */
  source?: "ops" | "local";
};

export const articles: Article[] = [
  {
    slug: "how-to-read-a-skincare-label",
    title: "How to Read a Skincare Label: What Really Matters",
    tag: "Ingredient Guide",
    excerpt:
      "INCI lists look intimidating, but a few principles let you judge any formula in seconds. Here's how to read past the marketing.",
    readMinutes: 6,
    date: "2026-05-12",
    body: [
      {
        paragraphs: [
          "Every skincare label follows the same logic once you know where to look. Ingredients are listed by concentration in descending order down to about 1%, after which they can appear in any order. That single rule tells you whether a hero active is doing real work or is just present for the claim.",
        ],
      },
      {
        heading: "Start with the first five",
        paragraphs: [
          "The first five ingredients usually make up the bulk of the formula. Water, humectants like glycerin, and emollients typically lead. If an advertised active, say niacinamide or vitamin C, sits near the top, the product is likely formulated around it.",
          "When the star ingredient appears only after the fragrance and preservatives, treat the claim with caution.",
        ],
      },
      {
        heading: "Know your actives and their friends",
        paragraphs: [
          "Actives work best in the right company and at the right pH. Vitamin C prefers a low pH; niacinamide is happy across a range. Barrier ingredients, ceramides, cholesterol, fatty acids, support almost everything else and rarely cause trouble.",
        ],
      },
    ],
  },
  {
    slug: "treating-hyperpigmentation-nigerian-skin",
    title: "Treating Hyperpigmentation on Nigerian Skin Types",
    tag: "Skin Concerns",
    excerpt:
      "Dark spots and uneven tone are the most common concern we hear. A patient, sun-smart routine beats any single miracle product.",
    readMinutes: 8,
    date: "2026-04-28",
    body: [
      {
        paragraphs: [
          "Hyperpigmentation on melanin-rich skin needs a gentle, consistent approach. Aggressive actives can trigger the very inflammation that darkens skin further, so the goal is steady fading without irritation.",
        ],
      },
      {
        heading: "The non-negotiable: sunscreen",
        paragraphs: [
          "No brightening routine works without daily broad-spectrum SPF. UV exposure re-darkens spots faster than any serum can fade them. This is the single highest-impact step for even tone.",
        ],
      },
      {
        heading: "Layer tone-evening actives slowly",
        paragraphs: [
          "Alpha arbutin, niacinamide, tranexamic acid and vitamin C all target pigment through different pathways. Introduce one at a time, a few nights a week, and give each six to eight weeks before judging results.",
        ],
      },
    ],
  },
  {
    slug: "spot-a-counterfeit-skincare-product",
    title: "How to Spot a Counterfeit Skincare Product in Nigeria",
    tag: "Authenticity",
    excerpt:
      "Counterfeits have become sophisticated. Learn the checks Velyn runs on every batch, and how to protect yourself when buying elsewhere.",
    readMinutes: 5,
    date: "2026-04-10",
    body: [
      {
        paragraphs: [
          "The counterfeit skincare market is well-funded and increasingly convincing. At Velyn, authenticity is verified before a product is ever listed, but knowing the checks yourself protects you everywhere you shop.",
        ],
      },
      {
        heading: "What we verify on every batch",
        paragraphs: [
          "Printing quality and colour accuracy, holographic codes, tamper-evident seals, and unique batch codes cross-checked against the manufacturer. Genuine packaging is sharp, consistent, and correctly spelled.",
        ],
      },
      {
        heading: "Red flags when buying elsewhere",
        paragraphs: [
          "Prices dramatically below market, blurry or peeling labels, missing batch numbers, and unusual textures or scents are the clearest warning signs. When in doubt, buy from a distributor that can trace the product to its source.",
        ],
      },
    ],
  },
  {
    slug: "building-a-simple-effective-routine",
    title: "Building a Simple, Effective Routine for Beginners",
    tag: "Routines",
    excerpt:
      "You need four steps, not fourteen. A cleanser, a treatment, a moisturiser and sunscreen will take most skin a very long way.",
    readMinutes: 6,
    date: "2026-03-22",
    body: [
      {
        paragraphs: [
          "Great skin is built on consistency, not complexity. A short routine you actually follow beats an elaborate one you abandon.",
        ],
      },
      {
        heading: "The core four",
        paragraphs: [
          "Morning: gentle cleanser, optional treatment, moisturiser, sunscreen. Evening: cleanser, treatment, moisturiser. That is a complete routine for the vast majority of people.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
