import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { IconArrowRight, IconGlobe, IconStorefront, IconUser } from "@/components/ui/icons";

const audiences = [
  {
    accent: "border-t-gold",
    iconBox: "border-gold/40 text-gold-pale",
    cta: "text-gold-pale",
    Icon: IconUser,
    title: "Individual customers",
    body: "Original skincare matched to your concern. Ask which distributor any product came from, and our replace-or-refund guarantee covers it.",
    label: "Shop products",
    href: "/shop",
  },
  {
    accent: "border-t-sage-mid",
    iconBox: "border-sage-mid/60 text-sage-pale",
    cta: "text-sage-pale",
    Icon: IconStorefront,
    title: "Retailers and wholesalers",
    body: "Pharmacies, clinics and beauty stores get original stock from named distributors, steady supply, one price list and product education.",
    label: "Apply for wholesale",
    href: "/wholesale",
  },
  {
    accent: "border-t-linen/40",
    iconBox: "border-linen/25 text-linen",
    cta: "text-linen",
    Icon: IconGlobe,
    title: "Foreign brand partners",
    body: "International brands new to Nigeria get a structured, honest route to customers, retailers and skincare professionals.",
    label: "Start a conversation",
    href: "/partner",
  },
];

export function WhoWeServe() {
  return (
    <section className="section section-y bg-sage-night">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <Reveal className="flex flex-col gap-3">
          <span className="kicker kicker--onDark">Who we serve</span>
          <h2 className="display text-[clamp(1.65rem,3vw,2.5rem)] text-white">
            Three audiences,
            <br className="hidden sm:block" /> <em className="text-linen">one trusted partner</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-[0.88rem] leading-relaxed text-linen lg:pb-1">
            Whether you&apos;re buying for yourself, running a store or entering a
            new market, Nuvene is built for you.
          </p>
        </Reveal>
      </div>

      <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
        {audiences.map(({ accent, iconBox, cta, Icon, title, body, label, href }) => (
          <StaggerItem
            key={title}
            className={`flex flex-col gap-4 border border-t-2 border-linen/15 ${accent} p-7 transition-colors duration-300 hover:bg-white/[0.05]`}
          >
            <span className={`flex h-11 w-11 items-center justify-center border ${iconBox}`}>
              <Icon width={18} height={18} />
            </span>
            <h3 className="font-serif text-lg text-white">{title}</h3>
            <p className="text-[0.88rem] leading-relaxed text-white/85">{body}</p>
            <Link
              href={href}
              className={`group/cta mt-auto inline-flex items-center gap-1.5 pt-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${cta}`}
            >
              {label}
              <IconArrowRight
                width={14}
                height={14}
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
              />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
