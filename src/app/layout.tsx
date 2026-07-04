import type { Metadata, Viewport } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { site } from "@/lib/site";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

const serif = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Authentic Skincare, Sourced Directly`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "authentic skincare Nigeria",
    "original skincare distributor",
    "CeraVe Nigeria",
    "The Ordinary Nigeria",
    "wholesale skincare Nigeria",
    "Korean skincare Nigeria",
    "Velyn Beauty",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Authentic Skincare, Sourced Directly`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Authentic Skincare, Sourced Directly`,
    description: site.description,
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2C1A0E",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh flex flex-col bg-ivory text-espresso antialiased">
        <OrganizationJsonLd />
        <SmoothScroll />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
