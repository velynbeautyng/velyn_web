# Nuvene storefront rebrand: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Velyn storefront into the Nuvene Beauty storefront: new brand system, charter-true copy, prototype-faithful layout, every existing commerce feature intact.

**Architecture:** In-place rebrand of the Next.js 16 app on branch `nuvene-rebrand`. Logic changes (concern model, site config) are test-driven with Vitest. Visual changes go through one mechanical token codemod, then section-by-section component rewrites, then a copy audit test that fails on any banned claim, legacy name or dash. Production stays behind the maintenance proxy throughout.

**Tech stack:** Next.js 16.2 (App Router, Turbopack), React 19.2, Tailwind v4 (`@theme` in `globals.css`), TypeScript, Motion 12 and Lenis (already installed), `next/font/google` (Cinzel, Poppins), `@phosphor-icons/react` (new), Vitest (new, dev only), Python 3.12 with PyMuPDF and Pillow (already on this machine) for one-off asset extraction.

**Spec:** `docs/superpowers/specs/2026-10-02-nuvene-storefront-rebrand-design.md`

## Design read and dials

Reading this as: a brand-change redesign of a trust-first skincare shop for Nigerian shoppers and B2B buyers, in a calm botanical-luxury language, built on Tailwind v4 with the brand's own Cinzel/Poppins pairing and restrained CSS-first motion.

- `DESIGN_VARIANCE: 5` (faithful to the prototype's layout, not a reinvention)
- `MOTION_INTENSITY: 4` (hero line reveal, scroll reveals, hover lift; nothing looping)
- `VISUAL_DENSITY: 4`

The taste skill's serif and beige/gold palette bans are overridden by the brand guide, which names Cinzel and the linen/gold/sage/black palette explicitly. Alternating dark and light section bands is the prototype's identity and stays. Dark mode is out of scope: the brand composition is a fixed sequence of coloured bands, so `colorScheme` stays `light`.

## Global constraints

- Brand colours, exact: black `#000000`, muted gold `#BD9468`, beige linen `#E1DAC6`, sage `#708E74`, white `#FFFFFF`. Tints may be added only where contrast requires them, and only in the same hue family.
- Fonts: Cinzel for headlines, labels on large type, prices and numerals; Poppins for everything else. Loaded only through `next/font/google`.
- Text contrast: 4.5:1 for body text, 3:1 for text at 24px and above. Enforced by `tests/contrast.test.ts`.
- Banned claims anywhere in `src/`: sourced directly / direct from manufacturer / direct sourcing, any form of "verified" about products or authenticity, "10K", "36 states", "premier", "brand protection", "import rights", "every batch". Enforced by `tests/copy-audit.test.ts`.
- No em dash or en dash characters anywhere in `src/` (code comments included). Enforced by the same test.
- No "Velyn" outside the allowlist: `src/lib/maintenance-page.ts`, `src/lib/maintenance-velyn-lockup.ts`, `src/lib/ops/config.ts` (the ops URL default stays until the separate ops migration).
- Writing style from `~/.claude/CLAUDE.md`: none of delve, leverage, seamless, robust, comprehensive, elevate, unlock, harness, meticulous, testament, landscape, realm, tapestry, game-changer; no negation flips; no filler openers.
- Do not change route slugs, form field names, API route contracts or the `ProductQuery` shape.
- Corner radius: 0 everywhere (sharp), except the round cart count badge.
- Home-page kickers: at most four (hero, Who we serve, Wholesale, Contact).
- One label per intent across the site: "Shop by concern", "Apply for wholesale", "Start a conversation", "Browse all articles", "View all brands", "View all products".
- Motion: only `transform` and `opacity`; everything collapses under `prefers-reduced-motion`; content stays visible without JavaScript; `?still=1` freezes everything.
- Commits: imperative subject, no prefixes or emoji, trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push to `main`.
- Local dev: `MAINTENANCE_MODE=off` must be set, or every route returns the maintenance page. Port 3111.

## Review focus

1. A product name that matches no concern keyword (for example "100% Cotton Pads 80pcs"): the card shows no concern pill and the product still appears under "All". Pinned in Task 1 (`inferConcerns` returns `[]`).
2. An old concern link such as `/shop?concern=hyperpigmentation` or `?concern=acne-prone`: it filters by the matching new concern instead of showing an empty grid. Pinned in Task 1 (`resolveConcernSlug`).
3. A long product or brand name on a 375px screen: the card wraps or clamps and the page never scrolls sideways. Pinned in Task 14 (overflow check on every route).
4. A visitor without JavaScript or with reduced motion: every section is visible and nothing is stuck at opacity 0. Pinned in Task 14 (no-JS and reduced-motion captures).
5. The ops API is down and the demo catalogue renders: demo product copy and the demo notice carry Nuvene copy with no banned claims. Pinned in Task 13 (copy audit covers `demo-data.ts` and `demo-notice.tsx`).

---

## File map

New:
- `vitest.config.mts`: test runner config with the `@` alias.
- `src/lib/ops/concerns.ts` (+ `concerns.test.ts`): the five charter concerns, keyword inference, legacy slug mapping.
- `scripts/rebrand-tokens.mjs`: one-shot codemod from Velyn utility names to Nuvene ones.
- `scripts/build-logos.mjs`: turns the official SVG logos into `src/components/brand/nuvene-logo-paths.ts` and `src/app/icon.svg`.
- `scripts/brand-assets.py`: extracts brand photos from the guide PDF and builds PNG icons.
- `src/components/brand/nuvene-logo.tsx`: `NuveneIcon`, `NuveneLockup`, `NuveneStacked`. (The logo SVG strings are generated at build time from the client's own files, so rendering them with `dangerouslySetInnerHTML` carries no user input.)
- `src/assets/photos/*.jpg`: hero and mockup photos. The hero stays a server component; its motion is CSS.
- `tests/contrast.test.ts`, `tests/legacy-tokens.test.ts`, `tests/logos.test.ts`, `tests/site.test.ts`, `tests/copy-audit.test.ts`.

Renamed:
- `src/components/brand/velyn-lockup-svg.ts` to `src/lib/maintenance-velyn-lockup.ts` (only the maintenance page uses it).

Deleted:
- `src/components/brand/velyn-mark.tsx`
- `public/brand/PNG/**`, `public/brand/SVG/**` (Velyn logo files; replaced by `public/brand/nuvene-*.png`)

Modified: `package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/site.ts`, `src/lib/ops/{types,constants,normalize,products,demo-data}.ts`, `src/app/shop/page.tsx`, `src/components/ui/{button,section-heading,page-hero,cta-band,icons}.tsx`, `src/components/shop/{product-card,filter-rail}.tsx`, `src/components/layout/{site-header,site-footer}.tsx`, all ten `src/components/home/*.tsx`, the inner pages, `src/components/seo/json-ld.tsx`, `src/app/{manifest.ts,opengraph-image.tsx}`, `src/app/api/contact/route.ts`, `src/lib/cart-store.ts`, `src/proxy.ts`, `src/lib/maintenance-page.ts`, `src/lib/education.ts`.

---

### Task 1: Test runner and the five charter concerns

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mts`
- Create: `src/lib/ops/concerns.ts`
- Create: `src/lib/ops/concerns.test.ts`
- Modify: `src/lib/ops/types.ts:7-14`, `src/lib/ops/constants.ts`, `src/lib/ops/normalize.ts:45-59`, `src/lib/ops/products.ts:82-86,128-130`, `src/lib/ops/demo-data.ts`, `src/app/shop/page.tsx:36,48`

**Interfaces:**
- Produces: `CONCERNS` (readonly array of `{ slug, label, short }`), `type ConcernSlug`, `type SkinConcern`, `inferConcerns(name: string, category?: string): SkinConcern[]`, `concernSlug(label: SkinConcern): ConcernSlug`, `concernShort(label: SkinConcern): string`, `resolveConcernSlug(input?: string | null): ConcernSlug | undefined`. `CONCERN_OPTIONS` keeps its shape `{ label, slug }[]`.

- [ ] **Step 1: Install Vitest and add the script**

Run: `npm install -D vitest@^3`
Then add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Create `vitest.config.mts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Write the failing tests**

`src/lib/ops/concerns.test.ts` (product names are taken from the client's new product sheet):

```ts
import { describe, expect, it } from "vitest";
import {
  CONCERNS,
  concernShort,
  concernSlug,
  inferConcerns,
  resolveConcernSlug,
} from "./concerns";

describe("CONCERNS", () => {
  it("lists the charter's five concerns in charter order", () => {
    expect(CONCERNS.map((c) => c.slug)).toEqual([
      "acne-oily",
      "dryness",
      "dark-spots",
      "sensitive",
      "sun",
    ]);
  });
});

describe("inferConcerns", () => {
  it("puts sun protection first for an oil-control sunscreen", () => {
    const c = inferConcerns(
      "Anthelios UV Mune 400 Oil Control Invisible Fluid SPF 50 Sunscreen 50ml",
    );
    expect(c[0]).toBe("Sun protection");
    expect(c).toContain("Acne & oily skin");
  });

  it("reads zinc niacinamide as acne first, dark spots second", () => {
    expect(inferConcerns("Niacinamide 10% + Zinc 1% 30ml")).toEqual([
      "Acne & oily skin",
      "Dark spots & uneven tone",
    ]);
  });

  it("does not treat 'toner' as 'tone'", () => {
    expect(inferConcerns("Heartleaf 77% Soothing Toner 250ml")).toEqual([
      "Sensitive skin",
    ]);
  });

  it("does not treat 'creamy' as 'cream'", () => {
    expect(inferConcerns("Acne Creamy Wash (4% Benzoyl Peroxide) 170g")).toEqual([
      "Acne & oily skin",
    ]);
  });

  it("maps moisturisers to dryness", () => {
    expect(inferConcerns("CeraVe Moisturizing Lotion 473ml")).toEqual(["Dryness"]);
  });

  it("maps TXA serums to dark spots", () => {
    expect(
      inferConcerns("Niacinamide 10% + TXA 4% Dark Spot Correcting Serum 30ml")[0],
    ).toBe("Dark spots & uneven tone");
  });

  it("uses the category as a hint", () => {
    expect(inferConcerns("Aqua Protect 70ml", "Sunscreen")).toEqual(["Sun protection"]);
  });

  it("returns nothing for products with no concern signal", () => {
    expect(inferConcerns("100% Cotton Pads 80pcs")).toEqual([]);
  });
});

describe("slugs and labels", () => {
  it("round-trips label to slug", () => {
    for (const c of CONCERNS) expect(concernSlug(c.label)).toBe(c.slug);
  });

  it("has a short label for chips", () => {
    expect(concernShort("Dark spots & uneven tone")).toBe("Dark spots");
  });
});

describe("resolveConcernSlug", () => {
  it("accepts current slugs", () => {
    expect(resolveConcernSlug("dryness")).toBe("dryness");
  });

  it("maps legacy Velyn slugs", () => {
    expect(resolveConcernSlug("acne-prone")).toBe("acne-oily");
    expect(resolveConcernSlug("oily-skin")).toBe("acne-oily");
    expect(resolveConcernSlug("hyperpigmentation")).toBe("dark-spots");
    expect(resolveConcernSlug("dry-skin")).toBe("dryness");
    expect(resolveConcernSlug("sensitive-skin")).toBe("sensitive");
  });

  it("drops slugs with no charter equivalent", () => {
    expect(resolveConcernSlug("anti-ageing")).toBeUndefined();
    expect(resolveConcernSlug("all-skin-types")).toBeUndefined();
    expect(resolveConcernSlug(undefined)).toBeUndefined();
    expect(resolveConcernSlug("")).toBeUndefined();
  });
});
```

- [ ] **Step 4: Run the tests and watch them fail**

Run: `npm test`
Expected: FAIL, `Cannot find module './concerns'`.

- [ ] **Step 5: Implement `src/lib/ops/concerns.ts`**

```ts
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
    /dark spot|spots? fading|pigment|bright|arbutin|vitamin c|\bvit\.? ?c\b|vita c|tranexamic|\btxa\b|kojic|niacin|azelaic|azealic|\btone\b|glutathione|lightening|whitening|turmeric|glow|glycolic|lactic|\baha\b|exfoliat/i,
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
```

- [ ] **Step 6: Run the tests and watch them pass**

Run: `npm test`
Expected: PASS, 14 tests.

- [ ] **Step 7: Wire the app to the new model**

`src/lib/ops/types.ts`: replace the `SkinConcern` union (lines 7-14) with
```ts
export type { SkinConcern } from "./concerns";
import type { SkinConcern } from "./concerns";
```
and change the `authentic` doc comment to `/** Nuvene sells only original products bought through named distributors. */`.

`src/lib/ops/constants.ts` becomes:
```ts
import { CONCERNS } from "./concerns";

export const CONCERN_OPTIONS = CONCERNS.map(({ slug, label, short }) => ({
  slug,
  label,
  short,
}));
```

`src/lib/ops/normalize.ts`: delete `CONCERN_RULES` and the local `inferConcerns` (lines 45-59), add `import { inferConcerns } from "./concerns";`, keep the call `concerns: inferConcerns(raw.name, category)`. Change the comment at line 63 to `// (rather than inventing a house brand on the storefront).`

`src/lib/ops/products.ts`: delete `slugifyConcern` (lines 128-130); import `concernSlug` from `./concerns`; the filter at line 84 becomes `p.concerns.some((c) => concernSlug(c) === q.concern)`.

`src/lib/ops/demo-data.ts`: remove the `concerns` field from the `Seed` type and from every seed object (regex in your editor: `concerns: \[[^\]]*\], ` replaced with nothing), import `inferConcerns` from `./concerns`, and in the mapper set `concerns: inferConcerns(s.name, s.category),`. Change the demo description to `${s.short} Bought through a named distributor and covered by our replace-or-refund guarantee.` and the file header comment to describe the Nuvene demo catalogue with no ops hostname.

`src/app/shop/page.tsx`: import `resolveConcernSlug` from `@/lib/ops/concerns`; set `concern: resolveConcernSlug(str(sp.concern)),` in the query (line 36). Line 48 stays as is (it compares against `CONCERN_OPTIONS` slugs, which now match). In the chip row (lines ~123-135) render `{c.short}` instead of `{c.label}`.

- [ ] **Step 8: Typecheck and test**

Run: `npx tsc --noEmit; npm test`
Expected: no type errors; tests pass.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.mts src/lib/ops src/app/shop/page.tsx
git commit -m "Replace skin concerns with the charter's five"
```

---

### Task 2: Brand tokens, fonts and the codemod

**Files:**
- Create: `tests/contrast.test.ts`, `tests/legacy-tokens.test.ts`, `scripts/rebrand-tokens.mjs`
- Modify: `src/app/globals.css` (whole `@theme` block and the brand primitives), `src/app/layout.tsx:1-23,63-66,70-71`, every `src/**/*.tsx` touched by the codemod

**Interfaces:**
- Produces Tailwind colour utilities: `ink`, `ink-mid`, `ink-lift`, `ink-surface`, `gold`, `gold-deep`, `gold-pale`, `linen`, `linen-mid`, `linen-soft`, `sage`, `sage-mid`, `sage-pale`, `sage-deep`, `sage-shade`, `sage-dusk`, `sage-night`, `stone`. Font utilities `font-serif` (Cinzel) and `font-sans` (Poppins). CSS classes `.display`, `.kicker`, `.kicker--onDark`, `.kicker--center`, `.tick-frame`, `.tick-frame--linen`, `.auth-tag`, `.hero-lines`, `.hero-photo`.

- [ ] **Step 1: Write the failing contrast test**

`tests/contrast.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");
const tokens: Record<string, string> = {
  white: "#ffffff",
  ...Object.fromEntries(
    [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
      m[1],
      m[2],
    ]),
  ),
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg: string, bg: string) {
  const a = luminance(tokens[fg]);
  const b = luminance(tokens[bg]);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Every text-on-ground pairing the components use for body-size text.
const BODY: [string, string][] = [
  ["ink", "linen"],
  ["ink", "white"],
  ["ink", "gold"],
  ["stone", "white"],
  ["stone", "linen"],
  ["stone", "linen-soft"],
  ["gold-deep", "white"],
  ["gold-deep", "linen"],
  ["gold-deep", "linen-soft"],
  ["sage-deep", "white"],
  ["sage-deep", "linen"],
  ["sage-deep", "sage-pale"],
  ["white", "ink"],
  ["linen", "ink"],
  ["gold", "ink"],
  ["linen", "ink-surface"],
  ["white", "sage-shade"],
  ["white", "sage-dusk"],
  ["white", "sage-night"],
  ["linen", "sage-night"],
];

// Pairings used only for 24px+ type.
const LARGE: [string, string][] = [
  ["white", "sage"],
  ["linen", "sage-shade"],
];

describe("brand contrast", () => {
  it("defines every token the pairs use", () => {
    for (const [fg, bg] of [...BODY, ...LARGE]) {
      expect(tokens[fg], fg).toMatch(/^#/);
      expect(tokens[bg], bg).toMatch(/^#/);
    }
  });

  it.each(BODY)("%s on %s reaches 4.5:1", (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(LARGE)("%s on %s reaches 3:1 for large text", (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3);
  });

  it("keeps the five brand colours exact", () => {
    expect(tokens.ink.toLowerCase()).toBe("#000000");
    expect(tokens.gold.toLowerCase()).toBe("#bd9468");
    expect(tokens.linen.toLowerCase()).toBe("#e1dac6");
    expect(tokens.sage.toLowerCase()).toBe("#708e74");
  });
});
```

`tests/legacy-tokens.test.ts`:
```ts
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ALLOW = new Set(["lib/maintenance-page.ts", "lib/maintenance-velyn-lockup.ts"]);
const LEGACY =
  /\b(?:bg|text|border|divide|ring|fill|stroke|from|to|via|outline|decoration|shadow|accent|caret)-(?:espresso|ivory|olive|cocoa|mocha|gold-dim|gold-faint)\b|--color-(?:espresso|ivory|olive|cocoa|mocha)|font-(?:eb-garamond|manrope)/;

const files = (readdirSync("src", { recursive: true }) as string[])
  .map((f) => f.split(path.sep).join("/"))
  .filter((f) => /\.(tsx?|css)$/.test(f) && !ALLOW.has(f));

describe("legacy Velyn tokens", () => {
  it.each(files)("%s uses no Velyn colour or font tokens", (f) => {
    const hit = readFileSync(path.join("src", f), "utf8").match(LEGACY);
    expect(hit?.[0]).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npm test`
Expected: contrast suite FAIL (tokens like `ink`, `sage-shade` undefined); legacy suite FAIL on roughly 50 files.

- [ ] **Step 3: Replace the `@theme` block and header comment in `src/app/globals.css`**

```css
/* ------------------------------------------------------------------
   NUVENE BEAUTY design system
   Brand guide palette: black, muted gold, beige linen, sage, white.
   Extra tints exist only where text contrast needs them.
------------------------------------------------------------------ */

@theme {
  --color-ink: #000000;
  --color-ink-mid: #161616;
  --color-ink-lift: #242424;
  --color-ink-surface: #0b0b0b;

  --color-gold: #bd9468;
  --color-gold-deep: #735333;
  --color-gold-pale: #ede0ce;

  --color-linen: #e1dac6;
  --color-linen-mid: #cfc6ae;
  --color-linen-soft: #efeadd;

  --color-sage: #708e74;
  --color-sage-mid: #8fa893;
  --color-sage-pale: #dde6de;
  --color-sage-deep: #435e49;
  --color-sage-shade: #5e7c63;
  --color-sage-dusk: #4f6a54;
  --color-sage-night: #3f5744;

  --color-stone: #5f5a50;

  --font-serif: var(--font-cinzel), "Times New Roman", serif;
  --font-sans: var(--font-poppins), system-ui, sans-serif;

  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  --z-header: 40;
  --z-dropdown: 50;
  --z-backdrop: 60;
  --z-modal: 70;
  --z-toast: 80;
}
```

- [ ] **Step 4: Rewrite the brand primitives in `globals.css`**

Replace the `.skip-link` background with `var(--color-ink)`. Replace `.kicker` and `.kicker--onDark` with:
```css
.kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-gold-deep);
}
.kicker::before,
.kicker--center::after {
  content: "";
  width: 1.5rem;
  height: 1px;
  background: var(--color-gold);
}
.kicker--onDark {
  color: var(--color-linen);
}
```
In `.product-desc`: `h2,h3,h4` colour `var(--color-ink)`; `p` and `li` colour `var(--color-stone)`; `strong` colour `var(--color-ink)`; `a` colour `var(--color-gold-deep)`.

After `.tick-frame > .tick-br { ... }` add:
```css
.tick-frame--linen::before,
.tick-frame--linen::after,
.tick-frame--linen > .tick-bl,
.tick-frame--linen > .tick-br {
  border-color: var(--color-linen);
}
```
Replace `.auth-tag`:
```css
.auth-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--color-sage-pale);
  color: var(--color-sage-deep);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.22rem 0.5rem;
}
```
Replace `.display`:
```css
.display {
  font-family: var(--font-serif);
  font-weight: 400;
  line-height: 1.14;
  letter-spacing: 0.01em;
  text-wrap: balance;
}
.display em {
  font-style: normal;
  color: var(--color-gold-deep);
}
```
`.prose-body` colour `var(--color-stone)`. `.naira-symbol` font stack: `"Segoe UI", Roboto, "Noto Sans", Arial, var(--font-poppins), sans-serif`. Rename `@keyframes velyn-float` to `@keyframes drift` and its use in `.animate-float`.

Add, just above the "Reveal system" comment block:
```css
/* Hero headline: each line rises out of its own mask on first paint. */
.hero-lines .line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
}
.hero-lines .line > span {
  display: inline-block;
}
@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  .hero-lines .line > span {
    animation: line-up 0.95s var(--ease-out-expo) both;
    animation-delay: calc(var(--i, 0) * 110ms + 120ms);
  }
  .hero-photo {
    animation: photo-in 1.4s var(--ease-out-expo) both;
  }
}
@keyframes line-up {
  from {
    transform: translateY(105%);
  }
  to {
    transform: none;
  }
}
@keyframes photo-in {
  from {
    opacity: 0;
    transform: scale(1.06);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.still .hero-lines .line > span,
.still .hero-photo {
  animation: none !important;
}
```

- [ ] **Step 5: Run the contrast test**

Run: `npx vitest run tests/contrast.test.ts`
Expected: PASS. If `white on sage-shade` lands just under 4.5, darken `--color-sage-shade` one step at a time (`#5a775f`, then `#57735c`) until it passes. Do not change the five brand values.

- [ ] **Step 6: Swap the fonts in `src/app/layout.tsx`**

```ts
import { Cinzel, Poppins } from "next/font/google";

const display = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const sans = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});
```
Update the `<html>` className to `${display.variable} ${sans.variable}`, the `<body>` classes to `min-h-dvh flex flex-col bg-linen text-ink antialiased`, and `themeColor` to `"#4F6A54"`. (Metadata copy changes in Task 4.)

- [ ] **Step 7: Write the codemod `scripts/rebrand-tokens.mjs`**

```js
// One-shot rename of Velyn design tokens to Nuvene ones across src/.
// Run once from the repo root: node scripts/rebrand-tokens.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SKIP = new Set([
  "app/globals.css",
  "lib/maintenance-page.ts",
  "components/brand/velyn-lockup-svg.ts",
]);

const RULES = [
  [/espresso-surface/g, "ink-surface"],
  [/espresso-lift/g, "ink-lift"],
  [/espresso-mid/g, "ink-mid"],
  [/\bespresso\b/g, "ink"],
  [/gold-dim/g, "gold-deep"],
  [/gold-faint/g, "linen-soft"],
  [/ivory-mid/g, "linen-mid"],
  [/\bivory\b/g, "linen"],
  [/text-olive(?![-\w])/g, "text-sage-deep"],
  [/olive-pale/g, "sage-pale"],
  [/olive-mid/g, "sage-mid"],
  [/\bolive\b/g, "sage"],
  [/-(cocoa|mocha)\b/g, "-stone"],
  [/rgba\(44,\s*26,\s*14,/g, "rgba(0,0,0,"],
  [/rgba\(247,\s*244,\s*239,/g, "rgba(225,218,198,"],
  [/#2C1A0E/gi, "#000000"],
  [/#F7F4EF/gi, "#E1DAC6"],
  [/#8A8A00/gi, "#8FA893"],
  [/#676700/gi, "#708E74"],
];

let changed = 0;
for (const rel of readdirSync("src", { recursive: true })) {
  const f = rel.split(path.sep).join("/");
  if (!/\.(tsx?)$/.test(f) || SKIP.has(f)) continue;
  const file = path.join("src", f);
  const before = readFileSync(file, "utf8");
  const after = RULES.reduce((s, [re, to]) => s.replace(re, to), before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
    console.log("updated", f);
  }
}
console.log(`${changed} files updated`);
```

- [ ] **Step 8: Run the codemod and review the diff**

Run: `node scripts/rebrand-tokens.mjs; git diff --stat`
Then search prose for accidental rewrites: `git diff -U0 | Select-String -Pattern '^\+.*\b(linen|sage|ink)\b' | Select-String -NotMatch -Pattern '(bg|text|border|divide|ring|from|to|via|fill|stroke|tone|variant|shadow)-|tone=|variant='`
Expected: no product copy changed (only class names, `tone=`/`variant=` values and colour literals). Fix any prose hit by hand.

Note: the codemod also renames `variant="espresso"` to `variant="ink"`, `tone="espresso"` to `tone="ink"` and `tone="olive"` to `tone="sage"`. Task 5 updates `button.tsx` and `cta-band.tsx` to accept exactly those names.

- [ ] **Step 9: Run both test files**

Run: `npm test`
Expected: contrast and legacy-token suites PASS. (`button.tsx` and `cta-band.tsx` may still fail typecheck until Task 5; that is expected and is not part of this test run.)

- [ ] **Step 10: Commit**

```bash
git add -A src/app/globals.css src/app/layout.tsx scripts/rebrand-tokens.mjs tests src
git commit -m "Move the design tokens and fonts to the Nuvene brand system"
```

---

### Task 3: Logos and brand assets

**Files:**
- Create: `scripts/build-logos.mjs`, `scripts/brand-assets.py`, `src/components/brand/nuvene-logo.tsx`, `tests/logos.test.ts`
- Generated: `src/components/brand/nuvene-logo-paths.ts`, `src/app/icon.svg`, `src/app/apple-icon.png`, `public/brand/nuvene-icon-192.png`, `public/brand/nuvene-icon-512.png`, `public/brand/nuvene-primary.png`, `src/assets/photos/{hero-cream,shopping-bag,store-shelves,shipping-box,team-tee}.jpg`
- Move: `src/components/brand/velyn-lockup-svg.ts` to `src/lib/maintenance-velyn-lockup.ts`
- Delete: `src/components/brand/velyn-mark.tsx`, `public/brand/PNG`, `public/brand/SVG`
- Modify: every file importing `velyn-mark` (header, footer, product card, cart drawer, cart view, checkout view, checkout success, education preview, education page, about page, shop slug page, not-found, page hero, hero) and `src/lib/maintenance-page.ts:1`

**Interfaces:**
- Produces: `NuveneIcon({ className?, title? })` (colour from `currentColor`), `NuveneLockup({ className?, tone? })`, `NuveneStacked({ className?, tone? })` where `tone: "brand" | "ink" | "white" | "linen"` (default `"brand"`: sage mark, black wordmark).

- [ ] **Step 1: Write the failing logo test**

`tests/logos.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import {
  LOGO_HORIZONTAL,
  LOGO_ICON,
  LOGO_STACKED,
} from "@/components/brand/nuvene-logo-paths";

describe.each([
  ["icon", LOGO_ICON],
  ["horizontal", LOGO_HORIZONTAL],
  ["stacked", LOGO_STACKED],
])("%s logo", (_name, logo) => {
  it("has a numeric viewBox", () => {
    expect(logo.viewBox).toMatch(/^0 0 [\d.]+ [\d.]+$/);
  });

  it("is outlined paths coloured through CSS variables", () => {
    expect(logo.body).toContain("<path");
    expect(logo.body).toContain("var(--logo-mark,currentColor)");
    expect(logo.body).not.toMatch(/class=|#373435|#708E74|#FEFEFE|<text|<metadata/i);
  });
});

it("keeps the wordmark separately colourable on lockups", () => {
  expect(LOGO_HORIZONTAL.body).toContain("var(--logo-word,currentColor)");
  expect(LOGO_STACKED.body).toContain("var(--logo-word,currentColor)");
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/logos.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `scripts/build-logos.mjs`**

```js
// Converts the official CorelDRAW SVG exports into inline-ready path markup.
// fil0 is the NB mark, fil1 the NUVENE BEAUTY wordmark.
// Run: node scripts/build-logos.mjs
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "../nuvenebeauty.com/LOGOS/SVG";
const files = {
  LOGO_ICON: `${SRC}/ICON/ICON COLORED.svg`,
  LOGO_HORIZONTAL: `${SRC}/SECONDARY LOGO/SECONDARY LOGO COLORED.svg`,
  LOGO_STACKED: `${SRC}/PRIMARY LOGO/PRIMARY LOGO COLORED.svg`,
};

function convert(svg) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1].trim();
  const paths = svg.match(/<path\b[^>]*\/>/g) ?? [];
  const body = paths
    .map((p) =>
      p
        .replace(/\s*class="fil0"/, ' style="fill:var(--logo-mark,currentColor)"')
        .replace(/\s*class="fil1"/, ' style="fill:var(--logo-word,currentColor)"'),
    )
    .join("");
  if (/class=/.test(body)) throw new Error("unmapped fill class");
  return { viewBox, body };
}

const out = Object.entries(files).map(([name, file]) => {
  const { viewBox, body } = convert(readFileSync(file, "utf8"));
  return `export const ${name} = {\n  viewBox: ${JSON.stringify(viewBox)},\n  body: ${JSON.stringify(body)},\n} as const;\n`;
});

writeFileSync(
  "src/components/brand/nuvene-logo-paths.ts",
  `// Generated by scripts/build-logos.mjs from the official logo SVGs. Do not edit.\n\n${out.join("\n")}`,
);

// Favicon: the NB mark in sage, centred on a square canvas. Literal fill,
// since some favicon renderers ignore CSS custom properties.
const icon = convert(readFileSync(files.LOGO_ICON, "utf8"));
const [, , w, h] = icon.viewBox.split(" ").map(Number);
const pad = (w - h) / 2;
const sageBody = icon.body.replaceAll("var(--logo-mark,currentColor)", "#708E74");
writeFileSync(
  "src/app/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${-pad} ${w} ${w}">${sageBody}</svg>\n`,
);
console.log("logos written");
```

Note: if Step 4 shows the CorelDRAW paths use `<path ...></path>` instead of self-closing tags, widen the regex to `/<path\b[^>]*?(?:\/>|>\s*<\/path>)/g`.

- [ ] **Step 4: Generate and run the test**

Run: `node scripts/build-logos.mjs; npx vitest run tests/logos.test.ts`
Expected: "logos written"; tests PASS. Open `src/app/icon.svg` in the browser to confirm a centred sage NB mark.

- [ ] **Step 5: Write `src/components/brand/nuvene-logo.tsx`**

```tsx
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { LOGO_HORIZONTAL, LOGO_ICON, LOGO_STACKED } from "./nuvene-logo-paths";

type Tone = "brand" | "ink" | "white" | "linen";

const TONES: Record<Tone, CSSProperties> = {
  brand: { "--logo-mark": "#708E74", "--logo-word": "#000000" } as CSSProperties,
  ink: { "--logo-mark": "#000000", "--logo-word": "#000000" } as CSSProperties,
  white: { "--logo-mark": "#FFFFFF", "--logo-word": "#FFFFFF" } as CSSProperties,
  linen: { "--logo-mark": "#E1DAC6", "--logo-word": "#E1DAC6" } as CSSProperties,
};

function Svg({
  logo,
  className,
  style,
  title,
}: {
  logo: { viewBox: string; body: string };
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <svg
      viewBox={logo.viewBox}
      className={cn("block", className)}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: logo.body }}
    />
  );
}

/** The NB monogram. Colour comes from `currentColor`; decorative unless `title` is set. */
export function NuveneIcon({ className, title }: { className?: string; title?: string }) {
  return <Svg logo={LOGO_ICON} className={cn("h-8 w-auto", className)} title={title} />;
}

/** Horizontal lockup for headers and narrow spaces. */
export function NuveneLockup({ className, tone = "brand" }: { className?: string; tone?: Tone }) {
  return (
    <Svg
      logo={LOGO_HORIZONTAL}
      className={cn("h-8 w-auto", className)}
      style={TONES[tone]}
      title="Nuvene Beauty"
    />
  );
}

/** Stacked primary logo for footers and prominent placements. */
export function NuveneStacked({ className, tone = "brand" }: { className?: string; tone?: Tone }) {
  return (
    <Svg
      logo={LOGO_STACKED}
      className={cn("h-16 w-auto", className)}
      style={TONES[tone]}
      title="Nuvene Beauty"
    />
  );
}
```

- [ ] **Step 6: Replace every `VelynMark` and `VelynLockup`**

Move the maintenance lockup first so the maintenance page keeps working:
```bash
git mv src/components/brand/velyn-lockup-svg.ts src/lib/maintenance-velyn-lockup.ts
```
In `src/lib/maintenance-page.ts:1` change the import to `import { VELYN_LOCKUP_SVG } from "@/lib/maintenance-velyn-lockup";`.

Then run this one-off replacement (PowerShell; it rewrites JSX call sites and imports):
```powershell
$map = @{ gold = 'text-gold'; ink = 'text-ink'; white = 'text-linen' }
Get-ChildItem src -Recurse -Include *.tsx | ForEach-Object {
  $t = [IO.File]::ReadAllText($_.FullName)
  $o = $t
  $t = [regex]::Replace($t, '<VelynMark\s+className="([^"]*)"\s+tone="(\w+)"\s*/>', {
    param($m) '<NuveneIcon className="' + $m.Groups[1].Value + ' ' + $map[$m.Groups[2].Value] + '" />' }, 'Singleline')
  $t = $t -replace '<VelynLockup\s*/>', '<NuveneLockup className="h-8 w-auto sm:h-9" />'
  $t = $t -replace 'import \{ VelynMark \} from "@/components/brand/velyn-mark";', 'import { NuveneIcon } from "@/components/brand/nuvene-logo";'
  $t = $t -replace 'import \{ VelynLockup \} from "@/components/brand/velyn-mark";', 'import { NuveneLockup } from "@/components/brand/nuvene-logo";'
  if ($t -ne $o) { [IO.File]::WriteAllText($_.FullName, $t); $_.FullName }
}
```
Then `git rm src/components/brand/velyn-mark.tsx` and check nothing still references it: `Get-ChildItem src -Recurse -Include *.ts,*.tsx | Select-String -Pattern 'VelynMark|VelynLockup|velyn-mark'` (expected: no output). Fix any multi-line call site the regex missed by hand, mapping `tone` as in `$map`.

The NB mark is wider than the old V mark (1.74:1), so watermark sizes like `h-72` render wider; Tasks 5 and 10 resize them where they matter.

- [ ] **Step 7: Write and run `scripts/brand-assets.py`**

```python
"""Extract brand photos from the guide PDF and build PNG icons.
Run from the repo root: python scripts/brand-assets.py
"""
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

ROOT = Path("..") / "nuvenebeauty.com"
PHOTOS = Path("src/assets/photos")
PUBLIC = Path("public/brand")
PHOTOS.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

# Page number in the guide -> output name. Each page's largest image is the photo.
PAGES = {1: "hero-cream", 7: "shopping-bag", 8: "store-shelves", 9: "shipping-box", 10: "team-tee"}

doc = fitz.open(ROOT / "NUVENE BRAND GUIDE.pdf")
for page_no, name in PAGES.items():
    page = doc[page_no - 1]
    best = max(page.get_images(full=True), key=lambda im: im[2] * im[3])
    pix = fitz.Pixmap(doc, best[0])
    if pix.n != 3 or pix.alpha:  # CMYK, greyscale or alpha: flatten to plain RGB
        pix = fitz.Pixmap(fitz.csRGB, pix, 0)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(PHOTOS / f"{name}.jpg", quality=88, optimize=True, progressive=True)
    print(name, img.size)

icon = Image.open(ROOT / "LOGOS/PNG/ICON/ICON COLORED.png").convert("RGBA")
linen = (225, 218, 198, 255)
for size, target in [(180, Path("src/app/apple-icon.png")), (192, PUBLIC / "nuvene-icon-192.png"), (512, PUBLIC / "nuvene-icon-512.png")]:
    canvas = Image.new("RGBA", (size, size), linen)
    mark = icon.copy()
    mark.thumbnail((int(size * 0.7), int(size * 0.7)), Image.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    canvas.convert("RGB").save(target, optimize=True)
    print(target, size)

primary = Image.open(ROOT / "LOGOS/PNG/PRIMARY LOGO/PRIMARY LOGO COLORED.png")
primary.thumbnail((1200, 1200), Image.LANCZOS)
primary.save(PUBLIC / "nuvene-primary.png", optimize=True)
print("primary", primary.size)
```
Run: `python scripts/brand-assets.py`
Expected: `hero-cream (736, 919)` and four mockups near 1360 x 768, three icons, the primary logo.

Then delete the Velyn logo files: `git rm -r public/brand/PNG public/brand/SVG`.

- [ ] **Step 8: Typecheck, test, commit**

Run: `npx tsc --noEmit; npm test`
Expected: no errors from logo imports (Task 5 files may still error on variant names); tests PASS.

```bash
git add -A scripts src/components/brand src/app/icon.svg src/app/apple-icon.png src/assets public/brand src/lib/maintenance-velyn-lockup.ts src/lib/maintenance-page.ts src tests/logos.test.ts
git commit -m "Add the Nuvene logos, icons and brand photography"
```

---

### Task 4: Site config, metadata and business details

**Files:**
- Create: `tests/site.test.ts`
- Modify: `src/lib/site.ts` (whole file), `src/app/layout.tsx:25-61`, `src/components/seo/json-ld.tsx:36-57`, `src/app/manifest.ts`, `src/app/opengraph-image.tsx` (whole file), `src/app/api/contact/route.ts:66,77`, `src/lib/cart-store.ts:74`, `src/proxy.ts:13`, `src/lib/maintenance-page.ts`, `src/app/contact/page.tsx:30-41`, `src/components/checkout/checkout-view.tsx:195-207`, `src/app/returns/page.tsx:69`, `src/app/track/page.tsx:51`, `src/components/forms/track-form.tsx:298-299`, `src/components/shop/product-buy-panel.tsx:144`, `package.json:2`

**Interfaces:**
- Produces: `site.contact.phones: { label: string; tel: string; display: string }[]`, `site.contact.whatsapp` (digits), `site.contact.whatsappDisplay`, `site.positioning`. Removes `phoneMtn` and `phoneAirtel`.

- [ ] **Step 1: Write the failing test**

`tests/site.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { site, whatsappLink } from "@/lib/site";

describe("site config", () => {
  it("is Nuvene throughout", () => {
    expect(site.name).toBe("Nuvene Beauty");
    expect(JSON.stringify(site)).not.toMatch(/velyn/i);
  });

  it("defaults to the new domain", () => {
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      expect(site.url).toBe("https://nuvenebeauty.com");
    }
  });

  it("stores phones in E.164 with a readable display form", () => {
    expect(site.contact.phones.length).toBeGreaterThanOrEqual(2);
    for (const p of site.contact.phones) {
      expect(p.tel).toMatch(/^\+234\d{10}$/);
      expect(p.display.replace(/\s/g, "")).toBe("0" + p.tel.slice(4));
    }
  });

  it("builds WhatsApp links from digits only", () => {
    expect(whatsappLink("Hello")).toBe(
      `https://wa.me/${site.contact.whatsapp}?text=Hello`,
    );
    expect(site.contact.whatsapp).toMatch(/^234\d{10}$/);
  });

  it("only states numbers the business can stand behind", () => {
    const stats = JSON.stringify(site.stats);
    expect(stats).not.toMatch(/10K|36|states|customers/i);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/site.test.ts`
Expected: FAIL on name and phones.

- [ ] **Step 3: Replace `src/lib/site.ts`**

```ts
/**
 * Central brand and site configuration for Nuvene Beauty.
 * Sourced from the Nuvene Brand Charter and Positioning Document (2026 relaunch).
 */

export const site = {
  name: "Nuvene Beauty",
  shortName: "Nuvene",
  // CAC registration of the new name is pending; add "Ltd" once confirmed.
  legalName: "Nuvene Beauty",
  slogan: "Beauty you can trust",
  positioning: "Concern matched. Transparently sourced.",
  description:
    "Nuvene Beauty is an Abuja skincare company. We match your real skin concern to an original product, name the distributor it came from, and replace or refund anything confirmed counterfeit.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nuvenebeauty.com",
  locale: "en_NG",

  contact: {
    email: "nuvenebeauty@gmail.com",
    phones: [
      { label: "Abuja", tel: "+2347047024403", display: "0704 702 4403" },
      { label: "Lagos", tel: "+2349064210147", display: "0906 421 0147" },
    ],
    // The charter lists WhatsApp Business as still to be confirmed; the Abuja line stands in.
    whatsapp: "2347047024403",
    whatsappDisplay: "0704 702 4403",
    address: {
      line1: "Shop CG 056, Patience Jonathan Block",
      line2: "Wuye Market, Wuye",
      city: "Abuja",
      country: "Nigeria",
    },
    hours: "Monday to Friday, 9am to 5pm WAT",
  },

  social: {
    instagram: "https://instagram.com/nuvenebeauty",
    tiktok: "https://tiktok.com/@nuvenebeauty",
    facebook: "https://facebook.com/nuvenebeauty",
  },

  stats: [
    { value: "200+", label: "Products" },
    { value: "50+", label: "Global brands" },
    { value: "5", label: "Skin concerns matched" },
    { value: "1", label: "Guarantee: replace or refund" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Shop", href: "/shop" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Partner With Us", href: "/partner" },
  { label: "Education", href: "/education" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  explore: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Our brands", href: "/brands" },
    { label: "Shop", href: "/shop" },
    { label: "Education hub", href: "/education" },
  ],
  business: [
    { label: "Wholesale", href: "/wholesale" },
    { label: "Partner with us", href: "/partner" },
    { label: "Sourcing promise", href: "/authenticity" },
    { label: "Wholesale terms", href: "/wholesale#terms" },
  ],
  support: [
    { label: "Contact us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Order tracking", href: "/track" },
    { label: "Returns policy", href: "/returns" },
    { label: "Privacy policy", href: "/privacy" },
  ],
} as const;

/** WhatsApp deep link with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
```

- [ ] **Step 4: Freeze the maintenance page's own Velyn details**

`src/lib/maintenance-page.ts` serves velynbeauty.com until the redirect step, so it must keep Velyn's details. Remove its `site` import and add near the top:
```ts
// velynbeauty.com keeps its old details until the domain redirects to Nuvene.
const LEGACY = {
  phonePrimary: "+2348141741207",
  phonePrimaryDisplay: "+234 814 174 1207",
  phoneSecondary: "+2349028828977",
  address: "Suite A20, ES-EM Plaza, Shettima Monguno Crescent, Utako, Abuja",
  email: "hello@velynbeauty.com",
};
```
Replace every `${site.contact...}` / `${site...}` interpolation in the template with the matching `LEGACY` field (lines ~151-153 and any email/name references). Run `npx tsc --noEmit` to catch any left behind.

- [ ] **Step 5: Update every phone consumer**

- `src/app/contact/page.tsx:30-41`: replace the single phone detail with one detail per phone:
  ```tsx
  ...site.contact.phones.map((p) => ({
    icon: IconPhone,
    label: `Phone, ${p.label}`,
    value: p.display,
    sub: site.contact.hours,
    href: `tel:${p.tel}`,
  })),
  ```
  (match the existing detail object keys in that file; keep its icon variable names), and change the address `sub` to `` `${site.contact.address.city}, delivering across Nigeria` ``.
- `src/components/checkout/checkout-view.tsx:195-207`: render `site.contact.phones.map((p) => <a key={p.tel} href={`tel:${p.tel}`} className="font-semibold text-ink hover:text-gold-deep">{p.display}</a>)` joined with " or ".
- `src/app/returns/page.tsx:69` and `src/app/track/page.tsx:51` keep `site.contact.whatsappDisplay` (still exists).
- `src/components/seo/json-ld.tsx:44`: `telephone: site.contact.phones[0].tel,` and `logo: \`${site.url}/brand/nuvene-primary.png\`,`.
- WhatsApp prefills: `track-form.tsx:298-299` "Hi Nuvene, I'd like an update on my order ..."; `product-buy-panel.tsx:144` "Hi Nuvene, I'm interested in ..."; `contact/page.tsx:103` "Hello Nuvene, I'd like help choosing a product for my skin concern."

- [ ] **Step 6: Metadata, manifest, OG image, contact route, storage keys**

`src/app/layout.tsx` metadata:
```ts
const defaultTitle = `${site.name}, skincare matched to your concern`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [
    "original skincare Nigeria",
    "skincare Abuja",
    "CeraVe Abuja",
    "The Ordinary Nigeria",
    "COSRX Nigeria",
    "wholesale skincare Nigeria",
    "Nuvene Beauty",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: site.url,
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};
```
Existing page-level titles like `"Wholesale & Retail Supply"` keep working with the new `%s | Nuvene Beauty` template.

`src/app/manifest.ts`: `background_color: "#E1DAC6"`, `theme_color: "#4F6A54"`, icons:
```ts
icons: [
  { src: "/brand/nuvene-icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "/brand/nuvene-icon-512.png", sizes: "512x512", type: "image/png" },
],
```

`src/app/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { LOGO_STACKED } from "@/components/brand/nuvene-logo-paths";

export const alt = "Nuvene Beauty, skincare matched to your concern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_STACKED.viewBox}" style="--logo-mark:#E1DAC6;--logo-word:#FFFFFF">${LOGO_STACKED.body}</svg>`,
)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#5E7C63",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {[
          { top: 48, left: 48, borderTop: "3px solid #E1DAC6", borderLeft: "3px solid #E1DAC6" },
          { top: 48, right: 48, borderTop: "3px solid #E1DAC6", borderRight: "3px solid #E1DAC6" },
          { bottom: 48, left: 48, borderBottom: "3px solid #E1DAC6", borderLeft: "3px solid #E1DAC6" },
          { bottom: 48, right: 48, borderBottom: "3px solid #E1DAC6", borderRight: "3px solid #E1DAC6" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />
        ))}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={470} height={200} alt="" />
        <div style={{ marginTop: 44, fontSize: 30, color: "#FFFFFF" }}>
          Concern matched. Transparently sourced.
        </div>
        <div style={{ marginTop: 12, fontSize: 18, letterSpacing: 4, color: "#E1DAC6", textTransform: "uppercase" }}>
          Beauty you can trust
        </div>
      </div>
    ),
    { ...size },
  );
}
```
If Satori does not resolve the CSS variables inside the data-URI SVG (the logo renders black), replace `var(--logo-mark,currentColor)` and `var(--logo-word,currentColor)` in the string with literal `#E1DAC6` and `#FFFFFF` before encoding: `LOGO_STACKED.body.replaceAll("var(--logo-mark,currentColor)", "#E1DAC6").replaceAll("var(--logo-word,currentColor)", "#FFFFFF")`.

`src/app/api/contact/route.ts`: default inbox `process.env.CONTACT_INBOX || "nuvenebeauty@gmail.com"`, default sender `process.env.CONTACT_FROM || "Nuvene Website <noreply@nuvenebeauty.com>"`.

`src/lib/cart-store.ts:74`: `{ name: "nuvene-cart" }`. `src/proxy.ts:13`: `const PREVIEW_COOKIE = "site_preview";`. `package.json`: `"name": "nuvene_web"`.

- [ ] **Step 7: Test, typecheck, commit**

Run: `npm test; npx tsc --noEmit`
Expected: site tests PASS. Remaining type errors only in `button.tsx`/`cta-band.tsx` variant names (fixed in Task 5).

```bash
git add -A src package.json tests/site.test.ts
git commit -m "Switch site config, metadata and contact details to Nuvene"
```

---

### Task 5: Shared primitives

**Files:**
- Modify: `package.json` (add `@phosphor-icons/react`), `src/components/ui/icons.tsx` (whole file), `src/components/ui/button.tsx:5-20`, `src/components/ui/section-heading.tsx` (whole file), `src/components/ui/page-hero.tsx` (whole file), `src/components/ui/cta-band.tsx` (whole file), `src/components/shop/product-card.tsx` (whole file), `src/components/shop/filter-rail.tsx` (concern label), every `outlineLight` call site on a light ground

**Interfaces:**
- Consumes: `NuveneIcon` (Task 3), `concernShort` (Task 1).
- Produces: `Button`/`ButtonLink` variants `"ink" | "gold" | "outline" | "outlineGold" | "outlineLight" | "white" | "ghost"`; `SectionHeading` with optional `kicker`; `CtaBand` tones `"ink" | "gold" | "sage"`; new icon exports `IconUser`, `IconStorefront`, `IconGlobe` alongside the existing 20 names.

- [ ] **Step 1: Install Phosphor and confirm the names exist**

Run: `npm install @phosphor-icons/react@^2.1`
Then:
```powershell
node --input-type=module -e "const m = await import('@phosphor-icons/react/ssr'); const want = ['ListIcon','XIcon','HandbagIcon','MagnifyingGlassIcon','ArrowRightIcon','CheckIcon','EnvelopeSimpleIcon','PhoneIcon','MapPinIcon','CaretDownIcon','PlusIcon','MinusIcon','TrashIcon','ShieldCheckIcon','TruckIcon','LeafIcon','InstagramLogoIcon','TiktokLogoIcon','FacebookLogoIcon','WhatsappLogoIcon','UserIcon','StorefrontIcon','GlobeHemisphereEastIcon']; console.log('missing:', want.filter((n) => !m[n]))"
```
Expected: `missing: []`. If any are missing, use the unsuffixed name (`List`, `X`, ...) for that glyph.

- [ ] **Step 2: Replace `src/components/ui/icons.tsx`**

```tsx
import type { SVGProps } from "react";
import {
  ArrowRightIcon,
  CaretDownIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  GlobeHemisphereEastIcon,
  HandbagIcon,
  InstagramLogoIcon,
  LeafIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  TiktokLogoIcon,
  TrashIcon,
  TruckIcon,
  UserIcon,
  WhatsappLogoIcon,
  XIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "ref">;

// Call sites still pass the width/height/strokeWidth they used with the old
// hand-drawn set; map them onto Phosphor's size and weight.
function glyph(G: Icon) {
  function Glyph({ width, height, strokeWidth, ...rest }: IconProps) {
    const size = width ?? height ?? 20;
    const weight = Number(strokeWidth) >= 2.2 ? "bold" : "regular";
    return <G size={size} weight={weight} aria-hidden {...rest} />;
  }
  return Glyph;
}

export const IconMenu = glyph(ListIcon);
export const IconClose = glyph(XIcon);
export const IconBag = glyph(HandbagIcon);
export const IconSearch = glyph(MagnifyingGlassIcon);
export const IconArrowRight = glyph(ArrowRightIcon);
export const IconCheck = glyph(CheckIcon);
export const IconMail = glyph(EnvelopeSimpleIcon);
export const IconPhone = glyph(PhoneIcon);
export const IconPin = glyph(MapPinIcon);
export const IconChevronDown = glyph(CaretDownIcon);
export const IconPlus = glyph(PlusIcon);
export const IconMinus = glyph(MinusIcon);
export const IconTrash = glyph(TrashIcon);
export const IconShield = glyph(ShieldCheckIcon);
export const IconTruck = glyph(TruckIcon);
export const IconLeaf = glyph(LeafIcon);
export const IconInstagram = glyph(InstagramLogoIcon);
export const IconTiktok = glyph(TiktokLogoIcon);
export const IconFacebook = glyph(FacebookLogoIcon);
export const IconWhatsapp = glyph(WhatsappLogoIcon);
export const IconUser = glyph(UserIcon);
export const IconStorefront = glyph(StorefrontIcon);
export const IconGlobe = glyph(GlobeHemisphereEastIcon);
```

- [ ] **Step 3: Button variants (`src/components/ui/button.tsx:5-20`)**

```ts
type Variant = "ink" | "gold" | "outline" | "outlineGold" | "outlineLight" | "white" | "ghost";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-white border border-ink hover:bg-ink-lift",
  gold: "bg-gold text-ink border border-gold hover:bg-white hover:border-white",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-white",
  outlineGold: "bg-transparent text-gold-deep border border-gold hover:bg-gold hover:text-ink",
  outlineLight: "bg-transparent text-white border border-white/70 hover:bg-white hover:text-ink",
  white: "bg-white text-ink border border-white hover:bg-linen hover:border-linen",
  ghost: "bg-transparent text-ink hover:text-gold-deep",
};
```
Add `active:translate-y-px` to `baseClass`, keep `transition-colors` and add `transition-transform` by changing it to `transition-[color,background-color,border-color,transform] duration-200`. Default `variant` in `buttonClass` becomes `"ink"`.

Then find light-ground uses of the old gold-outline look: `Select-String -Path src -Recurse -Pattern 'variant="outlineLight"'` (or the `Get-ChildItem | Select-String` form). For each hit on a white or linen section (inner pages, filter states), change to `variant="outlineGold"`. Hits inside sage, ink or gold sections stay `outlineLight` and drop any `!border-white/30 !text-white/80` override classes.

- [ ] **Step 4: Section heading (`src/components/ui/section-heading.tsx`)**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Optional kicker, Cinzel title and optional intro, stacked. `tone="dark"`
 * is for sage, sage-night and ink bands.
 */
export function SectionHeading({
  kicker,
  title,
  intro,
  tone = "light",
  align = "start",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {kicker && (
        <span
          className={cn(
            "kicker",
            align === "center" && "kicker--center",
            tone === "dark" && "kicker--onDark",
          )}
        >
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          "display text-[clamp(1.65rem,3vw,2.5rem)]",
          tone === "dark" ? "text-white [&_em]:text-linen" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "prose-body mt-1 max-w-[60ch] text-[0.95rem]",
            align === "center" && "mx-auto",
            tone === "dark" && "text-white/85",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
```

- [ ] **Step 5: Page hero (`src/components/ui/page-hero.tsx`)**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { NuveneIcon } from "@/components/brand/nuvene-logo";

export function PageHero({
  kicker,
  title,
  intro,
  breadcrumb,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  breadcrumb?: { name: string; href: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-sage-night">
      <NuveneIcon className="pointer-events-none absolute -right-16 top-1/2 h-64 -translate-y-1/2 text-linen opacity-[0.07] sm:h-80" />
      <div className="section relative z-10 py-14 lg:py-20">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.1em] text-white/75">
              {breadcrumb.map((b, i) => (
                <li key={b.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-linen/60">/</span>}
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-linen">{b.name}</span>
                  ) : (
                    <Link href={b.href} className="hover:text-white">
                      {b.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal>
          <span className="kicker kicker--onDark">{kicker}</span>
          <h1 className="display mt-3 max-w-3xl text-[clamp(1.9rem,4vw,3.1rem)] text-white [&_em]:text-linen">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-white/85">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: CTA band (`src/components/ui/cta-band.tsx`)**

```tsx
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TONES = {
  ink: { bg: "bg-ink", title: "text-white", body: "text-white/80", primary: "gold", secondary: "outlineLight" },
  sage: { bg: "bg-sage-shade", title: "text-white", body: "text-white", primary: "white", secondary: "outlineLight" },
  gold: { bg: "bg-gold", title: "text-ink", body: "text-ink/80", primary: "ink", secondary: "outline" },
} as const;

export function CtaBand({
  kicker,
  title,
  body,
  primary,
  secondary,
  tone = "ink",
}: {
  kicker?: string;
  title: ReactNode;
  body?: ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <section className={cn("section section-y text-center", t.bg)}>
      <Reveal className="mx-auto max-w-2xl">
        {kicker && (
          <span className={cn("kicker kicker--center mx-auto justify-center", tone !== "gold" && "kicker--onDark", tone === "gold" && "text-ink")}>
            {kicker}
          </span>
        )}
        <h2 className={cn("display mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)] [&_em]:text-inherit", t.title)}>
          {title}
        </h2>
        {body && <p className={cn("mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed", t.body)}>{body}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={primary.href} variant={t.primary} size="lg">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href} variant={t.secondary} size="lg">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 7: Product card (`src/components/shop/product-card.tsx`)**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/ops/types";
import { concernShort } from "@/lib/ops/concerns";
import { cn } from "@/lib/utils";
import { NuveneIcon } from "@/components/brand/nuvene-logo";
import { IconCheck } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const href = `/shop/${product.slug}`;
  const discounted = product.compareAtPrice && product.compareAtPrice > product.price;
  const concern = product.concerns[0];

  return (
    <article
      className={cn(
        "group flex flex-col border border-linen-mid bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_40px_-32px_rgba(0,0,0,0.4)] motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[4/5] overflow-hidden bg-linen-soft"
      >
        {discounted && (
          <span className="absolute right-0 top-0 z-10 bg-ink px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white">
            Sale
          </span>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
            className="object-contain p-[11%] mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <NuveneIcon className="h-10 text-linen-mid" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
            {product.brand}
          </p>
          <span className="auth-tag shrink-0">
            <IconCheck width={10} height={10} strokeWidth={2.4} /> Original
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-[0.95rem] leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>
        {concern && (
          <span className="mt-2.5 w-fit bg-sage-pale px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-sage-deep">
            {concernShort(concern)}
          </span>
        )}
        <div className="mt-auto flex flex-col gap-2.5 border-t border-linen-mid pt-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="flex flex-col leading-none">
            <Price amount={product.price} className="font-serif text-lg text-ink" />
            {discounted && (
              <span className="mt-1 text-xs text-stone line-through">
                <Price amount={product.compareAtPrice!} />
              </span>
            )}
          </div>
          <AddToCartButton product={product} full className="sm:w-auto" />
        </div>
      </div>
    </article>
  );
}
```
In `filter-rail.tsx` the concern list keeps `{c.label}` (full label reads better in a vertical list).

- [ ] **Step 8: Typecheck, lint, build**

Run: `npx tsc --noEmit; npm run lint; npm test`
Expected: clean. Fix any remaining `variant=`/`tone=` value the codemod produced that these types reject.

- [ ] **Step 9: Commit**

```bash
git add -A package.json package-lock.json src/components/ui src/components/shop src
git commit -m "Restyle shared buttons, headings, cards and icons for Nuvene"
```

---

### Task 6: Header, announcement bar and footer

**Files:**
- Modify: `src/components/layout/site-header.tsx` (announcement, scroll detection, CTA labels, drawer), `src/components/layout/site-footer.tsx` (whole file), `src/app/layout.tsx` (scroll sentinel)

**Interfaces:**
- Consumes: `NuveneLockup`, `NuveneStacked` (Task 3), `site`, `nav`, `footerNav` (Task 4).

- [ ] **Step 1: Add a scroll sentinel in `layout.tsx`**

Directly after `<body ...>` add:
```tsx
<div id="top-sentinel" aria-hidden className="pointer-events-none absolute left-0 top-0 h-2 w-px" />
```

- [ ] **Step 2: Header changes (`site-header.tsx`)**

Replace the scroll effect (the one calling `window.addEventListener("scroll", ...)`) with:
```tsx
useEffect(() => {
  const sentinel = document.getElementById("top-sentinel");
  if (!sentinel) return;
  const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
  io.observe(sentinel);
  return () => io.disconnect();
}, []);
```
Replace the announcement block with:
```tsx
<div className="bg-sage-dusk">
  <div className="section flex items-center justify-between gap-4 py-2.5">
    <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white">
      {site.positioning}
      <span className="hidden sm:inline"> Delivery across Nigeria.</span>
    </p>
    <Link
      href="/authenticity"
      className="hidden shrink-0 text-[0.6rem] uppercase tracking-[0.12em] text-white underline-offset-4 hover:underline sm:block"
    >
      Our sourcing promise
    </Link>
  </div>
</div>
```
Nav bar: shadow becomes `shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]`; active link classes `border-gold text-ink`, inactive `text-stone hover:text-ink`; the logo link renders `<NuveneLockup className="h-8 w-auto sm:h-9" />`. Header buttons: `<ButtonLink href="/wholesale" variant="outline" size="sm">Wholesale</ButtonLink>` and `<ButtonLink href="/shop" variant="ink" size="sm">Shop by concern</ButtonLink>`. Cart badge: `bg-gold text-ink`. Drawer: panel `bg-linen`, backdrop `bg-ink/50`, links `font-serif text-lg` with active `text-gold-deep`, bottom CTAs "Shop by concern" (`ink`) and "Apply for wholesale" (`outline`). Drawer header uses `<NuveneLockup className="h-7 w-auto" />`.

At 1280px the nav must stay on one line: if it wraps, drop the header "Wholesale" button below `2xl` (wrap it in `<span className="hidden 2xl:inline-flex">`), since Wholesale is already a nav item.

- [ ] **Step 3: Footer (`site-footer.tsx`)**

```tsx
import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { NuveneStacked } from "@/components/brand/nuvene-logo";
import { IconFacebook, IconInstagram, IconTiktok } from "@/components/ui/icons";

const socials = [
  { label: "Instagram", href: site.social.instagram, Icon: IconInstagram },
  { label: "TikTok", href: site.social.tiktok, Icon: IconTiktok },
  { label: "Facebook", href: site.social.facebook, Icon: IconFacebook },
];

const columns = [
  { title: "Explore", links: footerNav.explore },
  { title: "Business", links: footerNav.business },
  { title: "Support", links: footerNav.support },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink-surface text-linen">
      <div className="section py-14">
        <div className="grid gap-10 border-b border-gold/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <NuveneStacked tone="linen" className="h-14 w-auto" />
            <p className="mt-5 text-sm leading-relaxed text-linen/75">
              Skincare matched to your concern, bought through named distributors
              and backed by our replace-or-refund guarantee.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-linen/75">
              {site.contact.address.line1}, {site.contact.address.line2},{" "}
              {site.contact.address.city}
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-gold/25 text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-linen/75 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-linen/65">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="text-xs text-linen/65 hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="text-xs text-linen/65 hover:text-white">Terms of use</Link>
            <Link href="/authenticity" className="text-xs text-linen/65 hover:text-white">Sourcing promise</Link>
          </div>
        </div>

        <p className="mt-6 border-t border-gold/15 pt-6 text-center text-xs text-linen/65">
          Built with love by{" "}
          <a
            href="https://wa.me/2348090520578?text=I%20will%20like%20a%20website%20designed"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gold transition-colors hover:text-white"
          >
            PhoenixITNg
          </a>
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Check in the browser**

Run (separate terminal): `$env:MAINTENANCE_MODE='off'; npm run dev -- -p 3111`
Visit `http://localhost:3111/?still=1` at 1440, 1280, 768 and 375 widths. Expected: nav on one line at 1280 and 1440; drawer opens and closes at 375; announcement text fits on one line at 375 (only the positioning sentence shows); footer columns stack cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout src/app/layout.tsx
git commit -m "Rebuild the header, announcement bar and footer for Nuvene"
```

---

### Task 7: Home hero, stats and "What we do"

**Files:**
- Modify: `src/components/home/hero.tsx` (whole file), `src/components/home/stats.tsx` (whole file), `src/components/home/what-we-do.tsx` (whole file)

**Interfaces:**
- Consumes: `src/assets/photos/hero-cream.jpg` (Task 3), `.hero-lines`, `.hero-photo`, `.tick-frame--linen` (Task 2), `site.stats` (Task 4).

- [ ] **Step 1: Hero (`hero.tsx`)**

```tsx
import Image from "next/image";
import heroPhoto from "@/assets/photos/hero-cream.jpg";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section className="grid bg-sage-shade lg:grid-cols-[1.08fr_0.92fr]">
      <div className="section flex flex-col justify-center py-14 sm:py-20 lg:py-24 lg:pr-14">
        <Reveal direction="fade" className="flex items-center gap-3">
          <span className="h-px w-8 bg-linen" />
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white">
            Beauty you can trust
          </span>
        </Reveal>

        <h1 className="display hero-lines mt-6 text-[clamp(1.8rem,3.7vw,3.4rem)] text-white">
          <span className="line">
            <span style={{ ["--i" as string]: 0 }}>The right skincare</span>
          </span>
          <span className="line">
            <span style={{ ["--i" as string]: 1 }}>
              for your <em className="text-ink">real concern</em>
            </span>
          </span>
        </h1>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-white">
            Original skincare from named distributors, matched to your concern,
            and replaced or refunded if ever confirmed counterfeit.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" variant="gold" size="lg">
            Shop by concern
          </ButtonLink>
          <ButtonLink href="/partner" variant="outlineLight" size="lg">
            Partner with us
          </ButtonLink>
        </Reveal>
      </div>

      <div className="flex items-center justify-center bg-sage-dusk px-6 py-12 sm:px-10 lg:py-16">
        <div className="relative w-full max-w-[24rem] lg:max-w-[28rem]">
          <div className="tick-frame tick-frame--linen border border-linen/35 p-3">
            <span className="tick-bl" />
            <span className="tick-br" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={heroPhoto}
                alt="A woman with her eyes closed smoothing a dab of moisturiser onto her cheek in soft sunlight"
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 90vw, 28rem"
                className="hero-photo object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 flex h-24 w-24 flex-col items-center justify-center bg-gold text-center sm:-left-6 lg:-left-10">
            <span className="font-serif text-[1.05rem] leading-none text-ink">Replace</span>
            <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-ink">
              or refund
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Stats (`stats.tsx`)**

```tsx
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function StatsBar() {
  return (
    <section className="bg-gold" aria-label="Nuvene Beauty in numbers">
      <Stagger className="section grid grid-cols-2 lg:grid-cols-4">
        {site.stats.map((stat, i) => (
          <StaggerItem
            key={stat.label}
            className={cn(
              "flex flex-col items-center gap-1.5 px-3 py-7 text-center",
              i % 2 === 0 && "border-r border-ink/15",
              i < 2 && "border-b border-ink/15 lg:border-b-0",
              i === 1 && "lg:border-r",
              i === 2 && "lg:border-r",
            )}
          >
            <span className="font-serif text-[1.9rem] leading-none text-ink">{stat.value}</span>
            <span className="max-w-[16ch] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ink/80">
              {stat.label}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
```

- [ ] **Step 3: What we do (`what-we-do.tsx`)**

```tsx
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const pillars = [
  {
    n: "01",
    title: "Match",
    body: "Tell us what you're dealing with: acne, dryness, dark spots, sensitivity or sun. We recommend the active and the product that suit it, across every brand we carry.",
  },
  {
    n: "02",
    title: "Disclose",
    body: "We name the distributor each product comes from. Where a brand offers a batch checker, as COSRX does, we run it with you.",
  },
  {
    n: "03",
    title: "Guarantee",
    body: "If a product you bought from us is ever confirmed counterfeit, we replace it or refund you. The risk sits with us.",
  },
];

export function WhatWeDo() {
  return (
    <section className="section section-y bg-white">
      <SectionHeading
        title={
          <>
            Three habits behind <em>every sale</em>
          </>
        }
        intro="We start with your concern, tell you where the product came from, and stand behind it."
      />
      <Stagger className="mt-12 grid gap-px border border-linen-mid bg-linen-mid md:grid-cols-3">
        {pillars.map((p) => (
          <StaggerItem key={p.n} className="group bg-white p-8 lg:p-10">
            <div className="font-serif text-[2.6rem] leading-none text-gold-pale transition-colors duration-500 group-hover:text-gold">
              {p.n}
            </div>
            <h3 className="mt-4 font-serif text-xl text-ink">{p.title}</h3>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-stone">{p.body}</p>
            <div className="mt-5 h-0.5 w-7 origin-left bg-gold transition-transform duration-500 group-hover:scale-x-[1.7]" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
```
(The underline grows with `scale-x` instead of `width`, so it animates on the compositor.)

- [ ] **Step 4: Check in the browser**

At `http://localhost:3111/` (no `still`), watch the headline lines rise in and the photo settle. At 375px: headline wraps cleanly within the gutter, CTAs wrap to two rows without overflow, photo column follows the copy, badge stays inside the viewport. Then `?still=1` and reduced motion (DevTools rendering panel) show everything static and visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/hero.tsx src/components/home/stats.tsx src/components/home/what-we-do.tsx
git commit -m "Build the sage hero, gold stats band and Match/Disclose/Guarantee pillars"
```

---

### Task 8: Featured products, "Who we serve" and the brand portfolio

**Files:**
- Modify: `src/components/home/featured-products.tsx` (whole file), `src/components/home/who-we-serve.tsx` (whole file), `src/components/home/brands-preview.tsx` (whole file)

**Interfaces:**
- Consumes: `CONCERNS` (Task 1), `IconUser`, `IconStorefront`, `IconGlobe`, `IconArrowRight` (Task 5), `ProductCard` (Task 5).

- [ ] **Step 1: Featured products (`featured-products.tsx`)**

```tsx
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/ops/products";
import { CONCERNS } from "@/lib/ops/concerns";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

const chips = [
  { label: "All", href: "/shop" },
  ...CONCERNS.map((c) => ({ label: c.short, href: `/shop?concern=${c.slug}` })),
];

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  if (products.length === 0) return null;

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          title={
            <>
              Shop by <em>skin concern</em>
            </>
          }
        />
        <nav
          aria-label="Shop by concern"
          className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {chips.map((chip, i) => (
            <Link
              key={chip.href}
              href={chip.href}
              className={
                i === 0
                  ? "shrink-0 border border-ink bg-ink px-3.5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white"
                  : "shrink-0 border border-linen-mid bg-white px-3.5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-stone transition-colors hover:border-ink hover:text-ink"
              }
            >
              {chip.label}
            </Link>
          ))}
        </nav>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 text-center">
        <ButtonLink href="/shop" variant="outlineGold" size="md">
          View all products
        </ButtonLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Who we serve (`who-we-serve.tsx`)**

```tsx
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { IconArrowRight, IconGlobe, IconStorefront, IconUser } from "@/components/ui/icons";

const audiences = [
  {
    accent: "border-t-gold",
    Icon: IconUser,
    title: "Individual customers",
    body: "Skincare matched to your concern, with the source named on every product and our replace-or-refund guarantee behind it.",
    cta: "Shop by concern",
    href: "/shop",
  },
  {
    accent: "border-t-sage-mid",
    Icon: IconStorefront,
    title: "Retailers and wholesalers",
    body: "Pharmacies, clinics, spas and beauty stores get original stock from named distributors, steady supply and one price list for everyone.",
    cta: "Apply for wholesale",
    href: "/wholesale",
  },
  {
    accent: "border-t-linen/50",
    Icon: IconGlobe,
    title: "International brand partners",
    body: "Effective brands that are new to Nigeria get a structured, honest route to customers, retailers and skincare professionals.",
    cta: "Start a conversation",
    href: "/partner",
  },
];

export function WhoWeServe() {
  return (
    <section className="section section-y bg-sage-night">
      <SectionHeading
        tone="dark"
        kicker="Who we serve"
        title={
          <>
            Three ways to <em>work with us</em>
          </>
        }
      />
      <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
        {audiences.map(({ accent, Icon, title, body, cta, href }) => (
          <StaggerItem
            key={title}
            className={`flex flex-col gap-4 border border-t-2 border-linen/15 ${accent} bg-white/[0.03] p-7 transition-colors duration-300 hover:bg-white/[0.07]`}
          >
            <span className="flex h-11 w-11 items-center justify-center border border-linen/25 text-linen">
              <Icon width={20} height={20} />
            </span>
            <h3 className="font-serif text-lg text-white">{title}</h3>
            <p className="text-[0.88rem] leading-relaxed text-white/85">{body}</p>
            <Link
              href={href}
              className="group/cta mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-linen"
            >
              {cta}
              <IconArrowRight
                width={14}
                height={14}
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
              />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
```

- [ ] **Step 3: Brand portfolio (`brands-preview.tsx`)**

Keep the data logic (lines 1-17 of the current file). Replace the returned markup with:
```tsx
<section className="section section-y bg-linen">
  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
    <SectionHeading
      title={
        <>
          Brands we <em>carry</em>
        </>
      }
    />
    <ButtonLink href="/brands" variant="outlineGold" size="sm" className="w-fit">
      View all brands
    </ButtonLink>
  </div>

  <Stagger className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
    {brands.map((b) => {
      const logo = brandLogoSrc(b.slug);
      return (
        <StaggerItem key={b.slug}>
          <Link
            href={`/brands/${b.slug}`}
            className="group flex h-20 items-center justify-center border border-linen-mid bg-white px-3 text-center transition-colors duration-300 hover:border-gold"
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={b.name}
                loading="lazy"
                className="max-h-9 w-auto max-w-[85%] object-contain opacity-85 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            ) : (
              <span className="font-serif text-sm tracking-wide text-ink/80 transition-colors group-hover:text-ink">
                {b.name}
              </span>
            )}
          </Link>
        </StaggerItem>
      );
    })}
  </Stagger>

  <div className="mt-4 flex flex-col items-start justify-between gap-3 border border-gold-pale bg-linen-soft px-6 py-5 sm:flex-row sm:items-center">
    <p className="font-serif text-base text-ink">Bringing your brand to Nigeria?</p>
    <a
      href="#partners"
      className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
    >
      How partnerships work
      <IconArrowRight width={14} height={14} />
    </a>
  </div>
</section>
```
Add `import { IconArrowRight } from "@/components/ui/icons";`.

- [ ] **Step 4: Check and commit**

In the browser at 375px: concern chips scroll sideways inside their own row (the page does not), product cards keep two columns with no overflow, the brand grid shows two columns.

```bash
git add src/components/home/featured-products.tsx src/components/home/who-we-serve.tsx src/components/home/brands-preview.tsx
git commit -m "Rebuild featured products, audiences and brand portfolio sections"
```

---

### Task 9: Wholesale, brand partners, education and contact sections

**Files:**
- Modify: `src/components/home/wholesale-preview.tsx`, `src/components/home/partner-cta.tsx`, `src/components/home/education-preview.tsx`, `src/components/home/contact-section.tsx` (whole files)

**Interfaces:**
- Consumes: `getEducationArticles()` from `@/lib/ops/blog` (returns `Article[]` with optional `coverImage`), `ContactForm` (`tone="dark"`), `site.contact.phones` (Task 4).

- [ ] **Step 1: Wholesale (`wholesale-preview.tsx`)**

Keep the current structure and classes (they were codemodded in Task 2) and change only data and labels:
```tsx
const benefits = [
  "Original stock from named distributors",
  "One centralised price list",
  "Steady, planned supply",
  "Product training for your team",
];

const steps = [
  { n: 1, title: "Apply", body: "Send your business details and the products you're interested in." },
  { n: 2, title: "Review", body: "We look over your details and confirm the next steps with you." },
  { n: 3, title: "Onboarding", body: "You receive our wholesale price list and we set up your account." },
  { n: 4, title: "Ordering", body: "Order through a named contact, with product training as you need it." },
];
```
Heading: `kicker="Wholesale"`, title `<>A supply partner <em>you can check</em></>`, intro `"For pharmacies, dermatology clinics, spas, beauty stores and skincare professionals who need original stock on a steady schedule."`. CTA: `<ButtonLink href="/wholesale" variant="ink" size="lg">Apply for wholesale</ButtonLink>`. "How it works" label: `text-gold-deep`. Benefit tick: `bg-sage-pale text-sage-deep`.

- [ ] **Step 2: Brand partners (`partner-cta.tsx`)**

```tsx
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

const points = [
  {
    title: "Structured market entry",
    body: "A planned rollout through our retail, wholesale and online channels, starting in Abuja.",
  },
  {
    title: "Honest representation",
    body: "Your products sold under our match, disclose and guarantee promise, with education for customers and retailers.",
  },
  {
    title: "Distribution and feedback",
    body: "Steady distribution to retailers and skincare professionals, with what customers tell us passed back to you.",
  },
];

export function PartnerCta() {
  return (
    <section id="partners" className="section section-y scroll-mt-28 bg-sage-shade text-center">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="display text-[clamp(1.9rem,3.8vw,2.8rem)] text-white">
          Entering Nigeria <em className="text-linen">the right way</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white">
          We work with effective international brands that are not yet household
          names here, and give them a careful, credible way in.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/partner" variant="white" size="lg">
            Start a conversation
          </ButtonLink>
          <ButtonLink href="/partner#criteria" variant="outlineLight" size="lg">
            What we look for
          </ButtonLink>
        </div>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-4xl gap-px border border-white/15 bg-white/15 md:grid-cols-3">
        {points.map((p) => (
          <StaggerItem key={p.title} className="bg-sage-shade p-6 text-left">
            <h3 className="font-serif text-base text-white">{p.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-white">{p.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
```

- [ ] **Step 3: Education (`education-preview.tsx`)**

```tsx
import Image from "next/image";
import Link from "next/link";
import { getEducationArticles } from "@/lib/ops/blog";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import { NuveneIcon } from "@/components/brand/nuvene-logo";

const COVERS = [
  "bg-sage-shade text-linen",
  "bg-ink text-gold",
  "bg-gold text-ink",
];

export async function EducationPreview() {
  const posts = (await getEducationArticles()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          title={
            <>
              Know your skin, <em>trust your routine</em>
            </>
          }
        />
        <ButtonLink href="/education" variant="outlineGold" size="sm" className="w-fit">
          Browse all articles
        </ButtonLink>
      </div>

      <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {posts.map((post, i) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/education/${post.slug}`}
              className="group flex h-full flex-col border border-linen-mid bg-white transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_26px_40px_-32px_rgba(0,0,0,0.4)] motion-reduce:hover:translate-y-0"
            >
              <div className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden ${COVERS[i % COVERS.length]}`}>
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <NuveneIcon className="h-12 opacity-40 transition-transform duration-700 group-hover:scale-110" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-sage-deep">
                  {post.tag}
                </span>
                <h3 className="mt-2 font-serif text-base leading-snug text-ink transition-colors group-hover:text-gold-deep">
                  {post.title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                  Read article
                  <IconArrowRight width={13} height={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
```
If `next/image` rejects an ops cover host, add that host to `images.remotePatterns` in `next.config.ts` (check how product images are already allowed there and mirror it).

- [ ] **Step 4: Contact (`contact-section.tsx`)**

Replace the `details` array and the WhatsApp card:
```tsx
const details = [
  {
    icon: <IconMail width={16} height={16} className="text-gold" />,
    main: site.contact.email,
    sub: "General enquiries",
    href: `mailto:${site.contact.email}`,
  },
  ...site.contact.phones.map((p) => ({
    icon: <IconPhone width={16} height={16} className="text-gold" />,
    main: p.display,
    sub: `${p.label}, ${site.contact.hours}`,
    href: `tel:${p.tel}`,
  })),
  {
    icon: <IconPin width={16} height={16} className="text-gold" />,
    main: `${site.contact.address.line2}, ${site.contact.address.city}`,
    sub: site.contact.address.line1,
    href: undefined,
  },
];
```
Key the rows by `d.main` instead of `d.sub` (two phones share a format). Heading: `kicker="Contact"`, title `<>Let&apos;s talk <em className="text-gold">skincare</em></>`. Detail text: main `text-white`, sub `text-linen/75`. WhatsApp card:
```tsx
<a
  href={whatsappLink("Hello Nuvene, I'd like help choosing a product for my skin concern.")}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-7 flex items-center gap-3.5 border border-gold/25 bg-white/[0.03] px-5 py-4 transition-colors hover:border-gold"
>
  <IconWhatsapp width={22} height={22} className="shrink-0 text-gold" />
  <div>
    <div className="text-sm font-semibold text-white">Chat with us on WhatsApp</div>
    <div className="mt-0.5 text-xs text-linen/75">
      Tell us your skin concern and we&apos;ll suggest what to try.
    </div>
  </div>
</a>
```
Form card: `border border-gold/20 bg-white/[0.03] p-6 sm:p-8`, heading "Send a message" in `text-white`. Imports: add `IconWhatsapp` to the icons import and keep `whatsappLink` from `@/lib/site`.

- [ ] **Step 5: Check the whole home page and commit**

At 1440 and 375, scroll the full home page. Check: band order and colours match the spec table; exactly four kickers (hero, Who we serve, Wholesale, Contact); "#partners" link from the brand strip scrolls to the sage partner band with the header not covering the title; contact form fields readable on black.

```bash
git add src/components/home
git commit -m "Rebuild wholesale, partner, education and contact sections"
```

---

### Task 10: Inner pages, part 1 (About, sourcing promise, wholesale, partner, brands)

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/authenticity/page.tsx` (whole file), `src/app/wholesale/page.tsx`, `src/app/partner/page.tsx`, `src/app/brands/page.tsx`, `src/app/brands/[slug]/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `SectionHeading`, `CtaBand` (Task 5), photos (Task 3).

- [ ] **Step 1: About (`about/page.tsx`)**

Keep the page's section structure; replace its text with the charter content below and swap the decorative brand mark for the store-shelves photo. Metadata description: `"Nuvene Beauty is an Abuja skincare company built on honesty, results and trust. Learn where the name comes from and what we promise."`

- PageHero: kicker "About Nuvene", title `<>Where the new <em>begins</em></>`, intro "Nuvene Beauty is an Abuja skincare company built on honesty, results and trust. We match each customer's real skin concern to an original product and back every purchase with a guarantee we can keep."
- Story paragraphs:
  1. "We carry two kinds of brands. Established names with a proven record, like CeraVe, The Ordinary, COSRX and Dove. And effective international brands that are new to Nigeria and want a careful, credible way in."
  2. "We buy through established distribution channels and authorised suppliers, and we say so openly. We don't claim import rights or verification powers we don't hold. What we promise, we keep."
- The name: "Nuvene means where the new begins. It's for the customer starting a new routine, and for us, relaunching with a clear identity. We want it to feel calm, natural and considered, never loud."
- Vision: "To become one of Nigeria's most trusted skincare platforms, known for honest sourcing, real results, and as a credible route into Nigeria for global beauty brands."
- Mission: "To match every customer with skincare that suits their real concern, disclose where every product comes from, and stand behind every purchase."
- Values array (replace the existing one; keep its rendering):
  ```ts
  const values = [
    { title: "Honesty first", body: "Every product we sell is original and bought through named distributors and authorised suppliers. We're open about what can and can't be checked." },
    { title: "Concern led", body: "Every recommendation starts with your concern: acne, dryness, dark spots, sensitivity or sun protection. Results matter more than trends." },
    { title: "Education", body: "We explain what each product does, why it works and who it suits, so you can choose with confidence." },
    { title: "A promise we can keep", body: "If a product is ever confirmed counterfeit, we replace it or refund you. You never carry that risk alone." },
    { title: "Customer care", body: "Clear answers, quick fixes and steady support before, during and after every purchase." },
    { title: "Careful distribution", body: "From distributor to Nuvene to retailer to you, we protect each product and keep the paperwork that shows where it came from." },
  ];
  ```
- Photo: where the page currently renders the brand mark panel (around line 110), render
  ```tsx
  <div className="relative aspect-[16/10] overflow-hidden border border-linen-mid">
    <Image src={shelves} alt="Shelves of skincare in a bright Nuvene Beauty store" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" placeholder="blur" />
  </div>
  ```
  with `import shelves from "@/assets/photos/store-shelves.jpg";` and `import Image from "next/image";`.
- Closing `CtaBand tone="sage"`: title `<>Find what works <em>for your skin</em></>`, primary "Shop by concern" `/shop`, secondary "Read our sourcing promise" `/authenticity`.

- [ ] **Step 2: Sourcing promise (`authenticity/page.tsx`, whole file)**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import bag from "@/assets/photos/shopping-bag.jpg";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Our sourcing promise",
  description:
    "How Nuvene Beauty sources skincare: we match products to your concern, name the distributor each one came from, and replace or refund anything confirmed counterfeit.",
  alternates: { canonical: `${site.url}/authenticity` },
};

const promise = [
  {
    title: "Match",
    body: "We start with your concern and recommend the active and product that suit it. We never push a product that doesn't fit what you told us.",
  },
  {
    title: "Disclose",
    body: "We buy through established distributors and authorised suppliers, and we tell you which one a product came from. Where the brand offers a batch or code checker, we run it in front of you.",
  },
  {
    title: "Guarantee",
    body: "If a product you bought from us is ever confirmed counterfeit, we replace it or refund you. Nuvene carries that risk, not you.",
  },
];

const steps = [
  { title: "Tell us", body: `Message us on WhatsApp (${site.contact.whatsappDisplay}) or by email with your order number and clear photos of the product and packaging.` },
  { title: "We look into it", body: "We check our records for the distributor and batch, and use the brand's own checker where one exists." },
  { title: "We put it right", body: "If the product is confirmed counterfeit, we replace it or refund you." },
];

export default function SourcingPromisePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Sourcing promise", url: `${site.url}/authenticity` },
        ]}
      />
      <PageHero
        kicker="Sourcing promise"
        title={
          <>
            Match. Disclose. <em>Guarantee.</em>
          </>
        }
        intro="Three habits we keep with every customer, in store, on WhatsApp and online."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Sourcing promise", href: "/authenticity" },
        ]}
      />

      <section className="section section-y bg-white">
        <Stagger className="grid gap-px border border-linen-mid bg-linen-mid md:grid-cols-3">
          {promise.map((p, i) => (
            <StaggerItem key={p.title} className="bg-white p-8">
              <div className="font-serif text-[2.4rem] leading-none text-gold-pale">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-4 font-serif text-xl text-ink">{p.title}</h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-stone">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section section-y grid items-center gap-12 bg-linen lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            title={
              <>
                What we can and <em>can&apos;t check</em>
              </>
            }
          />
          <Reveal className="prose-body mt-6 flex flex-col gap-4 text-[0.95rem]">
            <p>
              We are a reseller. We don&apos;t hold import rights for the brands we
              carry, so we don&apos;t claim to verify every product ourselves.
            </p>
            <p>
              What we can do is buy only through distributors and suppliers we can
              name, keep the invoices that prove it, and run every manufacturer
              checker that exists. Some brands offer one, many don&apos;t, and we
              tell you which is which.
            </p>
            <p>
              Our guarantee covers the gap: if a product is ever confirmed
              counterfeit, you get a replacement or a refund.
            </p>
          </Reveal>
        </div>
        <Reveal direction="left">
          <div className="relative aspect-[16/10] overflow-hidden border border-linen-mid">
            <Image
              src={bag}
              alt="A Nuvene Beauty paper shopping bag on a store counter"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="section section-y bg-white">
        <SectionHeading
          kicker="Replace or refund"
          title={
            <>
              If something <em>isn&apos;t right</em>
            </>
          }
        />
        <Reveal as="ol" className="mt-10 grid gap-6 md:grid-cols-3" delay={0.1}>
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-gold pt-5">
              <span className="font-serif text-sm text-gold-deep">{i + 1}</span>
              <h3 className="mt-1 font-serif text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-stone">{s.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <CtaBand
        tone="ink"
        title={
          <>
            Shop with <em>confidence</em>
          </>
        }
        body="Browse by concern, or learn the warning signs of a fake product."
        primary={{ label: "Shop by concern", href: "/shop" }}
        secondary={{ label: "Browse all articles", href: "/education" }}
      />
    </>
  );
}
```

- [ ] **Step 3: Wholesale page (`wholesale/page.tsx`)**

Metadata description: `"Wholesale skincare for pharmacies, clinics, spas and beauty stores in Nigeria. Original stock from named distributors, one price list, steady supply and product training."` PageHero: kicker "Wholesale", title `<>A supply partner <em>you can check</em></>`, intro "For pharmacies, dermatology clinics, spas, beauty stores and skincare professionals who need original stock on a steady schedule." Benefits:
```ts
const benefits = [
  { title: "Original stock", body: "Bought through named distributors, with the paperwork to show for it." },
  { title: "Steady supply", body: "Centralised logistics from Abuja so in-demand lines stay on your shelves." },
  { title: "One price list", body: "Standard wholesale pricing for every partner, which protects your margins and the market." },
  { title: "Product training", body: "Ingredient, routine and skin-type training so your team can match customers to the right product." },
];
```
Steps: same four as the home section (Task 9 Step 1). Benefits heading: no kicker, title `<>Why stock <em>with Nuvene</em></>`. Steps heading: kicker "How it works", title `<>Four steps to <em>wholesale access</em></>`. Form card heading "Apply for wholesale", sub "Tell us about your business and we'll get you set up." Benefit icons: `bg-sage-pale text-sage-deep`.

`src/components/forms/wholesale-form.tsx:132`: replace "Business credentials verified within 48 hours." with "We review every application and reply by email or phone."

- [ ] **Step 4: Partner page (`partner/page.tsx`)**

Metadata title `"Partner with us"`, description `"International skincare brands new to Nigeria: Nuvene offers a structured rollout, honest representation, distribution to retailers and professionals, and customer feedback."` PageHero: kicker "Brand partners", title `<>Entering Nigeria <em>the right way</em></>`, intro "We work with effective international brands that are not yet household names here, and give them a careful, credible way in." Offerings: the three `points` from Task 9 Step 2. Offerings heading: title `<>A credible route <em>into Nigeria</em></>`, no kicker. Criteria:
```ts
const criteria = [
  "Effective formulations with evidence behind them",
  "A real commitment to product quality and safety",
  "Traceable supply through the manufacturer or an authorised distributor",
  "Shared values on honesty and customer education",
  "Interest in a structured, long-term partnership",
];
```
Criteria section ground `bg-ink`; heading kicker "What we look for", title `<>The brands we <em>work with</em></>`; criteria text `text-white/85`; tick box `border-gold/30 text-gold`; form card `border-gold/20 bg-white/[0.03]`, title "Start a conversation" `text-white`, sub `text-linen/75`.

- [ ] **Step 5: Brands pages**

`brands/page.tsx:16` description: `"The skincare brands Nuvene Beauty carries in Nigeria, from CeraVe and La Roche-Posay to COSRX, Anua and Medicube, all bought through named distributors."` Line 40 intro: "We carry established names and effective international brands that are new to Nigeria. Every product is bought through named distributors and authorised suppliers." Lines 109-110 CtaBand: body "Effective international brands that are new to Nigeria get a structured, honest route to customers, retailers and skincare professionals.", primary `{ label: "Start a conversation", href: "/partner" }`, `tone="sage"`.

`brands/[slug]/page.tsx:25`: `` `Shop original ${brand.name} skincare from Nuvene Beauty, bought through named distributors and delivered across Nigeria.` ``

- [ ] **Step 6: Check and commit**

Visit `/about`, `/authenticity`, `/wholesale`, `/partner`, `/brands` and one brand at 1440 and 375 with `?still=1`.

```bash
git add src/app/about src/app/authenticity src/app/wholesale src/app/partner src/app/brands src/components/forms/wholesale-form.tsx
git commit -m "Rewrite the About, sourcing promise, wholesale, partner and brand pages"
```

---

### Task 11: Inner pages, part 2 (shop, product, education, contact, help and legal, commerce)

**Files:**
- Modify: `src/app/shop/page.tsx:19,78`, `src/app/shop/[slug]/page.tsx:33,49-51`, `src/app/education/page.tsx:15`, `src/app/education/[slug]/page.tsx:124`, `src/lib/education.ts:83-105`, `src/app/contact/page.tsx:17`, `src/app/faq/page.tsx:12,19,23,42-43`, `src/app/terms/page.tsx:11,57-62,79`, `src/app/returns/page.tsx:11,55`, `src/app/privacy/page.tsx:11,37`, `src/app/track/page.tsx:11`, `src/components/shop/demo-notice.tsx:14`, `src/app/not-found.tsx`, cart/checkout components (visual check only)

- [ ] **Step 1: Apply the string replacements**

| File:line | New text |
|---|---|
| `shop/page.tsx:19` description | "Original skincare from CeraVe, The Ordinary, COSRX and 50+ more brands, matched to your skin concern and delivered across Nigeria." |
| `shop/page.tsx:78` intro | "Every product is bought through a named distributor. Filter by concern or brand to find your match." |
| `shop/[slug]/page.tsx:33` | `` `${product.brand} ${product.name}, an original product from Nuvene Beauty, bought through a named distributor.` `` |
| `shop/[slug]/page.tsx:49` | `{ icon: IconShield, text: "Replace or refund if ever confirmed counterfeit" }` |
| `shop/[slug]/page.tsx:50` | `{ icon: IconTruck, text: "Delivery across Nigeria from Abuja" }` |
| `shop/[slug]/page.tsx:51` | `{ icon: IconCheck, text: "Bought through a named distributor" }` |
| `education/page.tsx:15` | "Skincare education from Nuvene Beauty: ingredient guides, dark spots and uneven tone on Nigerian skin, spotting fakes, and simple routines that work." |
| `education/[slug]/page.tsx:124` | "Shop original skincare" |
| `contact/page.tsx:17` | "Get in touch with Nuvene Beauty in Wuye, Abuja. Email, call or WhatsApp us about your skin concern, an order, wholesale or brand partnerships." |
| `faq/page.tsx:12` | "Answers about our sourcing, ordering, delivery across Nigeria, payments, returns and wholesale at Nuvene Beauty." |
| `faq/page.tsx:19` | "Yes. We buy only through established distributors and authorised suppliers, and we tell you which one each product came from. Where a brand offers a batch checker, we run it with you. If a product you bought from us is ever confirmed counterfeit, we replace it or refund you." |
| `faq/page.tsx:23` | "We deliver across Nigeria from Abuja. Delivery fees and timelines are confirmed at checkout based on your location." |
| `faq/page.tsx:42` | "I represent an international brand. How do I partner with Nuvene?" |
| `faq/page.tsx:43` | "Visit our Partner With Us page and start a conversation. We help effective international brands reach Nigerian customers, retailers and skincare professionals through a structured rollout." |
| `terms/page.tsx:11` | "The terms governing your use of the Nuvene Beauty website and services." |
| `terms/page.tsx` Authenticity paragraph (lines ~57-62) | "We sell only products bought through established distributors and authorised suppliers. If a product you bought from us is confirmed counterfeit, we replace it or refund you. See our <a href=\"/authenticity\">sourcing promise</a> for details." and rename the heading to "Sourcing" |
| `terms/page.tsx:79` | "To the extent permitted by law, Nuvene Beauty is not liable for indirect or" (rest of the sentence unchanged) |
| `returns/page.tsx:11` | "Nuvene Beauty returns policy: eligibility, timelines and how to request a return for skincare bought from us." |
| `returns/page.tsx:55` | "Items without proof of purchase from Nuvene Beauty." |
| `privacy/page.tsx:11` | "How Nuvene Beauty collects, uses and protects your personal information." |
| `privacy/page.tsx:37` | `(&ldquo;Nuvene&rdquo;,` (rest of the sentence unchanged) |
| `track/page.tsx:11` | "Check the status of your Nuvene Beauty order. Enter your order number and we'll help you track it." |
| `demo-notice.tsx:14` | "from the Nuvene inventory system. Live pricing and stock go live" (rest unchanged) |

The "verified defect" and "verified manufacturing defect" lines in `returns/page.tsx` and `faq/page.tsx:35` stay: they describe product faults, not authenticity.

- [ ] **Step 2: Rewrite the counterfeit article (`src/lib/education.ts:83-105`)**

```ts
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
```
Also tidy the file header comment to say articles are the fallback when ops has no published posts.

- [ ] **Step 3: Visual pass on commerce screens**

With `npm run dev` running, walk through: `/shop` (each concern chip, plus `/shop?concern=hyperpigmentation` which must filter to dark spots), a product page, add to cart, the cart drawer, `/cart`, `/checkout` (stop before payment), `/track`, `/not-found` (any bad URL). For each, at 1440 and 375, fix anything the codemod left looking wrong: white-on-gold text (switch to `text-ink`), `text-white/40`-style low-contrast text on dark grounds (raise to `/75` or more), and any `font-serif` element set in a size below 0.85rem (Cinzel small sizes read poorly; switch those to `font-sans font-semibold uppercase tracking-[0.1em]`).

- [ ] **Step 4: Typecheck, lint and commit**

Run: `npx tsc --noEmit; npm run lint`

```bash
git add -A src
git commit -m "Bring the shop, education, help and legal pages in line with the charter"
```

---

### Task 12: Load the remaining design skills and run a review pass

**Files:** whatever the reviews flag.

- [ ] **Step 1: Load the skills the client asked for**

Invoke, in order, and note any finding that applies to what is now built: `frontend-design:frontend-design`, `impeccable`, `emil-design-eng`, `build-awwwards-quality-sites`, `ui-ux-pro-max:ui-ux-pro-max`, `design-md-library`, `gpt-taste`, `ecc-taste`, `humanize-output`. Skip `img2threejs` (out of scope, see spec). Check `skill-observations/log.md` for OPEN observations tagged to any of these and apply them.

- [ ] **Step 2: Run the taste skill's pre-flight checklist against the home page**

Go through Section 14 of `design-taste-frontend` box by box for `/`. Record each box as pass, fixed, or deliberate departure (the departures already agreed in the spec: brand serif, brand palette, alternating bands, no dark mode, pillar numerals).

- [ ] **Step 3: Fix what the reviews found and commit**

```bash
git add -A src
git commit -m "Apply design review fixes"
```
(Skip the commit if nothing changed.)

---

### Task 13: Copy audit

**Files:**
- Create: `tests/copy-audit.test.ts`
- Modify: whatever it flags

- [ ] **Step 1: Write the audit test**

```ts
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const VELYN_ALLOWED = new Set([
  "lib/maintenance-page.ts",
  "lib/maintenance-velyn-lockup.ts",
  "lib/ops/config.ts",
]);

const BANNED: [string, RegExp][] = [
  ["direct sourcing claim", /sourced directly|directly from (the )?manufacturer|direct[- ]from[- ]manufacturer|direct sourcing|direct manufacturer/i],
  ["product verification claim", /\bverif(?:y|ied|ies|ication)\b(?![\s-]+(?:manufacturing\s+)?defect)/i],
  ["unbacked numbers", /\b10K\b|36 states/i],
  ["superlative", /\bpremier\b/i],
  ["brand protection claim", /brand protection/i],
  ["batch claim", /every batch/i],
  ["em or en dash", /[\u2013\u2014]/],
  ["inflated vocabulary", /\b(delve|leverage|seamless(ly)?|robust|comprehensive|elevate|unlock|harness|meticulous|testament|tapestry|game-changer)\b/i],
];

const files = (readdirSync("src", { recursive: true }) as string[])
  .map((f) => f.split(path.sep).join("/"))
  .filter((f) => /\.(tsx?|css)$/.test(f) && !f.startsWith("lib/maintenance"));

describe("copy audit", () => {
  it.each(files)("%s makes no banned claims", (f) => {
    const text = readFileSync(path.join("src", f), "utf8");
    const hits = BANNED.filter(([, re]) => re.test(text)).map(([name, re]) => `${name}: ${text.match(re)![0]}`);
    expect(hits).toEqual([]);
  });

  it.each(files.filter((f) => !VELYN_ALLOWED.has(f)))("%s does not mention Velyn", (f) => {
    expect(readFileSync(path.join("src", f), "utf8")).not.toMatch(/velyn/i);
  });
});
```
(`lib/ops/config.ts` only keeps the ops hostname default; it is allowed to mention Velyn until the ops migration.)

- [ ] **Step 2: Run it**

Run: `npx vitest run tests/copy-audit.test.ts`
Expected on first run: some failures (likely comment dashes, `verified` in auth/payment comments, stray Velyn in comments). For each:
- Code comments with em or en dashes: rewrite with a colon, comma or period.
- "verify"/"verified" about payments or signatures in `api/checkout`, `paystack.ts` or `ops/*` is a genuine technical term, not a product claim. Rephrase the comment ("confirm", "check") rather than widening the allowlist; if it is an identifier such as `verifyTransaction`, extend the test's negative lookahead to also skip `Transaction|Signature|Payment|payment|signature` and say why in a comment.
- Velyn in comments: replace with "Nuvene" or a neutral word.

- [ ] **Step 3: Humanize pass**

Load `humanize-output` (if not already loaded in Task 12). Read every user-facing string in `src/app/**/page.tsx`, `src/components/**` and `src/lib/{site,education}.ts` against its checklist: no negation flips, no rule-of-three padding, no filler openers, sentence case for headings outside uppercase-styled labels, no "serves as/boasts". Fix and re-run the test.

- [ ] **Step 4: Full test run and commit**

Run: `npm test`
Expected: all suites PASS.

```bash
git add -A src tests/copy-audit.test.ts
git commit -m "Add a copy audit for banned claims, dashes and the old brand name"
```

---

### Task 14: Responsive and accessibility QA, build, and handover

**Files:** whatever QA flags.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors. Note the route table for the QA list.

- [ ] **Step 2: Overflow check on every route at 375px**

With `$env:MAINTENANCE_MODE='off'; npm run start -- -p 3111` running, use the Playwright MCP browser at 375 x 812 for each route: `/`, `/about`, `/brands`, one `/brands/[slug]`, `/shop`, `/shop?concern=dark-spots`, one `/shop/[slug]`, `/wholesale`, `/partner`, `/education`, one `/education/[slug]`, `/contact`, `/faq`, `/authenticity`, `/returns`, `/privacy`, `/terms`, `/track`, `/cart`, `/checkout`, a 404. On each run:
```js
() => ({ overflow: document.documentElement.scrollWidth - window.innerWidth, h1: document.querySelectorAll("h1").length })
```
Expected: `overflow` is `0` and `h1` is `1` on every route. Fix any route that fails.

- [ ] **Step 3: Screenshots at three widths**

Full-page screenshots of `/`, `/shop`, one product, `/about`, `/authenticity`, `/wholesale` at 375, 768 and 1440 with `?still=1`, saved under the scratchpad. Review each for: CTA labels on one line at desktop, nav on one line at 1280 and 1440, no clipped Cinzel descenders, consistent sharp corners, images not stretched.

- [ ] **Step 4: No-JS and reduced-motion captures**

Load `/` with JavaScript disabled (Playwright `browser_run_code_unsafe` with a context created with `javaScriptEnabled: false`) and with `reducedMotion: "reduce"`. Expected: every section's content visible in both, nothing at opacity 0, the hero headline fully shown.

- [ ] **Step 5: Keyboard pass**

On `/` at 1440: Tab from the top through the header, hero CTAs, chips and the first product card. Expected: skip link appears first, every focusable element shows the gold focus outline, the mobile drawer (at 375) traps focus while open and Escape or the close button returns focus.

- [ ] **Step 6: Final checks and commit**

Run: `npm test; npm run lint; npm run build`
Expected: all green.

```bash
git add -A
git commit -m "Fix responsive and accessibility issues from QA"
```
(Skip if nothing changed.) Do not merge to `main`. Push the branch only with the client's go-ahead, so Vercel builds a preview link for sign-off.

Handover notes for the client (things outside this repo):
- The business name on Paystack receipts and checkout pages is set in the Paystack dashboard, not in code.
- Any education posts already published in ops still carry Velyn wording; edit them in ops under Blog.
- Confirm or correct: opening hours, the Facebook page URL, which number is the WhatsApp line, and whether a hello@nuvenebeauty.com mailbox will replace the Gmail address.
- Ask the designer (Melach Design) for the full-resolution hero photo; the copy in the brand guide is 736 x 919.
