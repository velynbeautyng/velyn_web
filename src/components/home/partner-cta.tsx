import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

const points = [
  {
    title: "Market Entry Strategy",
    body: "Guided rollout plans tailored to the Nigerian consumer landscape and competitive beauty market.",
  },
  {
    title: "Brand Protection",
    body: "We guard your brand integrity against counterfeiting and ensure authentic representation at every touchpoint.",
  },
  {
    title: "Distribution & Intelligence",
    body: "Active distribution across Nigeria with real customer data fed back to help you grow long-term.",
  },
];

export function PartnerCta() {
  return (
    <section className="section section-y bg-olive text-center">
      <Reveal className="mx-auto max-w-2xl">
        <span className="kicker kicker--center mx-auto justify-center [&::before]:bg-white/35 [&::after]:bg-white/35 text-white/60">
          Foreign Brand Partners
        </span>
        <h2 className="display mt-3 text-[clamp(2rem,4vw,2.9rem)] text-white">
          Entering Africa
          <br className="hidden sm:block" />{" "}
          <em className="text-white/60">the Right Way</em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/60">
          Velyn provides market entry strategy, distribution infrastructure,
          brand protection, and real customer intelligence, everything a global
          skincare brand needs to grow in Nigeria.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/partner" variant="white" size="lg">
            Start a Partnership Conversation
          </ButtonLink>
          <ButtonLink
            href="/partner#criteria"
            variant="outlineLight"
            size="lg"
            className="!border-white/30 !text-white/80 hover:!border-white hover:!text-white"
          >
            What We Look For
          </ButtonLink>
        </div>
      </Reveal>

      <Stagger className="mx-auto mt-14 grid max-w-4xl gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
        {points.map((p) => (
          <StaggerItem key={p.title} className="bg-olive p-6 text-left">
            <h3 className="font-serif text-base text-white">{p.title}</h3>
            <p className="mt-2 text-[0.83rem] leading-relaxed text-white/50">
              {p.body}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
