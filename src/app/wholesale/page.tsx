import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { WholesaleForm } from "@/components/forms/wholesale-form";
import { wholesaleSteps } from "@/components/home/wholesale-preview";
import { IconCheck } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Wholesale skincare for pharmacies, clinics, spas and beauty stores in Nigeria. Original stock from named distributors, one price list, steady supply and product training.",
  alternates: { canonical: `${site.url}/wholesale` },
};

const benefits = [
  { title: "Original stock", body: "Bought through named distributors, with the paperwork to show for it." },
  { title: "Steady supply", body: "Centralised logistics from Abuja so in-demand lines stay on your shelves." },
  { title: "One price list", body: "Standard wholesale pricing for every partner, which protects your margins and the market." },
  { title: "Product training", body: "Ingredient, routine and skin-type training so your team can match customers to the right product." },
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
        kicker="Wholesale"
        title={
          <>
            A supply partner <em>you can check</em>
          </>
        }
        intro="For pharmacies, dermatology clinics, spas, beauty stores and skincare professionals who need original stock on a steady schedule."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Wholesale", href: "/wholesale" },
        ]}
      />

      <section className="section section-y bg-white">
        <SectionHeading
          title={
            <>
              Why stock <em>with Nuvene</em>
            </>
          }
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <StaggerItem key={b.title} className="border border-linen-mid bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center bg-sage-pale text-sage-deep">
                <IconCheck width={18} height={18} strokeWidth={2.4} />
              </span>
              <h3 className="mt-4 font-serif text-base text-ink">{b.title}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-stone">{b.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="apply" className="section section-y bg-linen">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              kicker="How it works"
              title={
                <>
                  Four steps to <em>wholesale access</em>
                </>
              }
            />
            <Reveal as="ol" className="mt-8" delay={0.1}>
              {wholesaleSteps.map((s, i) => (
                <li key={s.n} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center bg-ink font-serif text-sm text-white">
                      {s.n}
                    </span>
                    {i < wholesaleSteps.length - 1 && <span className="my-1 w-px flex-1 bg-linen-mid" />}
                  </div>
                  <div className="pb-7 pt-1">
                    <h3 className="font-serif text-base text-ink">{s.title}</h3>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-stone">{s.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>

          <Reveal direction="left">
            <div id="terms" className="scroll-mt-28 border border-linen-mid bg-white p-6 sm:p-8">
              <h2 className="mb-1 font-serif text-2xl text-ink">Apply for wholesale</h2>
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
