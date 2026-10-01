# Nuvene Beauty storefront rebrand: design

Date: 2026-10-02
Branch: `nuvene-rebrand`
Status: approved in conversation, awaiting written-spec review

## Goal

Velyn Beauty & Essentials has relaunched as Nuvene Beauty. The storefront in
this repo must take on the Nuvene identity (brand guide), say what the Nuvene
charter says, and follow the layout of the client prototype closely, while
keeping every working feature: ops catalogue, cart, Paystack checkout,
wholesale and contact forms, order tracking, and the ops-driven education hub.
The finished site must be fully responsive and finished to a standard that
would hold up on Awwwards.

## Sources of truth

| Concern | Authority |
|---|---|
| Colours, type, logos | `nuvenebeauty.com/NUVENE BRAND GUIDE.pdf` and `nuvenebeauty.com/LOGOS/SVG` |
| What the site claims, tone, business details | `nuvenebeauty.com/Nuvene_Brand_Charter_and_Positioning.docx` (2026 relaunch edition) |
| Section order and layout | Client prototype artifact (a recolour of the old espresso wireframe) |

Where the prototype and the charter disagree, the charter wins on copy and the
brand guide wins on type. The prototype's fonts (EB Garamond, Manrope) and its
claims ("sourced directly from manufacturers", "every product verified",
"10K+ happy customers", "36 states covered") are not carried over.

## Out of scope for this spec

Each of these becomes its own piece of work after the site is approved:

1. Moving ops.velynbeauty.com to ops.nuvenebeauty.com (cPanel subdomain, SSL,
   Laravel `APP_URL`, CI `DEPLOY_PATH`, storefront `OPS_BASE_URL`).
2. Refreshing the catalogue from `NEW PRODUCTS & SELLING PRICE ... .xlsx` and
   the `Images/` folder. The sheet has no price column yet.
3. Pointing nuvenebeauty.com at Vercel (DNS lives on the same cPanel) and
   301-redirecting velynbeauty.com to it.
4. Renaming the GitHub repo and Vercel project.

Until step 1 happens, the storefront keeps reading ops at its current URL.

## Approach

Rebrand the existing app in place on the `nuvene-rebrand` branch. Production
stays behind the maintenance page (`src/proxy.ts`) until sign-off; review
happens on Vercel preview deployments and locally.

## 1. Brand system

### Colour tokens (`src/app/globals.css`, Tailwind v4 `@theme`)

| Token | Value | Use |
|---|---|---|
| `black` | `#000000` | Hero, Who we serve, footer, primary buttons |
| `ink` / `ink-soft` | `#161616` / `#242424` | Raised surfaces on black |
| `gold` | `#BD9468` | Accents, rules, stats band, large text |
| `gold-deep` | darker gold, chosen to reach 4.5:1 on linen and white | Small gold text (kickers, brand names on cards) |
| `gold-pale` | `#EDE0CE` | Hairlines, large pillar numerals |
| `linen` | `#E1DAC6` | Page base, product section, tiles |
| `linen-mid` | `#CFC6AE` | Borders on linen |
| `sage` | `#708E74` | Accent rules, badges, icons |
| `sage-deep` | darker sage, chosen to reach 4.5:1 on white and linen | Small sage text (authentic tag, concern pill) |
| `sage-pale` | `#DDE6DE` | Pill and tag fills |
| `white` | `#FFFFFF` | Nav, What we do, cards |
| `stone` | warm grey near `#5F5A50`, 4.5:1 on white and linen | Body copy on light |

Every legacy token name (`espresso`, `ivory`, `olive`, `cocoa`, `mocha`, and
their tints) is removed and all usages are migrated, so no Velyn colour can
leak through.

### Type

- Cinzel (via `next/font/google`) for headlines, section titles, prices and
  the large numerals. Cinzel has no italic and no true lowercase, so the
  prototype's gold italic emphasis becomes gold Cinzel, and headline sizes are
  set slightly smaller than the Garamond equivalents with positive tracking.
- Poppins (300, 400, 500, 600) for body, UI, buttons, kickers and forms.
- Kickers and buttons: Poppins 500 to 600, uppercase, wide tracking, as in the
  prototype.

### Logos

Copied from `nuvenebeauty.com/LOGOS/SVG` into `public/brand/`:
secondary (horizontal) lockup for the header, primary (stacked) lockup for the
footer, NB icon for `icon.svg`, Apple touch icon, the OG and Twitter images,
and a faint leaf watermark in the hero and partner sections. White and black
variants are used on dark and light grounds. The Velyn mark components and the
inlined lockup SVG are deleted.

## 2. Home page

Same sections and order as the prototype:

1. Announcement bar (black): "Concern matched. Transparently sourced." plus
   "Nationwide delivery", and a link to the sourcing promise.
2. Nav (white): horizontal logo; Home, About, Brands, Shop, Wholesale,
   Partner With Us, Education, Contact; active item underlined in gold; ghost
   "Wholesale" and filled "Shop now" buttons; cart. Below `lg`, a full-height
   drawer.
3. Hero (black, two columns): kicker "Beauty you can trust"; H1 "The right
   skincare for your real concern", with "real concern" in gold; body
   from the charter's "Who we are"; CTAs "Shop by concern" and "Partner with
   us"; trust row "Named distributors / Replace or refund guarantee /
   Nationwide delivery". Right column: lifestyle photo in a thin gold frame
   with corner ticks and a gold badge ("Replace or refund").
4. Stats band (gold): 200+ products, 50+ brands, 5 concerns matched, 1
   guarantee (replace or refund on confirmed counterfeits).
5. What we do (white): three numbered pillars, Match, Disclose, Guarantee,
   with charter copy.
6. Featured products (linen): concern chips for the charter's five concerns,
   four product cards, "View all products".
7. Who we serve (black): Individual customers, Retailers & wholesalers,
   International brand partners. Copy from the charter's audiences; no claims
   of verification powers.
8. Brand portfolio: logo or wordmark row for brands Nuvene carries, "View all
   brands", and a short partner prompt.
9. Wholesale: four benefits (charter-safe: original products from named
   distributors, centralised pricing, steady supply, product education) and
   the four-step how-it-works.
10. Brand partners: "Entering Nigeria the right way" with three service areas
    that the charter supports (structured market entry, honest representation
    and education, distribution plus customer feedback).
11. Education hub: three latest posts from ops, falling back to local
    articles.
12. Contact: details plus WhatsApp card, and the existing contact form.
13. Footer (black): stacked logo, line from the charter, Explore / Business /
    Support columns, socials (Instagram, TikTok, Facebook), legal links.

## 3. Copy rules

- Voice: calm, clear, honest, warm (charter). Never urgent or salesy.
- Allowed claims: original products bought through named distributors and
  authorised suppliers; manufacturer checkers run openly where they exist;
  replace or refund any product confirmed counterfeit; concern matching;
  200+ products across 50+ brands; based in Abuja, delivering nationwide.
- Banned claims: direct-from-manufacturer sourcing, import rights, "every
  product verified", customer counts, state counts, "Nigeria's premier".
- House style from `CLAUDE.md`: no em or en dashes as punctuation, none of the
  listed inflated words, no negation flips, sentence case except where the
  design uses uppercase styling.

## 4. Concerns

`SkinConcern` and `SKIN_CONCERNS` move to the charter's five:

| Concern | Slug | Keyword rules (in `normalize.ts`) |
|---|---|---|
| Acne & oily skin | `acne-oily` | acne, blemish, salicylic, BHA, benzoyl, tea tree, oil control, pore, zinc |
| Dryness | `dryness` | ceramide, hyaluronic, moistur, hydrat, lotion, body oil, butter, cream |
| Dark spots & uneven tone | `dark-spots` | dark spot, pigment, brighten, arbutin, vitamin C, tranexamic, TXA, kojic, niacinamide, azelaic, tone, glow |
| Sensitive skin | `sensitive` | sensitive, soothing, cica, heartleaf, centella, calm, barrier, gentle, fragrance free |
| Sun protection | `sun` | SPF, sunscreen, UV, sun |

Old concern slugs in URLs (`acne-prone`, `hyperpigmentation`,
`sensitive-skin`, and the rest) map to the new slugs so existing links keep
working. Demo data is updated to the new concerns.

## 5. Components and craft

- Product cards: white card, linen image tile with fixed aspect ratio and
  padding; packshot blended with `mix-blend-multiply` so white backgrounds
  sit on the tile; sage "Original" tag (not "Verified"); brand in deep gold;
  name in Cinzel; concern pill in sage; price in Cinzel; add-to-cart.
- Section heading: gold rule plus kicker, Cinzel title, optional lead.
- Buttons: solid black, solid gold, outline gold, outline light; sharp
  corners as in the prototype; clear hover and focus-visible states.
- Motion (existing `Reveal` and `Stagger`, Motion and Lenis): headline line
  reveal in the hero, staggered section reveals, small card lift and image
  scale on hover, chip and button transitions. All motion respects
  `prefers-reduced-motion`. The no-JS-safe reveal gating and `?still=1`
  freeze stay.
- No 3D or WebGL scenes.

## 6. Other pages

All of these move to the new tokens, components and charter copy:
`/about` (the charter story, the meaning of the name, values, perception
lines), `/brands` and `/brands/[slug]`, `/shop` and `/shop/[slug]`,
`/wholesale`, `/partner`, `/education` and `/education/[slug]`, `/contact`,
`/faq`, `/authenticity` (retitled "Our sourcing promise": Match, Disclose,
Guarantee, and how replace-or-refund works), `/returns`, `/privacy`, `/terms`,
`/track`, `/cart`, `/checkout`, `/checkout/success`, `not-found`.

Also: metadata, JSON-LD, manifest, sitemap and robots all switch to Nuvene and
`https://nuvenebeauty.com` (via `NEXT_PUBLIC_SITE_URL`); OG and Twitter images
are redrawn; the Paystack payment description and any email subjects say
Nuvene Beauty; `package.json` name becomes `nuvene_web`.

The maintenance page (`src/lib/maintenance-page.ts`) is left as is. It only
serves velynbeauty.com and is replaced by the redirect in a later step.

## 7. Business details (`src/lib/site.ts`)

- Name: Nuvene Beauty. Slogan: Beauty you can trust. Positioning: Concern
  matched. Transparently sourced.
- Address: Shop CG 056, Patience Jonathan Block, Wuye Market, Wuye, Abuja.
- Phones: 0704 702 4403 (Abuja), 0906 421 0147 (Lagos).
- WhatsApp: the Abuja number until the client confirms a WhatsApp Business
  line.
- Email shown: nuvenebeauty@gmail.com until a domain mailbox exists.
- Social: instagram.com/nuvenebeauty, tiktok.com/@nuvenebeauty, Facebook
  "Nuvene Beauty".
- Copyright: "© 2026 Nuvene Beauty" (no "Ltd" until CAC registration is
  confirmed).

## 8. Imagery

- Hero: the brand guide cover photo (woman applying cream), extracted from the
  PDF at the highest available resolution. If the designer supplies
  originals, swap them in.
- About and Wholesale: the guide's shopping bag, shipping box and shelf
  mockups.
- Product imagery continues to come from ops. Local `Images/` packshots are
  used only for demo data and the brand row where useful.
- All images go through `next/image` with explicit sizes; hero is the only
  `priority` image.

## 9. Verification

- `npm run build` and `npm run lint` pass.
- Playwright screenshots of every route at 375, 768 and 1440 px, with and
  without `?still=1`, reviewed for layout breaks, overflow and spacing.
- Contrast: every text and background pair in the token table checked at
  4.5:1 (body) or 3:1 (large text).
- Copy audit: grep `src/` for "Velyn", "velynbeauty", "espresso", "olive",
  "directly from manufacturers", "verified", "10K", "36 States", em and en
  dashes; then a humanize-output pass over all user-facing strings.
- Functional smoke test locally: browse shop, filter by each concern, open a
  product, add to cart, reach checkout, submit contact and wholesale forms
  against the dev ops endpoint.
