import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, dataSource } from "@/lib/ops/products";
import { brandLogoSrc } from "@/lib/brand-logos";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { IconArrowRight } from "@/components/ui/icons";
import { DemoNotice } from "@/components/shop/demo-notice";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Our Brands",
  description:
    "The trusted global skincare brands Velyn distributes in Nigeria — from CeraVe and La Roche-Posay to COSRX, Anua and Beauty of Joseon. Every product verified authentic.",
  alternates: { canonical: `${site.url}/brands` },
};

export default async function BrandsPage() {
  const brands = await getBrands();
  const isDemo = dataSource() === "demo";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Brands", url: `${site.url}/brands` },
        ]}
      />
      <PageHero
        kicker="Our Brand Portfolio"
        title={
          <>
            Trusted Global Brands,{" "}
            <em>One Authentic Source</em>
          </>
        }
        intro="We partner with established names and emerging international brands alike — every one sourced directly and verified original before it reaches the Nigerian market."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Brands", href: "/brands" },
        ]}
      />

      {isDemo && (
        <div className="pt-8">
          <DemoNotice />
        </div>
      )}

      <section className="section section-y">
        <Stagger className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((b) => {
            const logo = brandLogoSrc(b.slug);
            return (
            <StaggerItem key={b.slug}>
              <Link
                href={`/brands/${b.slug}`}
                className="group flex h-full flex-col justify-between border border-ivory-mid bg-white p-6 transition-shadow duration-300 hover:shadow-[0_20px_40px_-28px_rgba(44,26,14,0.4)]"
              >
                <div>
                  {logo && (
                    <div className="mb-4 flex h-10 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo}
                        alt={b.name}
                        loading="lazy"
                        className="max-h-10 w-auto max-w-[65%] object-contain"
                      />
                    </div>
                  )}
                  <h2 className="font-serif text-lg text-espresso group-hover:text-gold-dim">
                    {b.name}
                  </h2>
                  {b.origin && (
                    <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-gold-dim">
                      {b.origin}
                    </p>
                  )}
                  {b.description && (
                    <p className="mt-3 text-[0.82rem] leading-relaxed text-cocoa">
                      {b.description}
                    </p>
                  )}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-gold-dim">
                  {typeof b.productCount === "number"
                    ? `${b.productCount} product${b.productCount === 1 ? "" : "s"}`
                    : "View range"}
                  <IconArrowRight width={13} height={13} />
                </span>
              </Link>
            </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <CtaBand
        kicker="Foreign Brand Partners"
        title={
          <>
            Bring Your Brand to <span className="italic text-white/70">Nigeria</span>
          </>
        }
        body="Velyn offers international skincare brands a credible, structured route into the African market — with distribution, brand protection and real customer intelligence."
        primary={{ label: "Partner With Velyn", href: "/partner" }}
        secondary={{ label: "Talk to Us", href: "/contact" }}
        tone="olive"
      />
    </>
  );
}
