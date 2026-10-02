import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

export const partnerPoints = [
  {
    title: "Market entry strategy",
    body: "A planned rollout through our retail, wholesale and online channels, shaped around Nigerian customers.",
  },
  {
    title: "Honest representation",
    body: "Your products sold under our match, disclose and guarantee promise, with education for customers and retailers.",
  },
  {
    title: "Distribution and feedback",
    body: "Steady distribution across Nigeria, with what customers tell us passed back to help you grow.",
  },
];

export function PartnerCta() {
  return (
    <section id="partners" className="section section-y scroll-mt-28 bg-sage-shade text-center">
      <Reveal className="mx-auto max-w-2xl">
        <span className="kicker kicker--center mx-auto justify-center text-white">
          Foreign brand partners
        </span>
        <h2 className="display mt-3 text-[clamp(1.9rem,3.8vw,2.8rem)] text-white">
          Entering Nigeria
          <br className="hidden sm:block" /> <em className="text-linen">the right way</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white">
          Nuvene gives international skincare brands a structured way into
          Nigeria: a planned rollout, honest representation and real customer
          feedback.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/partner" variant="white" size="lg">
            Start a partnership conversation
          </ButtonLink>
          <ButtonLink href="/partner#criteria" variant="outlineLight" size="lg">
            What we look for
          </ButtonLink>
        </div>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-4xl gap-px border border-white/15 bg-white/15 md:grid-cols-3">
        {partnerPoints.map((p) => (
          <StaggerItem key={p.title} className="bg-sage-shade p-6 text-left">
            <h3 className="font-serif text-base text-white">{p.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-white">{p.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
