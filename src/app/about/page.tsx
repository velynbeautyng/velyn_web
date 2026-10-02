import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import shelves from "@/assets/photos/store-shelves.jpg";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { NuveneIcon } from "@/components/brand/nuvene-logo";
import { IconShield } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Nuvene Beauty is an Abuja skincare company built on honesty, results and trust. Learn where the name comes from and what we promise.",
  alternates: { canonical: `${site.url}/about` },
};

const values = [
  {
    title: "Honesty first",
    body: "Every product we sell is original and bought through named distributors and authorised suppliers. We're open about what can and can't be checked.",
  },
  {
    title: "Concern led",
    body: "Every recommendation starts with your concern: acne, dryness, dark spots, sensitivity or sun protection. Results matter more than trends.",
  },
  {
    title: "Education",
    body: "We explain what each product does, why it works and who it suits, so you can choose with confidence.",
  },
  {
    title: "A promise we can keep",
    body: "If a product is ever confirmed counterfeit, we replace it or refund you. You never carry that risk alone.",
  },
  {
    title: "Customer care",
    body: "Clear answers, quick fixes and steady support before, during and after every purchase.",
  },
  {
    title: "Careful distribution",
    body: "From distributor to Nuvene to retailer to you, we protect each product and keep the paperwork that shows where it came from.",
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "About", url: `${site.url}/about` },
        ]}
      />
      <PageHero
        kicker="About Nuvene"
        title={
          <>
            Where the new <em>begins</em>
          </>
        }
        intro="Nuvene Beauty is an Abuja skincare company built on honesty, results and trust. We match each customer's real skin concern to an original product and back every purchase with a guarantee we can keep."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <section className="section section-y grid gap-12 bg-white lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            title={
              <>
                Global skincare, <em>honestly sourced</em>
              </>
            }
          />
          <p className="prose-body mt-5">
            We carry two kinds of brands. Established names with a proven
            record, like CeraVe, The Ordinary, COSRX and Dove. And effective
            international brands that are new to Nigeria and want a careful,
            credible way in.
          </p>
          <p className="prose-body mt-4">
            We buy through established distribution channels and authorised
            suppliers, and we say so openly. We don&apos;t claim import rights we
            don&apos;t hold, or checks we can&apos;t run. What we promise, we keep.
          </p>
        </Reveal>

        <Reveal direction="left" className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col justify-between border border-linen-mid bg-linen-soft p-6">
            <NuveneIcon className="h-8 w-auto text-sage" />
            <div className="mt-8">
              <h3 className="font-serif text-lg text-ink">Our vision</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-stone">
                To become one of Nigeria&apos;s most trusted skincare platforms,
                known for honest sourcing, real results, and as a credible route
                into Nigeria for global beauty brands.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between bg-sage-night p-6">
            <IconShield width={26} height={26} className="text-linen" />
            <div className="mt-8">
              <h3 className="font-serif text-lg text-white">Our mission</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-white/85">
                To match every customer with skincare that suits their real
                concern, disclose where every product comes from, and stand
                behind every purchase.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section section-y grid items-center gap-12 bg-linen lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <div className="relative aspect-[16/10] overflow-hidden border border-linen-mid">
            <Image
              src={shelves}
              alt="Shelves of skincare in a bright Nuvene Beauty store"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal direction="left">
          <SectionHeading
            kicker="The name"
            title={
              <>
                Nuvene: where the <em>new begins</em>
              </>
            }
          />
          <p className="prose-body mt-5">
            It&apos;s for the customer starting a new routine, and for us,
            relaunching with a clear identity. We want Nuvene to feel calm,
            natural and considered, never loud.
          </p>
        </Reveal>
      </section>

      <section className="section section-y bg-white">
        <SectionHeading
          title={
            <>
              What we <em>stand for</em>
            </>
          }
          intro="Six commitments behind every sourcing decision and every conversation with a customer."
        />
        <Stagger className="mt-12 grid gap-px border border-linen-mid bg-linen-mid sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <StaggerItem key={v.title} className="group bg-white p-7">
              <div className="font-serif text-3xl text-gold-pale transition-colors group-hover:text-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-serif text-lg text-ink">{v.title}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-stone">{v.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand
        tone="sage"
        title={
          <>
            Find what works <em>for your skin</em>
          </>
        }
        primary={{ label: "Shop by concern", href: "/shop" }}
        secondary={{ label: "Our sourcing promise", href: "/authenticity" }}
      />
    </>
  );
}
