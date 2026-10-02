import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { IconArrowRight, IconGlobe, IconStorefront, IconUser } from "@/components/ui/icons";

const audiences = [
  {
    accent: "border-t-gold",
    Icon: IconUser,
    title: "Individual customers",
    body: "Skincare matched to your concern. Ask which distributor any product came from, and our replace-or-refund guarantee covers it.",
    cta: "Shop by concern",
    href: "/shop",
  },
  {
    accent: "border-t-sage-mid",
    Icon: IconStorefront,
    title: "Retailers and wholesalers",
    body: "Pharmacies, clinics, spas and beauty stores get original stock from named distributors, steady supply and one price list for everyone.",
    cta: "Apply for wholesale",
    href: "/wholesale",
  },
  {
    accent: "border-t-linen/50",
    Icon: IconGlobe,
    title: "International brand partners",
    body: "Effective brands that are new to Nigeria get a structured, honest route to customers, retailers and skincare professionals.",
    cta: "Start a conversation",
    href: "/partner",
  },
];

export function WhoWeServe() {
  return (
    <section className="section section-y bg-sage-night">
      <SectionHeading
        tone="dark"
        kicker="Who we serve"
        title={
          <>
            Three ways to <em>work with us</em>
          </>
        }
      />
      <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
        {audiences.map(({ accent, Icon, title, body, cta, href }) => (
          <StaggerItem
            key={title}
            className={`flex flex-col gap-4 border border-t-2 border-linen/15 ${accent} bg-white/[0.03] p-7 transition-colors duration-300 hover:bg-white/[0.07]`}
          >
            <span className="flex h-11 w-11 items-center justify-center border border-linen/25 text-linen">
              <Icon width={20} height={20} />
            </span>
            <h3 className="font-serif text-lg text-white">{title}</h3>
            <p className="text-[0.88rem] leading-relaxed text-white/85">{body}</p>
            <Link
              href={href}
              className="group/cta mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-linen"
            >
              {cta}
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
