import Image from "next/image";
import heroPhoto from "@/assets/photos/hero-cream.jpg";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section className="grid bg-sage-shade lg:grid-cols-[1.08fr_0.92fr]">
      <div className="section flex flex-col justify-center py-14 sm:py-20 lg:py-24 lg:pr-14">
        <Reveal direction="fade" className="flex items-center gap-3">
          <span className="h-px w-8 bg-linen" />
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white">
            Beauty you can trust
          </span>
        </Reveal>

        <h1 className="display hero-lines mt-6 text-[clamp(1.75rem,3.05vw,2.9rem)] text-white">
          <span className="line">
            <span style={{ ["--i" as string]: 0 }}>The right skincare</span>
          </span>
          <span className="line">
            <span style={{ ["--i" as string]: 1 }}>
              for your <em className="text-ink">real concern</em>
            </span>
          </span>
        </h1>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-md text-[1rem] leading-relaxed text-white">
            Original skincare from named distributors, matched to your concern,
            and replaced or refunded if ever confirmed counterfeit.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" variant="gold" size="lg">
            Shop by concern
          </ButtonLink>
          <ButtonLink href="/partner" variant="outlineLight" size="lg">
            Partner with us
          </ButtonLink>
        </Reveal>
      </div>

      <div className="flex items-center justify-center bg-sage-dusk px-6 py-12 sm:px-10 lg:py-16">
        <div className="relative w-full max-w-[24rem] lg:max-w-[28rem]">
          <div className="tick-frame tick-frame--linen border border-linen/35 p-3">
            <span className="tick-bl" />
            <span className="tick-br" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={heroPhoto}
                alt="A woman with her eyes closed smoothing a dab of moisturiser onto her cheek in soft sunlight"
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 90vw, 28rem"
                className="hero-photo object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 flex h-24 w-24 flex-col items-center justify-center bg-gold text-center sm:-left-6 lg:-left-10">
            <span className="font-serif text-[1.05rem] leading-none text-ink">Replace</span>
            <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-ink">
              or refund
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
