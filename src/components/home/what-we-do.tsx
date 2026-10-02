import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const pillars = [
  {
    n: "01",
    title: "Honest distribution",
    body: "Original products bought through named distributors and authorised suppliers. Ask where any product came from, and we replace or refund a confirmed counterfeit.",
  },
  {
    n: "02",
    title: "Results-driven brands",
    body: "We carry skincare that treats real concerns: acne, dryness, dark spots, sensitivity and sun damage, chosen for Nigerian skin.",
  },
  {
    n: "03",
    title: "Simple market access",
    body: "Retail, wholesale and brand partnerships, with delivery across Nigeria. We make it easy to buy, stock and sell original skincare.",
  },
];

export function WhatWeDo() {
  return (
    <section className="section section-y bg-white">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <Reveal className="flex flex-col gap-3">
          <span className="kicker">What we do</span>
          <h2 className="display text-[clamp(1.65rem,3vw,2.5rem)] text-ink">
            Connecting great skincare
            <br className="hidden sm:block" /> to the <em>Nigerian market</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="prose-body max-w-md text-[0.95rem] lg:pt-9">
            We bridge the gap between global skincare brands and Nigerian
            customers who deserve original, effective products, bought through
            named distributors.
          </p>
        </Reveal>
      </div>

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
