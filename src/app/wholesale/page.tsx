import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { WholesaleForm } from "@/components/forms/wholesale-form";
import { IconCheck } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Wholesale & Retail Supply",
  description:
    "Become a Velyn wholesale partner. Guaranteed authentic products, consistent supply, competitive pricing and product education for pharmacies, clinics and beauty stores across Nigeria.",
  alternates: { canonical: `${site.url}/wholesale` },
};

const benefits = [
  {
    title: "Guaranteed Authenticity",
    body: "Every unit verified original before dispatch. Protect your reputation and your customers.",
  },
  {
    title: "Consistent Supply",
    body: "Reliable, centralised logistics so your shelves stay stocked with in-demand products.",
  },
  {
    title: "Competitive Pricing",
    body: "Standardised wholesale pricing that protects your margins and prevents market distortion.",
  },
  {
    title: "Product Education",
    body: "Ingredient, routine and skin-type training so your team sells with confidence.",
  },
];

const steps = [
  { n: 1, title: "Apply", body: "Submit your application with business details and product interests." },
  { n: 2, title: "Verification", body: "We review and verify your business credentials within 48 hours." },
  { n: 3, title: "Onboarding", body: "Receive your wholesale catalogue and dedicated account setup." },
  { n: 4, title: "Order & Support", body: "Order with ongoing account management and product education." },
];

export default function WholesalePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Wholesale", url: `${site.url}/wholesale` },
        ]}
      />
      <PageHero
        kicker="Wholesale & Retailers"
        title={
          <>
            The Right Supply Partner{" "}
            <em>for Your Business</em>
          </>
        }
        intro="Built for pharmacies, dermatology clinics, beauty stores and skincare professionals who need consistent, verified product supply."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Wholesale", href: "/wholesale" },
        ]}
      />

      {/* Benefits */}
      <section className="section section-y">
        <SectionHeading
          kicker="Why Partner With Velyn"
          title={
            <>
              A Supply Partner That{" "}
              <em>Protects Your Reputation</em>
            </>
          }
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <StaggerItem
              key={b.title}
              className="border border-linen-mid bg-white p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center bg-sage-pale text-sage-deep">
                <IconCheck width={18} height={18} strokeWidth={2.4} />
              </span>
              <h3 className="mt-4 font-serif text-base text-ink">
                {b.title}
              </h3>
              <p className="mt-2 text-[0.83rem] leading-relaxed text-stone">
                {b.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Steps + Form */}
      <section id="apply" className="section section-y bg-linen">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              kicker="How It Works"
              title={
                <>
                  Four Steps to <em>Wholesale Access</em>
                </>
              }
            />
            <Reveal as="ol" className="mt-8" delay={0.1}>
              {steps.map((s, i) => (
                <li key={s.n} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center bg-ink text-xs font-bold text-white">
                      {s.n}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-linen-mid" />
                    )}
                  </div>
                  <div className="pb-7 pt-1">
                    <h3 className="font-serif text-base text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-stone">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>

          <Reveal direction="left">
            <div id="terms" className="border border-linen-mid bg-white p-6 sm:p-8">
              <h2 className="mb-1 font-serif text-2xl text-ink">
                Apply for Wholesale Access
              </h2>
              <p className="mb-6 text-[0.85rem] text-stone">
                Tell us about your business and we&apos;ll get you set up.
              </p>
              <WholesaleForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
