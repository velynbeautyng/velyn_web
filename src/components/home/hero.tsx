import Image from "next/image";
import heroPhoto from "@/assets/photos/hero-cream.jpg";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const trust = ["Named distributors", "Replace or refund", "Nationwide delivery"];

export function Hero() {
  return (
    <section className="grid bg-sage-shade lg:grid-cols-2">
      <div className="section flex flex-col justify-center py-14 sm:py-20 lg:py-24 lg:pr-12">
        <Reveal direction="fade" className="flex items-center gap-3">
          <span className="h-px w-8 bg-linen" />
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white">
            Beauty you can trust
          </span>
        </Reveal>

        <h1 className="display hero-lines mt-6 text-[clamp(2.4rem,5vw,4.25rem)] leading-[1.08] text-white">
          <span className="line">
            <span style={{ ["--i" as string]: 0 }}>Matched.</span>
          </span>
          <span className="line">
            <span style={{ ["--i" as string]: 1 }}>
              <em className="text-linen">Disclosed.</em>
            </span>
          </span>
          <span className="line">
            <span style={{ ["--i" as string]: 2 }}>Guaranteed.</span>
          </span>
        </h1>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-white">
            Original skincare matched to your real concern, bought through named
            distributors, and replaced or refunded if ever confirmed counterfeit.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" variant="gold" size="lg">
            Shop original skincare
          </ButtonLink>
          <ButtonLink href="/partner" variant="outlineLight" size="lg">
            Partner with us
          </ButtonLink>
        </Reveal>

        <Reveal
          delay={0.55}
          as="ul"
          className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-linen/30 pt-6"
        >
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-linen" aria-hidden />
              <span className="text-xs tracking-[0.05em] text-white">{t}</span>
            </li>
          ))}
        </Reveal>
      </div>

      <div className="relative flex items-center justify-center border-linen/15 bg-sage-dusk px-6 py-14 sm:px-10 lg:border-l lg:py-16">
        <div className="tick-frame tick-frame--linen w-full max-w-[22rem] border border-linen/35 p-3 lg:max-w-[26rem]">
          <span className="tick-bl" />
          <span className="tick-br" />
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={heroPhoto}
              alt="A woman with her eyes closed smoothing a dab of moisturiser onto her cheek in soft sunlight"
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="hero-photo object-cover"
            />
          </div>
        </div>
        <div className="absolute bottom-6 right-5 flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center gap-0.5 bg-gold text-center sm:right-8 lg:h-[5.5rem] lg:w-[5.5rem]">
          <span className="font-serif text-[1.35rem] leading-none text-ink lg:text-[1.55rem]">100%</span>
          <span className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Original
          </span>
        </div>
      </div>
    </section>
  );
}
