/**
 * Central brand + site configuration for Velyn Beauty & Essentials.
 * Sourced from the Brand Charter & Positioning Document.
 */

export const site = {
  name: "Velyn Beauty & Essentials",
  shortName: "Velyn",
  legalName: "Velyn Beauty & Essentials Ltd",
  tagline: "Beauty & Essentials",
  slogan: "Beauty you can trust",
  description:
    "Velyn Beauty & Essentials is Nigeria's trusted distributor of authentic skincare — sourced directly from manufacturers and curated for real results. Retail, wholesale and brand partnerships across all 36 states.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://velynbeauty.com",
  locale: "en_NG",

  contact: {
    email: "hello@velynbeauty.com",
    phoneAirtel: "+2349028828977",
    phoneMtn: "+2348141741207",
    whatsapp: "2348141741207",
    whatsappDisplay: "+234 814 174 1207",
    address: {
      line1: "Suite A20, ES-EM Plaza",
      line2: "Shettima Monguno Crescent, Utako",
      city: "Abuja",
      country: "Nigeria",
    },
    hours: "Mon–Fri, 9am–5pm WAT",
  },

  social: {
    instagram: "https://instagram.com/velynbeauty_essentials",
    tiktok: "https://tiktok.com/@velynbeauty_essentials",
    facebook: "https://facebook.com/velynbeautyessentials",
  },

  stats: [
    { value: "50+", label: "Global Brands" },
    { value: "100%", label: "Authentic Products" },
    { value: "10K+", label: "Happy Customers" },
    { value: "36", label: "States Covered" },
    { value: "3", label: "Distribution Channels" },
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
    { label: "About Us", href: "/about" },
    { label: "Our Brands", href: "/brands" },
    { label: "Shop", href: "/shop" },
    { label: "Education Hub", href: "/education" },
  ],
  business: [
    { label: "Wholesale & Retail", href: "/wholesale" },
    { label: "Partner With Us", href: "/partner" },
    { label: "Authenticity Policy", href: "/authenticity" },
    { label: "Wholesale Terms", href: "/wholesale#terms" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Order Tracking", href: "/track" },
    { label: "Returns Policy", href: "/returns" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
} as const;

/** WhatsApp deep link with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
