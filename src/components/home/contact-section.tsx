import { site, whatsappLink } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { IconMail, IconPhone, IconPin } from "@/components/ui/icons";

const details = [
  {
    icon: <IconMail width={16} height={16} className="text-gold" />,
    main: site.contact.email,
    sub: "General Inquiries",
    href: `mailto:${site.contact.email}`,
  },
  {
    icon: <IconPhone width={16} height={16} className="text-gold" />,
    main: site.contact.whatsappDisplay,
    sub: site.contact.hours,
    href: `tel:${site.contact.phoneMtn}`,
  },
  {
    icon: <IconPin width={16} height={16} className="text-gold" />,
    main: "Utako, Abuja, Nigeria",
    sub: "Serving all 36 States",
    href: undefined,
  },
];

export function ContactSection() {
  return (
    <section className="section section-y grid gap-12 bg-ink lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading
          tone="dark"
          kicker="Contact Us"
          title={
            <>
              Let&apos;s Talk{" "}
              <em className="text-gold">Skincare</em>
            </>
          }
        />
        <Reveal className="mt-8 flex flex-col gap-5" delay={0.1}>
          {details.map((d) => {
            const Row = (
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/15 bg-gold/[0.06]">
                  {d.icon}
                </span>
                <div>
                  <div className="font-serif text-base text-linen">{d.main}</div>
                  <div className="mt-0.5 text-xs text-linen/35">{d.sub}</div>
                </div>
              </div>
            );
            return d.href ? (
              <a key={d.sub} href={d.href} className="transition-opacity hover:opacity-80">
                {Row}
              </a>
            ) : (
              <div key={d.sub}>{Row}</div>
            );
          })}
        </Reveal>

        <a
          href={whatsappLink("Hello Velyn, I'd like to speak with a skincare specialist.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex items-center gap-3.5 border border-gold/15 bg-gold/[0.05] px-5 py-4 transition-colors hover:bg-gold/10"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
          </span>
          <div>
            <div className="text-sm font-semibold text-linen">
              Talk to a Skincare Specialist
            </div>
            <div className="mt-0.5 text-xs text-linen/35">
              Usually responds within 30 minutes via WhatsApp
            </div>
          </div>
        </a>
      </div>

      <Reveal direction="left" delay={0.15}>
        <div className="border border-gold/10 bg-linen/[0.03] p-6 sm:p-8">
          <h3 className="mb-5 font-serif text-xl text-linen">Send a Message</h3>
          <ContactForm tone="dark" />
        </div>
      </Reveal>
    </section>
  );
}
