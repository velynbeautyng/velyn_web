import { ButtonLink } from "@/components/ui/button";
import { VelynMark } from "@/components/brand/velyn-mark";
import { Reveal, Stagger } from "@/components/motion/reveal";

const trust = ["Verified Sourcing", "Direct Manufacturer", "Nationwide Delivery"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso">
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(189,148,104,0.35), transparent 70%)",
        }}
      />
      <div className="section grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        {/* Copy */}
        <div className="relative z-10 max-w-xl">
          <Reveal className="mb-6 flex items-center gap-2.5" direction="fade">
            <span className="h-px w-8 bg-gold" />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold">
              Nigeria&apos;s Premier Skincare Distributor
            </span>
          </Reveal>

          <Stagger
            as="h1"
            className="display text-[clamp(2.6rem,6vw,4.5rem)] text-ivory"
          >
            <span className="block">Authentic.</span>
            <span className="block italic text-gold">Effective.</span>
            <span className="block">Trusted.</span>
          </Stagger>

          <Reveal delay={0.15}>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ivory/55">
              Sourcing 100% original skincare directly from manufacturers,
              connecting the world&apos;s most trusted brands to the African
              market, with authenticity you can verify.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="gold" size="lg">
              Shop Authentic Skincare
            </ButtonLink>
            <ButtonLink href="/partner" variant="outlineLight" size="lg">
              Partner With Us
            </ButtonLink>
          </Reveal>

          <Reveal
            delay={0.35}
            as="ul"
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-gold/10 pt-6"
          >
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" />
                <span className="text-xs tracking-[0.05em] text-ivory/40">
                  {t}
                </span>
              </li>
            ))}
          </Reveal>
        </div>

        {/* Brand panel */}
        <Reveal
          direction="left"
          delay={0.2}
          className="relative z-10 mx-auto w-full max-w-md lg:mx-0"
        >
          <div className="tick-frame relative aspect-[4/5] border border-gold/20 bg-espresso-mid">
            <span className="tick-bl" />
            <span className="tick-br" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <VelynMark className="h-24 w-auto animate-float opacity-90" tone="gold" />
              <span className="text-[0.62rem] uppercase tracking-[0.3em] text-gold/50">
                Beauty You Can Trust
              </span>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 0%, rgba(189,148,104,0.10), transparent 60%)",
              }}
            />
          </div>

          {/* Authenticity badge */}
          <div className="absolute -bottom-5 -right-3 flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center bg-gold text-white shadow-xl sm:-right-5">
            <span className="font-serif text-xl font-semibold leading-none">
              100%
            </span>
            <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/80">
              Authentic
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
