import Link from "next/link";
import { getBrands } from "@/lib/ops/products";
import { brandLogoSrc } from "@/lib/brand-logos";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

export async function BrandsPreview() {
  const all = await getBrands();
  // Surface brands that have a logo first, so the wall reads as a genuine
  // global-brand line-up rather than an alphabetical slice of niche names.
  const brands = [
    ...all.filter((b) => brandLogoSrc(b.slug)),
    ...all.filter((b) => !brandLogoSrc(b.slug)),
  ].slice(0, 12);

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          title={
            <>
              Brands we <em>carry</em>
            </>
          }
        />
        <ButtonLink href="/brands" variant="outlineGold" size="sm" className="w-fit">
          View all brands
        </ButtonLink>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => {
          const logo = brandLogoSrc(b.slug);
          return (
            <StaggerItem key={b.slug}>
              <Link
                href={`/brands/${b.slug}`}
                className="group flex h-20 items-center justify-center border border-linen-mid bg-white px-3 text-center transition-colors duration-300 hover:border-gold"
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt={b.name}
                    loading="lazy"
                    className="max-h-9 w-auto max-w-[85%] object-contain opacity-85 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="font-serif text-sm tracking-wide text-ink/80 transition-colors group-hover:text-ink">
                    {b.name}
                  </span>
                )}
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 border border-gold-pale bg-linen-soft px-6 py-5 sm:flex-row sm:items-center">
        <p className="font-serif text-base text-ink">Bringing your brand to Nigeria?</p>
        <a
          href="#partners"
          className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
        >
          How partnerships work
          <IconArrowRight width={14} height={14} />
        </a>
      </div>
    </section>
  );
}
