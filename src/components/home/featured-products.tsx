import Link from "next/link";
import { getFeaturedProducts } from "@/lib/ops/products";
import { CONCERNS } from "@/lib/ops/concerns";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

const chips = [
  { label: "All", href: "/shop" },
  ...CONCERNS.map((c) => ({ label: c.short, href: `/shop?concern=${c.slug}` })),
];

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  if (products.length === 0) return null;

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          kicker="Featured products"
          title={
            <>
              Shop <em>original</em> skincare
            </>
          }
        />
        <nav
          aria-label="Shop by concern"
          className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {chips.map((chip, i) => (
            <Link
              key={chip.href}
              href={chip.href}
              className={
                i === 0
                  ? "inline-flex min-h-11 shrink-0 items-center border border-ink bg-ink px-4 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white"
                  : "inline-flex min-h-11 shrink-0 items-center border border-linen-mid bg-white px-4 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-stone transition-colors hover:border-ink hover:text-ink"
              }
            >
              {chip.label}
            </Link>
          ))}
        </nav>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 text-center">
        <ButtonLink href="/shop" variant="outlineGold" size="md">
          View all products
        </ButtonLink>
      </div>
    </section>
  );
}
