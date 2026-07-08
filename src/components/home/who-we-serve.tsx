import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { IconArrowRight } from "@/components/ui/icons";

const audiences = [
  {
    accent: "border-t-gold",
    title: "Individual Customers",
    body: "Shop authentic skincare curated for Nigerian skin concerns. Every product verified original, no fakes, no compromises.",
    cta: "Shop Products",
    href: "/shop",
    ctaClass: "text-gold",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="2.5" stroke="#BD9468" strokeWidth="1.3" />
        <path
          d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
          stroke="#BD9468"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    accent: "border-t-olive",
    title: "Retailers & Wholesalers",
    body: "Pharmacies, clinics, beauty stores, guaranteed supply, verified authenticity, competitive wholesale pricing and product education.",
    cta: "Apply for Wholesale",
    href: "/wholesale",
    ctaClass: "text-olive-mid",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="7" width="12" height="7" rx="1" stroke="#8A8A00" strokeWidth="1.3" />
        <path d="M5 7V5a3 3 0 016 0v2" stroke="#8A8A00" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    accent: "border-t-ivory/25",
    title: "Foreign Brand Partners",
    body: "International brands entering Africa gain a trusted partner with deep market knowledge, brand protection and distribution infrastructure.",
    cta: "Start a Conversation",
    href: "/partner",
    ctaClass: "text-ivory/60",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="rgba(247,244,239,0.5)" strokeWidth="1.3" />
        <path
          d="M2 8h12M8 2c-1.5 2-2 4-2 6s.5 4 2 6"
          stroke="rgba(247,244,239,0.5)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function WhoWeServe() {
  return (
    <section className="section section-y bg-espresso">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          tone="dark"
          kicker="Who We Serve"
          title={
            <>
              Three Audiences,
              <br className="hidden sm:block" /> <em>One Trusted Partner</em>
            </>
          }
        />
        <p className="max-w-xs text-[0.85rem] leading-relaxed text-ivory/35 lg:pb-2">
          Whether buying for yourself, running retail, or entering a new market,
          Velyn is built for you.
        </p>
      </div>

      <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
        {audiences.map((a) => (
          <StaggerItem
            key={a.title}
            className={`flex flex-col gap-4 border border-gold/10 border-t-2 ${a.accent} bg-espresso-mid/30 p-7 transition-colors duration-300 hover:bg-espresso-mid/60`}
          >
            <span className="flex h-11 w-11 items-center justify-center border border-gold/15">
              {a.icon}
            </span>
            <h3 className="font-serif text-lg text-ivory">{a.title}</h3>
            <p className="text-[0.85rem] leading-relaxed text-ivory/40">
              {a.body}
            </p>
            <Link
              href={a.href}
              className={`mt-1 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${a.ctaClass}`}
            >
              {a.cta}
              <IconArrowRight width={14} height={14} />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
