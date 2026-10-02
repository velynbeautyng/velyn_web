import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const pillars = [
  {
    n: "01",
    title: "Match",
    body: "Tell us what you're dealing with: acne, dryness, dark spots, sensitivity or sun. We recommend the active and the product that suit it, across every brand we carry.",
  },
  {
    n: "02",
    title: "Disclose",
    body: "We name the distributor each product comes from. Where a brand offers a batch checker, as COSRX does, we run it with you.",
  },
  {
    n: "03",
    title: "Guarantee",
    body: "If a product you bought from us is ever confirmed counterfeit, we replace it or refund you. The risk sits with us.",
  },
];

export function WhatWeDo() {
  return (
    <section className="section section-y bg-white">
      <SectionHeading
        title={
          <>
            Three habits behind <em>every sale</em>
          </>
        }
        intro="We start with your concern, tell you where the product came from, and stand behind it."
      />
      <Stagger className="mt-12 grid gap-px border border-linen-mid bg-linen-mid md:grid-cols-3">
        {pillars.map((p) => (
          <StaggerItem key={p.n} className="group bg-white p-8 lg:p-10">
            <div className="font-serif text-[2.6rem] leading-none text-gold-pale transition-colors duration-500 group-hover:text-gold">
              {p.n}
            </div>
            <h3 className="mt-4 font-serif text-xl text-ink">{p.title}</h3>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-stone">{p.body}</p>
            {/* scale-x rather than width so the underline animates on the compositor */}
            <div className="mt-5 h-0.5 w-7 origin-left bg-gold transition-transform duration-500 group-hover:scale-x-[1.7]" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
