import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import bag from "@/assets/photos/shopping-bag.jpg";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Our sourcing promise",
  description:
    "How Nuvene Beauty sources skincare: we match products to your concern, name the distributor each one came from, and replace or refund anything confirmed counterfeit.",
  alternates: { canonical: `${site.url}/authenticity` },
};

const promise = [
  {
    title: "Match",
    body: "We start with your concern and recommend the active and product that suit it. We never push a product that doesn't fit what you told us.",
  },
  {
    title: "Disclose",
    body: "We buy through established distributors and authorised suppliers, and we tell you which one a product came from. Where the brand offers a batch or code checker, we run it in front of you.",
  },
  {
    title: "Guarantee",
    body: "If a product you bought from us is ever confirmed counterfeit, we replace it or refund you. Nuvene carries that risk, not you.",
  },
];

const steps = [
  {
    title: "Tell us",
    body: `Message us on WhatsApp (${site.contact.whatsappDisplay}) or by email with your order number and clear photos of the product and packaging.`,
  },
  {
    title: "We look into it",
    body: "We check our records for the distributor and batch, and use the brand's own checker where one exists.",
  },
  {
    title: "We put it right",
    body: "If the product is confirmed counterfeit, we replace it or refund you.",
  },
];

export default function SourcingPromisePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Sourcing promise", url: `${site.url}/authenticity` },
        ]}
      />
      <PageHero
        kicker="Sourcing promise"
        title={
          <>
            Match. Disclose. <em>Guarantee.</em>
          </>
        }
        intro="Three habits we keep with every customer, in store, on WhatsApp and online."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Sourcing promise", href: "/authenticity" },
        ]}
      />

      <section className="section section-y bg-white">
        <Stagger className="grid gap-px border border-linen-mid bg-linen-mid md:grid-cols-3">
          {promise.map((p, i) => (
            <StaggerItem key={p.title} className="bg-white p-8">
              <div className="font-serif text-[2.4rem] leading-none text-gold-pale">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-4 font-serif text-xl text-ink">{p.title}</h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-stone">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section section-y grid items-center gap-12 bg-linen lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            title={
              <>
                What we can and <em>can&apos;t check</em>
              </>
            }
          />
          <Reveal className="prose-body mt-6 flex flex-col gap-4 text-[0.95rem]">
            <p>
              We are a reseller. We don&apos;t hold import rights for the brands we
              carry, so we don&apos;t claim to check every product ourselves.
            </p>
            <p>
              What we can do is buy only through distributors and suppliers we can
              name, keep the invoices that prove it, and run every manufacturer
              checker that exists. Some brands offer one, many don&apos;t, and we
              tell you which is which.
            </p>
            <p>
              Our guarantee covers the gap: if a product is ever confirmed
              counterfeit, you get a replacement or a refund.
            </p>
          </Reveal>
        </div>
        <Reveal direction="left">
          <div className="relative aspect-[16/10] overflow-hidden border border-linen-mid">
            <Image
              src={bag}
              alt="A Nuvene Beauty paper shopping bag on a store counter"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="section section-y bg-white">
        <SectionHeading
          kicker="Replace or refund"
          title={
            <>
              If something <em>isn&apos;t right</em>
            </>
          }
        />
        <Reveal as="ol" className="mt-10 grid gap-6 md:grid-cols-3" delay={0.1}>
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-gold pt-5">
              <span className="font-serif text-sm text-gold-deep">{i + 1}</span>
              <h3 className="mt-1 font-serif text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-stone">{s.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <CtaBand
        tone="ink"
        title={
          <>
            Shop with <em>confidence</em>
          </>
        }
        body="Browse by concern, or learn the warning signs of a fake product."
        primary={{ label: "Shop by concern", href: "/shop" }}
        secondary={{ label: "Browse all articles", href: "/education" }}
      />
    </>
  );
}
