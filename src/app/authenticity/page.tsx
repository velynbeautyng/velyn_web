import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { IconCheck } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Authenticity Guarantee",
  description:
    "How Velyn verifies every product: direct sourcing, printing and holographic checks, tamper-evident seals and batch-code verification — authenticity as a practised commitment.",
  alternates: { canonical: `${site.url}/authenticity` },
};

const checks = [
  { title: "Direct Sourcing", body: "Every product comes from the manufacturer or an authorised outlet — never grey-market channels." },
  { title: "Printing & Holograms", body: "We inspect printing quality and holographic codes against manufacturer references." },
  { title: "Tamper-Evident Seals", body: "Seals are checked intact so you know nothing has been opened or altered." },
  { title: "Batch-Code Verification", body: "Unique batch codes are cross-checked to confirm genuine, in-date product." },
];

export default function AuthenticityPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Authenticity", url: `${site.url}/authenticity` },
        ]}
      />
      <PageHero
        kicker="Authenticity Assurance"
        title={
          <>
            Authenticity Is Not a Policy —{" "}
            <em>It&apos;s a Practice</em>
          </>
        }
        intro="Trust is the foundation of everything we do, particularly when it comes to what goes on your skin. Every product is verified before it ever reaches you."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Authenticity", href: "/authenticity" },
        ]}
      />

      <section className="section section-y grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            kicker="Our Commitment"
            title={
              <>
                Verified Before It Reaches{" "}
                <em>Your Hands</em>
              </>
            }
          />
          <p className="prose-body mt-5">
            Every product on our platform is sourced directly from manufacturers
            or authorised outlets. Before anything reaches our customers, we
            conduct thorough checks across printing quality, holographic codes,
            tamper-evident seals and unique batch codes to confirm that each
            product is genuine, safe, and exactly what it claims to be.
          </p>
          <p className="prose-body mt-4">
            Our authenticity process is not reactive — it is built into our
            standard operating procedure. Each product batch goes through a
            structured quality-assurance review before it is made available,
            ensuring integrity is maintained at every stage of the supply chain.
          </p>
          <p className="prose-body mt-4">
            We hold this standard because skincare is personal. Our customers
            trust us with their skin, and that responsibility shapes every
            sourcing decision we make.
          </p>
        </Reveal>

        <Stagger className="grid gap-3 self-start sm:grid-cols-2">
          {checks.map((c) => (
            <StaggerItem
              key={c.title}
              className="border border-ivory-mid bg-white p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center bg-olive-pale text-olive">
                <IconCheck width={18} height={18} strokeWidth={2.4} />
              </span>
              <h3 className="mt-4 font-serif text-base text-espresso">
                {c.title}
              </h3>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-cocoa">
                {c.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand
        tone="olive"
        title={
          <>
            Shop With Complete <em className="text-white/70">Confidence</em>
          </>
        }
        body="Every product, verified. Browse the range or learn how to spot counterfeits yourself."
        primary={{ label: "Shop Authentic Skincare", href: "/shop" }}
        secondary={{
          label: "How to Spot a Counterfeit",
          href: "/education/spot-a-counterfeit-skincare-product",
        }}
      />
    </>
  );
}
