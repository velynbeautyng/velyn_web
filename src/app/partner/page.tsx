import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { IconCheck } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Partner With Us, Foreign Brand Partners",
  description:
    "Entering Africa the right way. Velyn offers international skincare brands market-entry strategy, distribution infrastructure, brand protection and real customer intelligence in Nigeria.",
  alternates: { canonical: `${site.url}/partner` },
};

const offerings = [
  {
    title: "Market Entry Strategy",
    body: "Guided rollout plans tailored to the Nigerian consumer landscape and the competitive beauty market.",
  },
  {
    title: "Brand Protection",
    body: "We guard your brand integrity against counterfeiting and ensure authentic representation at every touchpoint.",
  },
  {
    title: "Distribution & Intelligence",
    body: "Active distribution nationwide, with real customer data fed back to help you grow long-term.",
  },
];

const criteria = [
  "Effective, results-driven formulations",
  "Genuine commitment to product quality and safety",
  "Authorised, traceable supply from the manufacturer",
  "Alignment with our values on authenticity and education",
  "Openness to a structured, long-term distribution partnership",
];

export default function PartnerPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Partner With Us", url: `${site.url}/partner` },
        ]}
      />
      <PageHero
        kicker="Foreign Brand Partners"
        title={
          <>
            Entering Africa <em>the Right Way</em>
          </>
        }
        intro="Velyn provides everything a global skincare brand needs to grow in Nigeria, market-entry strategy, distribution infrastructure, brand protection and real customer intelligence."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Partner With Us", href: "/partner" },
        ]}
      />

      {/* Offerings */}
      <section className="section section-y">
        <SectionHeading
          kicker="What We Offer"
          title={
            <>
              A Credible Route Into the{" "}
              <em>African Market</em>
            </>
          }
        />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {offerings.map((o, i) => (
            <StaggerItem
              key={o.title}
              className="border border-linen-mid bg-white p-7"
            >
              <div className="font-serif text-3xl text-gold-pale">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-serif text-lg text-ink">
                {o.title}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-stone">
                {o.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Criteria + Form */}
      <section id="criteria" className="section section-y bg-ink">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              tone="dark"
              kicker="What We Look For"
              title={
                <>
                  The Brands We <em>Partner With</em>
                </>
              }
            />
            <ul className="mt-8 flex flex-col gap-3.5">
              {criteria.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-gold/25 text-gold">
                    <IconCheck width={13} height={13} strokeWidth={2.4} />
                  </span>
                  <span className="text-[0.9rem] leading-relaxed text-linen/60">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="left">
            <div className="border border-gold/10 bg-linen/[0.03] p-6 sm:p-8">
              <h2 className="mb-1 font-serif text-2xl text-linen">
                Start a Partnership Conversation
              </h2>
              <p className="mb-6 text-[0.85rem] text-linen/45">
                Tell us about your brand and we&apos;ll be in touch.
              </p>
              <ContactForm tone="dark" defaultInquiry="Brand Partnership" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
