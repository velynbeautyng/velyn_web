import { site, whatsappLink } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { IconMail, IconPhone, IconPin, IconWhatsapp } from "@/components/ui/icons";

const details = [
  {
    icon: <IconMail width={16} height={16} className="text-gold" />,
    main: site.contact.email,
    sub: "General enquiries",
    href: `mailto:${site.contact.email}`,
  },
  ...site.contact.phones.map((p) => ({
    icon: <IconPhone width={16} height={16} className="text-gold" />,
    main: p.display,
    sub: `${p.label}, ${site.contact.hours}`,
    href: `tel:${p.tel}`,
  })),
  {
    icon: <IconPin width={16} height={16} className="text-gold" />,
    main: `${site.contact.address.line2}, ${site.contact.address.city}`,
    sub: site.contact.address.line1,
    href: undefined,
  },
];

export function ContactSection() {
  return (
    <section className="section section-y grid gap-12 bg-ink lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading
          tone="dark"
          kicker="Contact"
          title={
            <>
              Let&apos;s talk <em className="text-gold">skincare</em>
            </>
          }
        />
        <Reveal className="mt-8 flex flex-col gap-5" delay={0.1}>
          {details.map((d) => {
            const row = (
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/25">
                  {d.icon}
                </span>
                <div>
                  <div className="font-serif text-base text-white">{d.main}</div>
                  <div className="mt-0.5 text-xs text-linen/75">{d.sub}</div>
                </div>
              </div>
            );
            return d.href ? (
              <a key={d.main} href={d.href} className="transition-opacity hover:opacity-80">
                {row}
              </a>
            ) : (
              <div key={d.main}>{row}</div>
            );
          })}
        </Reveal>

        <a
          href={whatsappLink("Hello Nuvene, I'd like help choosing a product for my skin concern.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex items-center gap-3.5 border border-gold/25 bg-white/[0.03] px-5 py-4 transition-colors hover:border-gold"
        >
          <IconWhatsapp width={22} height={22} className="shrink-0 text-gold" />
          <div>
            <div className="text-sm font-semibold text-white">Chat with us on WhatsApp</div>
            <div className="mt-0.5 text-xs text-linen/75">
              Tell us your skin concern and we&apos;ll suggest what to try.
            </div>
          </div>
        </a>
      </div>

      <Reveal direction="left" delay={0.15}>
        <div className="border border-gold/20 bg-white/[0.03] p-6 sm:p-8">
          <h3 className="mb-5 font-serif text-xl text-white">Send a message</h3>
          <ContactForm tone="dark" />
        </div>
      </Reveal>
    </section>
  );
}
