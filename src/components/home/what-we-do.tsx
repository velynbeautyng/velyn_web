import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const pillars = [
  {
    n: "01",
    title: "Authentic Distribution",
    body: "Direct-from-manufacturer sourcing. Every product verified before it reaches your hands — no counterfeits, no compromise.",
  },
  {
    n: "02",
    title: "Results-Driven Brands",
    body: "We curate skincare that treats real concerns — acne, hyperpigmentation, uneven tone — formulated for Nigerian skin.",
  },
  {
    n: "03",
    title: "Seamless Market Access",
    body: "Retail, wholesale and brand-partnership distribution across all 36 states. We make market entry simple.",
  },
];

export function WhatWeDo() {
  return (
    <section className="section section-y bg-white">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          kicker="What We Do"
          title={
            <>
              Connecting Great Skincare
              <br className="hidden sm:block" /> to the{" "}
              <em>African Market</em>
            </>
          }
        />
        <p className="prose-body max-w-md text-[0.95rem] lg:pb-2">
          We bridge the gap between global skincare innovation and Nigerian
          consumers who deserve access to authentic, effective products —
          directly from manufacturers.
        </p>
      </div>

      <Stagger className="mt-12 grid gap-px border border-ivory-mid bg-ivory-mid sm:grid-cols-3">
        {pillars.map((p) => (
          <StaggerItem key={p.n} className="group bg-white p-8">
            <div className="font-serif text-[2.6rem] leading-none text-gold-pale transition-colors duration-300 group-hover:text-gold">
              {p.n}
            </div>
            <h3 className="mt-3 font-serif text-lg text-espresso">{p.title}</h3>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-cocoa">
              {p.body}
            </p>
            <div className="mt-4 h-0.5 w-7 bg-gold transition-all duration-300 group-hover:w-12" />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
