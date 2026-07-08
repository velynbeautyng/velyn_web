import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/ops/products";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { ProductBuyPanel } from "@/components/shop/product-buy-panel";
import { ProductCard } from "@/components/shop/product-card";
import { VelynMark } from "@/components/brand/velyn-mark";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { IconCheck, IconShield, IconTruck } from "@/components/ui/icons";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — ${product.brand}`,
    description:
      product.shortDescription ||
      `Authentic ${product.brand} ${product.name}, verified original and available from Velyn Beauty & Essentials.`,
    alternates: { canonical: `${site.url}/shop/${product.slug}` },
    openGraph: product.image
      ? { images: [{ url: product.image, alt: product.name }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  const trust = [
    { icon: IconShield, text: "100% authentic, verified before dispatch" },
    { icon: IconTruck, text: "Nationwide delivery across all 36 states" },
    { icon: IconCheck, text: "Sourced directly from authorised suppliers" },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Shop", url: `${site.url}/shop` },
          { name: product.name, url: `${site.url}/shop/${product.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          brand: { "@type": "Brand", name: product.brand },
          description: product.description ?? product.shortDescription,
          image: product.image ? [product.image] : undefined,
          sku: product.variations[0]?.sku,
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${site.url}/shop/${product.slug}`,
          },
        }}
      />

      <PageHero
        kicker={product.brand}
        title={product.name}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: product.brand, href: `/shop?brand=${product.brandSlug}` },
        ]}
      />

      <section className="section section-y grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <Reveal>
          <div className="relative aspect-square overflow-hidden border border-ivory-mid bg-ivory">
            <span className="auth-tag absolute left-3 top-3 z-10">
              <IconCheck width={12} height={12} strokeWidth={2.5} /> Authentic
            </span>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <VelynMark className="h-16 w-auto opacity-15" tone="espresso" />
                <span className="text-[0.7rem] uppercase tracking-[0.14em] text-espresso/25">
                  {product.brand}
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Details */}
        <Reveal direction="left" className="flex flex-col">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-dim">
            {product.brand}
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-espresso">
            {product.name}
          </h2>

          {product.concerns.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.concerns.map((c) => (
                <span
                  key={c}
                  className="bg-olive-pale px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-olive"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <p className="prose-body mt-5 text-[0.95rem]">{product.description}</p>
          )}

          <div className="mt-7 border-t border-ivory-mid pt-7">
            <ProductBuyPanel product={product} />
          </div>

          <ul className="mt-7 flex flex-col gap-3 border-t border-ivory-mid pt-7">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[0.85rem] text-cocoa">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-gold-faint text-gold-dim">
                  <Icon width={16} height={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="section section-y bg-ivory">
          <SectionHeading
            kicker="You May Also Like"
            title={
              <>
                Related <em>Skincare</em>
              </>
            }
          />
          <Stagger className="mt-10 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} className="h-full" />
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-dim hover:text-espresso"
            >
              Back to Shop
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
