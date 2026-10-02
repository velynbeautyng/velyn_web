import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import {
  IconMail,
  IconPhone,
  IconPin,
  IconWhatsapp,
} from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Nuvene Beauty in Wuye, Abuja. Email, call or WhatsApp us about your skin concern, an order, wholesale or brand partnerships.",
  alternates: { canonical: `${site.url}/contact` },
};

const details = [
  {
    icon: IconMail,
    label: "Email",
    value: site.contact.email,
    sub: "General enquiries",
    href: `mailto:${site.contact.email}`,
  },
  ...site.contact.phones.map((p) => ({
    icon: IconPhone,
    label: `Phone, ${p.label}`,
    value: p.display,
    sub: site.contact.hours,
    href: `tel:${p.tel}`,
  })),
  {
    icon: IconPin,
    label: "Store",
    value: `${site.contact.address.line1}, ${site.contact.address.line2}`,
    sub: `${site.contact.address.city}, delivering across Nigeria`,
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Contact", url: `${site.url}/contact` },
        ]}
      />
      <PageHero
        kicker="Contact"
        title={
          <>
            Let&apos;s talk <em>skincare</em>
          </>
        }
        intro="Whether you're shopping for your skin, stocking a store or bringing a brand to Nigeria, we'd like to hear from you."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <section className="section section-y grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal className="flex flex-col gap-4">
            {details.map((d) => {
              const Inner = (
                <div className="flex items-start gap-4 border border-linen-mid bg-white p-5 transition-colors hover:border-gold">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-linen-soft text-gold-deep">
                    <d.icon width={18} height={18} />
                  </span>
                  <div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                      {d.label}
                    </div>
                    <div className="mt-1 font-serif text-base text-ink">
                      {d.value}
                    </div>
                    <div className="mt-0.5 text-[0.78rem] text-stone">
                      {d.sub}
                    </div>
                  </div>
                </div>
              );
              return d.href ? (
                <a key={d.label} href={d.href} className="block">
                  {Inner}
                </a>
              ) : (
                <div key={d.label}>{Inner}</div>
              );
            })}
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={whatsappLink(
                "Hello Nuvene, I'd like help choosing a product for my skin concern.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-4 bg-ink p-5 transition-opacity hover:opacity-90"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/30 text-gold">
                <IconWhatsapp width={20} height={20} />
              </span>
              <div>
                <div className="text-sm font-semibold text-white">
                  Chat with us on WhatsApp
                </div>
                <div className="mt-0.5 text-xs text-linen/75">
                  Tell us your skin concern and we&apos;ll suggest what to try.
                </div>
              </div>
            </a>
          </Reveal>

          <Reveal delay={0.15} className="mt-4">
            <div className="flex flex-wrap gap-4 border-t border-linen-mid pt-6 text-[0.72rem] uppercase tracking-[0.12em] text-stone">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                Instagram
              </a>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                TikTok
              </a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                Facebook
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal direction="left">
          <div className="border border-linen-mid bg-white p-6 sm:p-8">
            <h2 className="mb-5 font-serif text-2xl text-ink">
              Send a message
            </h2>
            <ContactForm tone="light" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
