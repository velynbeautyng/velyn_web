/**
 * In-repo Education Hub articles. These are the fallback: once ops has at
 * least one published post, the hub reads from ops instead (src/lib/ops/blog.ts).
 * Each article renders at /education/[slug].
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
    tag: "Sourcing",
    excerpt:
      "Fakes have become convincing. Here are the warning signs you can check yourself, and what we do to keep the risk off you.",
    readMinutes: 5,
    date: "2026-04-10",
    body: [
      {
        paragraphs: [
          "Counterfeit skincare is well funded and increasingly convincing. Knowing a few checks yourself protects you wherever you shop.",
        ],
      },
      {
        heading: "Checks you can do yourself",
        paragraphs: [
          "Look at the printing: genuine packaging is sharp, evenly coloured and correctly spelled. Find the batch number and expiry date and make sure they match on the box and the product. Some brands, COSRX among them, offer an online batch checker, so use it when one exists.",
        ],
      },
      {
        heading: "Red flags",
        paragraphs: [
          "Prices far below what other sellers charge, blurry or peeling labels, missing batch numbers, broken seals, and a texture or scent that is different from what you know are the clearest warning signs.",
        ],
      },
      {
        heading: "What we do",
        paragraphs: [
          "We buy only through distributors and suppliers we can name, and we tell you which one a product came from. Where a brand offers a checker, we run it with you. If a product you bought from us is ever confirmed counterfeit, we replace it or refund you.",
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
