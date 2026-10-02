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
    email: "hello@nuvenebeauty.com",
    phones: [
      { label: "Abuja", tel: "+2347047024403", display: "0704 702 4403" },
      { label: "Lagos", tel: "+2349064210147", display: "0906 421 0147" },
    ],
    whatsapp: "2347047024403",
    whatsappDisplay: "0704 702 4403",
    address: {
      line1: "Shop CG 056, Patience Jonathan Block",
      line2: "Wuye Market, Wuye",
      city: "Abuja",
      country: "Nigeria",
    },
    hours: "Open 24/7",
  },

  social: {
    instagram: "https://instagram.com/nuvenebeauty",
    tiktok: "https://tiktok.com/@nuvenebeauty",
    facebook: "https://www.facebook.com/profile.php?id=61594144782677",
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
