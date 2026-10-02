import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";

const benefits = [
  "Original products, named distributors",
  "Consistent supply chain",
  "Competitive wholesale pricing",
  "Product education support",
];

export const wholesaleSteps = [
  { n: 1, title: "Apply", body: "Submit your wholesale application with your business details and the products you want." },
  { n: 2, title: "Review", body: "Our team reviews your business details and confirms the next steps with you." },
  { n: 3, title: "Onboarding", body: "Receive your wholesale price list and guidance on setting up your account." },
  { n: 4, title: "Order and support", body: "Start ordering, with a named contact and ongoing product education." },
];

export function WholesalePreview() {
  return (
    <section className="section section-y grid gap-12 bg-white lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading
          kicker="Wholesale and retailers"
          title={
            <>
              The right supply
              <br className="hidden sm:block" /> <em>partner for your business</em>
            </>
          }
          intro="Built for pharmacies, dermatology clinics, beauty stores and skincare professionals who need a steady supply of original products."
        />
        <Reveal className="mt-7 grid gap-2.5 sm:grid-cols-2" delay={0.1}>
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2.5 text-[0.85rem] text-ink/85">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-sage-mid bg-sage-pale text-sage-deep">
                <IconCheck width={12} height={12} strokeWidth={2.5} />
              </span>
              {b}
            </div>
          ))}
        </Reveal>
        <div className="mt-8">
          <ButtonLink href="/wholesale" variant="ink" size="lg">
            Apply for wholesale access
          </ButtonLink>
        </div>
      </div>

      <Reveal delay={0.15} direction="left">
        <p className="mb-6 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          How it works
        </p>
        <ol>
          {wholesaleSteps.map((s, i) => (
            <li key={s.n} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 items-center justify-center bg-ink text-xs font-bold text-white">
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
        </ol>
      </Reveal>
    </section>
  );
}
