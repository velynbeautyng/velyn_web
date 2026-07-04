import Link from "next/link";
import { getBrands } from "@/lib/ops/products";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

export async function BrandsPreview() {
  const brands = (await getBrands()).slice(0, 12);

  return (
    <section className="section section-y bg-white">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          kicker="Our Brand Portfolio"
          title={
            <>
              Trusted Global <em>Brands</em>
            </>
          }
        />
        <ButtonLink
          href="/brands"
          variant="outlineLight"
          size="sm"
          className="w-fit"
        >
          View All Brands
        </ButtonLink>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <StaggerItem key={b.slug}>
            <Link
              href={`/brands/${b.slug}`}
              className="group flex h-20 items-center justify-center border border-ivory-mid bg-white px-2 text-center transition-colors duration-300 hover:border-gold hover:bg-gold-faint"
            >
              <span className="font-serif text-sm tracking-wide text-espresso/70 transition-colors group-hover:text-espresso">
                {b.name}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-4 flex flex-col items-start justify-between gap-4 border border-gold-pale bg-gold-faint px-6 py-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-serif text-lg text-espresso">
            Looking to enter the African market?
          </h3>
          <p className="mt-1 text-[0.85rem] text-cocoa">
            Velyn provides proven market entry, distribution infrastructure, and
            brand protection for international skincare brands.
          </p>
        </div>
        <ButtonLink
          href="/partner"
          variant="gold"
          size="md"
          className="shrink-0"
        >
          Partner With Velyn
        </ButtonLink>
      </div>
    </section>
  );
}
