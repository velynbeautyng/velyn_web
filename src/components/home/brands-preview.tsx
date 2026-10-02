import Link from "next/link";
import { getBrands } from "@/lib/ops/products";
import { brandLogoSrc } from "@/lib/brand-logos";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

export async function BrandsPreview() {
  const all = await getBrands();
  // Surface brands that have a logo first, so the row reads as a genuine
  // global-brand line-up rather than an alphabetical slice of niche names.
  const brands = [
    ...all.filter((b) => brandLogoSrc(b.slug)),
    ...all.filter((b) => !brandLogoSrc(b.slug)),
  ].slice(0, 6);

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          kicker="Our brand portfolio"
          title={
            <>
              Trusted global <em>brands</em>
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
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-stone transition-colors group-hover:text-ink">
                    {b.name}
                  </span>
                )}
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-4 flex flex-col items-start justify-between gap-5 border border-gold-pale bg-linen-soft px-6 py-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-serif text-lg text-ink">Looking to enter the Nigerian market?</h3>
          <p className="mt-1 text-[0.85rem] text-stone">
            Nuvene gives international skincare brands a structured route to
            Nigerian customers, retailers and skincare professionals.
          </p>
        </div>
        <ButtonLink href="/partner" variant="gold" size="md" className="shrink-0">
          Partner with Nuvene
        </ButtonLink>
      </Reveal>
    </section>
  );
}
