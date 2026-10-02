import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { partnerPoints } from "@/components/home/partner-cta";
import { IconCheck } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Partner with us",
  description:
    "International skincare brands new to Nigeria: Nuvene offers a structured rollout, honest representation, distribution to retailers and professionals, and customer feedback.",
  alternates: { canonical: `${site.url}/partner` },
};

const criteria = [
  "Effective formulations with evidence behind them",
  "A real commitment to product quality and safety",
  "Traceable supply through the manufacturer or an authorised distributor",
  "Shared values on honesty and customer education",
  "Interest in a structured, long-term partnership",
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
        kicker="Brand partners"
        title={
          <>
            Entering Nigeria <em>the right way</em>
          </>
        }
        intro="We work with effective international brands that are not yet household names here, and give them a careful, credible way in."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Partner With Us", href: "/partner" },
        ]}
      />

      <section className="section section-y bg-white">
        <SectionHeading
          title={
            <>
              A credible route <em>into Nigeria</em>
            </>
          }
        />
        <Stagger className="mt-10 grid gap-px border border-linen-mid bg-linen-mid md:grid-cols-3">
          {partnerPoints.map((o) => (
            <StaggerItem key={o.title} className="bg-white p-7">
              <div className="h-0.5 w-7 bg-gold" />
              <h3 className="mt-5 font-serif text-lg text-ink">{o.title}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-stone">{o.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="criteria" className="section section-y scroll-mt-28 bg-ink">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              tone="dark"
              kicker="What we look for"
              title={
                <>
                  The brands we <em>work with</em>
                </>
              }
            />
            <ul className="mt-8 flex flex-col gap-3.5">
              {criteria.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-gold/30 text-gold">
                    <IconCheck width={13} height={13} strokeWidth={2.4} />
                  </span>
                  <span className="text-[0.9rem] leading-relaxed text-white/85">{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="left">
            <div className="border border-gold/20 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="mb-1 font-serif text-2xl text-white">Start a conversation</h2>
              <p className="mb-6 text-[0.85rem] text-linen/75">
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
