import Link from "next/link";
import { getFeaturedProducts } from "@/lib/ops/products";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

const concernChips = [
  { label: "All", href: "/shop" },
  { label: "Acne", href: "/shop?concern=acne-prone" },
  { label: "Hyperpigmentation", href: "/shop?concern=hyperpigmentation" },
  { label: "Sensitive Skin", href: "/shop?concern=sensitive-skin" },
];

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  if (products.length === 0) return null;

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          kicker="Featured Products"
          title={
            <>
              Shop <em>Authenticated</em> Skincare
            </>
          }
        />
        <div className="flex flex-wrap gap-1.5">
          {concernChips.map((chip, i) => (
            <Link
              key={chip.label}
              href={chip.href}
              className={`px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
                i === 0
                  ? "bg-ink text-white"
                  : "border border-linen-mid bg-white text-stone hover:border-gold hover:text-ink"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 text-center">
        <ButtonLink href="/shop" variant="outlineLight" size="md">
          View All Products
        </ButtonLink>
      </div>
    </section>
  );
}
