import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { VelynMark } from "@/components/brand/velyn-mark";
import { IconLeaf, IconShield } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Velyn Beauty & Essentials is a Nigerian skincare distribution company built on authenticity, effectiveness and trust, bridging global manufacturers and the African market.",
  alternates: { canonical: `${site.url}/about` },
};

const values = [
  {
    n: "01",
    title: "Authenticity First",
    body: "Every product we sell is original, verified, and sourced directly from manufacturers or authorised partners.",
  },
  {
    n: "02",
    title: "Results-Driven Skincare",
    body: "We focus on products that work, solutions for acne, blemishes, hyperpigmentation and uneven tone, not passing trends.",
  },
  {
    n: "03",
    title: "Education & Trust",
    body: "We don't just sell skincare, we educate. Knowledge builds confidence, and confidence builds trust.",
  },
  {
    n: "04",
    title: "Exceptional Customer Care",
    body: "Clear, honest communication and consistent support before, during and after every purchase.",
  },
  {
    n: "05",
    title: "Seamless Distribution",
    body: "A smooth, reliable flow from manufacturer to distributor to retailer to consumer, integrity protected at every stage.",
  },
  {
    n: "06",
    title: "Sustainability",
    body: "We align with the UN SDGs, responsible sourcing, reduced packaging waste, and partners who share our environmental values.",
  },
];

const sdgs = [
  { code: "SDG 3", label: "Good Health & Well-Being" },
  { code: "SDG 12", label: "Responsible Consumption & Production" },
  { code: "SDG 13", label: "Climate Action" },
  { code: "SDG 14 / 15", label: "Life Below Water & On Land" },
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
        kicker="Who We Are"
        title={
          <>
            Building a Trusted Beauty{" "}
            <em>Distribution Ecosystem</em>
          </>
        }
        intro="Velyn Beauty & Essentials is a Nigerian skincare distribution company built on authenticity, effectiveness and trust, connecting global brands to African consumers with integrity."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      {/* Story */}
      <section className="section section-y grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading
            kicker="Our Story"
            title={
              <>
                Bridging Manufacturers and the{" "}
                <em>Nigerian Market</em>
              </>
            }
          />
          <p className="prose-body mt-5">
            We operate across two core categories: established, high-demand
            skincare brands with proven performance, and emerging international
            brands seeking credible entry into the African market. Our role is to
            ensure original products reach retailers and consumers exactly as the
            manufacturer intended.
          </p>
          <p className="prose-body mt-4">
            We are not just selling skincare, we are building a trusted
            distribution ecosystem defined by authenticity, sustainability,
            education, and scalable partnerships.
          </p>
        </Reveal>

        <Reveal direction="left" className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col justify-between border border-ivory-mid bg-white p-6">
            <VelynMark className="h-8 w-auto" tone="gold" />
            <div className="mt-8">
              <h3 className="font-serif text-lg text-espresso">Our Vision</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-cocoa">
                To become one of Nigeria&apos;s most trusted beauty distribution
                platforms, recognised for sustainability, quality, and as a
                channel for global beauty brands entering the Nigerian market.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between bg-espresso p-6 text-ivory">
            <IconShield width={26} height={26} className="text-gold" />
            <div className="mt-8">
              <h3 className="font-serif text-lg">Our Mission</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-ivory/55">
                To deliver quality, results-driven beauty products and seamless
                access by partnering directly with trusted global manufacturers,
                serving Nigerian consumers with integrity, education and
                excellence.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="section section-y bg-ivory">
        <SectionHeading
          kicker="Our Brand Values"
          title={
            <>
              What We Stand <em>For</em>
            </>
          }
          intro="Six commitments that shape every sourcing decision and every customer interaction."
        />
        <Stagger className="mt-12 grid gap-px border border-ivory-mid bg-ivory-mid sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <StaggerItem key={v.n} className="group bg-white p-7">
              <div className="font-serif text-3xl text-gold-pale transition-colors group-hover:text-gold">
                {v.n}
              </div>
              <h3 className="mt-3 font-serif text-lg text-espresso">{v.title}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-cocoa">
                {v.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ESG */}
      <section className="section section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="flex h-12 w-12 items-center justify-center bg-olive-pale text-olive">
              <IconLeaf width={24} height={24} />
            </span>
            <SectionHeading
              className="mt-5"
              kicker="ESG & Sustainability"
              title={
                <>
                  A Sustainable Distribution{" "}
                  <em>Bridge</em>
                </>
              }
            />
            <p className="prose-body mt-5">
              Sustainability is integrated into our long-term strategy. We align
              our operations with the United Nations Sustainable Development
              Goals, ensuring access to safe, authentic products, discouraging
              counterfeit circulation, and supporting partners who prioritise
              ethical sourcing and responsible manufacturing.
            </p>
          </Reveal>
          <Reveal direction="left" className="grid gap-3 self-center sm:grid-cols-2">
            {sdgs.map((s) => (
              <div
                key={s.code}
                className="border border-olive-mid/30 bg-olive-pale/40 p-5"
              >
                <div className="font-serif text-lg text-olive">{s.code}</div>
                <div className="mt-1 text-[0.8rem] leading-snug text-cocoa">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Skincare You Can <em className="text-white/70">Trust</em>
          </>
        }
        body="Explore our authenticated range, or partner with us to grow your brand in Nigeria."
        primary={{ label: "Shop the Range", href: "/shop" }}
        secondary={{ label: "Partner With Us", href: "/partner" }}
      />
    </>
  );
}
