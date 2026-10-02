import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";

const benefits = [
  "Guaranteed authentic products",
  "Consistent supply chain",
  "Competitive wholesale pricing",
  "Product education support",
];

const steps = [
  {
    n: 1,
    title: "Apply",
    body: "Submit your wholesale application with business details and product interests.",
  },
  {
    n: 2,
    title: "Verification",
    body: "Our team reviews and verifies your business credentials within 48 hours.",
  },
  {
    n: 3,
    title: "Onboarding",
    body: "Receive your wholesale pricing catalogue and dedicated account setup guidance.",
  },
  {
    n: 4,
    title: "Order & Support",
    body: "Begin ordering with account management and ongoing product education resources.",
  },
];

export function WholesalePreview() {
  return (
    <section className="section section-y grid gap-12 bg-white lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading
          kicker="Wholesale & Retailers"
          title={
            <>
              The Right Supply
              <br className="hidden sm:block" />{" "}
              <em>Partner for Your Business</em>
            </>
          }
          intro="Built for pharmacies, dermatology clinics, beauty stores, and skincare professionals who need consistent, verified product supply."
        />
        <Reveal className="mt-7 grid gap-2.5 sm:grid-cols-2" delay={0.1}>
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2.5 text-[0.85rem] text-stone">
              <span className="flex h-5 w-5 items-center justify-center bg-sage-pale text-sage-deep">
                <IconCheck width={12} height={12} strokeWidth={2.5} />
              </span>
              {b}
            </div>
          ))}
        </Reveal>
        <div className="mt-8">
          <ButtonLink href="/wholesale" variant="ink" size="lg">
            Apply for Wholesale Access
          </ButtonLink>
        </div>
      </div>

      <Reveal delay={0.15} direction="left">
        <p className="mb-6 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-deep">
          How It Works
        </p>
        <ol className="relative">
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
                <h3 className="font-serif text-base text-ink">{s.title}</h3>
                <p className="mt-1 text-[0.83rem] leading-relaxed text-stone">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
