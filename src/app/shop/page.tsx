import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getProducts, dataSource } from "@/lib/ops/products";
import type { ProductQuery } from "@/lib/ops/types";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { ProductCard } from "@/components/shop/product-card";
import { FilterRail } from "@/components/shop/filter-rail";
import { ShopSort } from "@/components/shop/shop-sort";
import { Pagination } from "@/components/shop/pagination";
import { DemoNotice } from "@/components/shop/demo-notice";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { CONCERN_OPTIONS } from "@/lib/ops/constants";
import { resolveConcernSlug } from "@/lib/ops/concerns";

export const metadata: Metadata = {
  title: "Shop skincare by concern",
  description:
    "Original skincare from CeraVe, The Ordinary, COSRX and 50+ more brands, matched to your skin concern and delivered across Nigeria.",
  alternates: { canonical: `${site.url}/shop` },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PER_PAGE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const query: ProductQuery = {
    concern: resolveConcernSlug(str(sp.concern)),
    brand: str(sp.brand),
    search: str(sp.q),
    sort: (str(sp.sort) as ProductQuery["sort"]) ?? "featured",
    page: Number(str(sp.page)) || 1,
    perPage: PER_PAGE,
  };

  const [result, brands] = await Promise.all([getProducts(query), getBrands()]);
  const isDemo = dataSource() === "demo";

  const activeConcern = CONCERN_OPTIONS.find((c) => c.slug === query.concern);
  const activeBrand = brands.find((b) => b.slug === query.brand);

  function makeHref(page: number) {
    const params = new URLSearchParams();
    if (query.concern) params.set("concern", query.concern);
    if (query.brand) params.set("brand", query.brand);
    if (query.search) params.set("q", query.search);
    if (query.sort && query.sort !== "featured") params.set("sort", query.sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Shop", url: `${site.url}/shop` },
        ]}
      />
      <PageHero
        kicker="Shop"
        title={
          <>
            Skincare matched <em>to your concern</em>
          </>
        }
        intro="Every product is bought through a named distributor. Filter by concern or brand to find your match."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
        ]}
      />

      {isDemo && (
        <div className="pt-8">
          <DemoNotice />
        </div>
      )}

      <div className="section section-y grid gap-10 lg:grid-cols-[15rem_1fr]">
        <div className="hidden lg:block">
          <FilterRail
            brands={brands}
            active={{ concern: query.concern, brand: query.brand }}
          />
        </div>

        <div>
          {/* Result bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-linen-mid pb-4">
            <p className="text-[0.8rem] text-stone">
              <span className="font-semibold text-ink">{result.total}</span>{" "}
              {result.total === 1 ? "product" : "products"}
              {activeConcern && <> · {activeConcern.label}</>}
              {activeBrand && <> · {activeBrand.name}</>}
            </p>
            <ShopSort />
          </div>

          {/* Mobile concern chips */}
          <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
            <Link
              href="/shop"
              className={`shrink-0 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${
                !query.concern
                  ? "bg-ink text-white"
                  : "border border-linen-mid bg-white text-stone"
              }`}
            >
              All
            </Link>
            {CONCERN_OPTIONS.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?concern=${c.slug}`}
                className={`shrink-0 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${
                  query.concern === c.slug
                    ? "bg-ink text-white"
                    : "border border-linen-mid bg-white text-stone"
                }`}
              >
                {c.short}
              </Link>
            ))}
          </div>

          {result.items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 border border-linen-mid bg-white py-20 text-center">
              <p className="font-serif text-xl text-ink">
                No products match these filters.
              </p>
              <Link
                href="/shop"
                className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:text-ink"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3">
              {result.items.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            makeHref={makeHref}
          />
        </div>
      </div>
    </>
  );
}
