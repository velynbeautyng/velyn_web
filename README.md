# Velyn Beauty & Essentials — Website

Premium, animated, SEO-first e-commerce storefront for **Velyn Beauty &
Essentials** — Nigeria's trusted distributor of authentic skincare. Built with
Next.js (App Router) and deployed on Vercel. Products, stock and pricing are
managed from **ops.velynbeauty.com** (UltimatePOS) via its Connector REST API;
payments run through **Paystack**.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript, Turbopack)
- **Tailwind CSS v4** with a committed brand token system
- **Lenis** smooth scroll + a resilient CSS/IntersectionObserver reveal system
  (content is visible without JS — no blank sections for crawlers)
- **Zustand** cart (persisted)
- **next/font** self-hosting EB Garamond + Manrope
- Fully typed **ops** data layer with a demo-catalogue fallback

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — the site runs without any keys
npm run dev                  # http://localhost:3000
```

The site is fully functional with **no environment variables**: it serves a
labelled demo catalogue and a manual (WhatsApp) checkout so you can develop and
preview before the integrations are live. Add credentials to switch to live
data and card payments — see `.env.example`.

### Screenshot / still mode

Append `?still=1` to any URL to freeze reveal animations and disable smooth
scroll — useful for full-page headless screenshots.

## Integrations

### Products — ops.velynbeauty.com (UltimatePOS Connector)

1. In ops: **Connector → register an API app** to get `client_id` /
   `client_secret` (Laravel Passport OAuth2).
2. Set `OPS_CLIENT_ID`, `OPS_CLIENT_SECRET`, `OPS_USERNAME`, `OPS_PASSWORD`
   (and optionally `OPS_LOCATION_ID`).
3. Once the API returns products, the site automatically switches from the demo
   catalogue to live data. `/shop`, `/brands`, product pages, the sitemap and
   featured sections all read from ops.

Concerns (acne, hyperpigmentation, etc.) are inferred from product name/category
in `src/lib/ops/normalize.ts` — adjust the rules there, or map to an ops custom
field, as the catalogue firms up.

### Payments — Paystack

Set `PAYSTACK_SECRET_KEY` (+ `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`). Checkout
re-prices the cart server-side (client amounts are never trusted), creates a
Paystack transaction, and — on successful verification — records the sale back
to ops (`/connector/api/sell`). Without the key, checkout hands off to WhatsApp
so orders are never lost.

### Contact form — Resend (optional)

Set `RESEND_API_KEY` + `CONTACT_INBOX`. Without it, submissions are logged
server-side.

## Deploy to Vercel

1. Push this repo (`velynbeautyng/velyn_web`) to GitHub.
2. Import it in Vercel → framework auto-detected as Next.js.
3. Add the environment variables from `.env.example` in the Vercel project
   settings (use Paystack **live** keys for production).
4. Point `velynbeauty.com` at the Vercel deployment.

> Node ≥ 20.19 is recommended (Next 16 engine requirement).

## Project structure

```
src/
  app/                 App Router routes (home, shop, brands, education, legal, api)
  components/
    home/              Home-page sections (matches the espresso wireframe)
    layout/            Header, footer
    shop/              Product card, filters, buy panel
    cart/ checkout/    Cart + Paystack checkout flow
    forms/             Contact, wholesale, track forms
    motion/            Reveal system + Lenis smooth scroll
    ui/                Buttons, icons, section headings, prose, accordion
    seo/               JSON-LD helpers
  lib/
    ops/               Typed ops data layer + Connector adapter + demo data
    site.ts            Brand + contact config
    cart-store.ts      Zustand cart
```

## Brand system

Palette (committed): espresso `#2C1A0E` · gold `#BD9468` · ivory `#F7F4EF` ·
olive `#676700` · white. Type: EB Garamond (display) + Manrope (body). Tokens
live in `src/app/globals.css`.
