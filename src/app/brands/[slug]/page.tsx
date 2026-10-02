import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getProducts } from "@/lib/ops/products";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { ProductCard } from "@/components/shop/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name}, Authentic in Nigeria`,
    description:
      brand.description ||
      `Shop authentic ${brand.name} skincare from Velyn Beauty & Essentials, verified original, delivered nationwide.`,
    alternates: { canonical: `${site.url}/brands/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const { items } = await getProducts({ brand: slug, perPage: 60 });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Brands", url: `${site.url}/brands` },
          { name: brand.name, url: `${site.url}/brands/${brand.slug}` },
        ]}
      />
      <PageHero
        kicker={brand.origin ? `${brand.origin} · Skincare` : "Brand"}
        title={brand.name}
        intro={brand.description}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Brands", href: "/brands" },
          { name: brand.name, href: `/brands/${brand.slug}` },
        ]}
      />

      <section className="section section-y">
        <div className="mb-8 flex items-center justify-between border-b border-linen-mid pb-4">
          <p className="text-[0.8rem] text-stone">
            <span className="font-semibold text-ink">{items.length}</span>{" "}
            {items.length === 1 ? "product" : "products"}
          </p>
          <Link
            href="/shop"
            className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:text-ink"
          >
            All Products
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="border border-linen-mid bg-white py-20 text-center">
            <p className="font-serif text-xl text-ink">
              Products for this brand are coming soon.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:text-ink"
            >
              Browse the full shop
            </Link>
          </div>
        ) : (
          <Stagger className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
            {items.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} className="h-full" />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </>
  );
}
