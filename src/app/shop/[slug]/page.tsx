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
import { NuveneIcon } from "@/components/brand/nuvene-logo";
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
    title: `${product.name}, ${product.brand}`,
    description:
      product.shortDescription ||
      `${product.brand} ${product.name}, an original product from Nuvene Beauty, bought through a named distributor.`,
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
    { icon: IconShield, text: "Replace or refund if ever confirmed counterfeit" },
    { icon: IconTruck, text: "Delivery across Nigeria from Abuja" },
    { icon: IconCheck, text: "Bought through a named distributor" },
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
          <div className="relative aspect-square overflow-hidden border border-linen-mid bg-linen">
            <span className="auth-tag absolute left-3 top-3 z-10">
              <IconCheck width={12} height={12} strokeWidth={2.5} /> Original
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
                <NuveneIcon className="h-16 w-auto opacity-15 text-ink" />
                <span className="text-[0.7rem] uppercase tracking-[0.14em] text-ink/25">
                  {product.brand}
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Details */}
        <Reveal direction="left" className="flex flex-col">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
            {product.brand}
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
            {product.name}
          </h2>

          {product.concerns.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.concerns.map((c) => (
                <span
                  key={c}
                  className="bg-sage-pale px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-sage-deep"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {product.descriptionHtml ? (
            <div
              className="product-desc mt-5 text-[0.95rem]"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="prose-body mt-5 text-[0.95rem]">{product.description}</p>
          ) : null}

          <div className="mt-7 border-t border-linen-mid pt-7">
            <ProductBuyPanel product={product} />
          </div>

          <ul className="mt-7 flex flex-col gap-3 border-t border-linen-mid pt-7">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[0.85rem] text-stone">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-linen-soft text-gold-deep">
                  <Icon width={16} height={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="section section-y bg-linen">
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
              className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:text-ink"
            >
              Back to Shop
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
