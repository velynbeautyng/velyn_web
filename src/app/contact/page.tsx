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
    "Get in touch with Velyn Beauty & Essentials. Email, call or WhatsApp our team in Abuja — we respond within 24 business hours (wholesale within 48).",
  alternates: { canonical: `${site.url}/contact` },
};

const details = [
  {
    icon: IconMail,
    label: "Email",
    value: site.contact.email,
    sub: "General inquiries",
    href: `mailto:${site.contact.email}`,
  },
  {
    icon: IconPhone,
    label: "Phone",
    value: site.contact.whatsappDisplay,
    sub: site.contact.hours,
    href: `tel:${site.contact.phoneMtn}`,
  },
  {
    icon: IconPin,
    label: "Office",
    value: `${site.contact.address.line1}, ${site.contact.address.line2}`,
    sub: `${site.contact.address.city} · Serving all 36 states`,
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
        kicker="Contact Us"
        title={
          <>
            Let&apos;s Talk <em>Skincare</em>
          </>
        }
        intro="Whether you're a customer, a retailer, or a global brand — we'd love to hear from you."
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
                <div className="flex items-start gap-4 border border-ivory-mid bg-white p-5 transition-colors hover:border-gold">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-gold-faint text-gold-dim">
                    <d.icon width={18} height={18} />
                  </span>
                  <div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-gold-dim">
                      {d.label}
                    </div>
                    <div className="mt-1 font-serif text-base text-espresso">
                      {d.value}
                    </div>
                    <div className="mt-0.5 text-[0.78rem] text-mocha">
                      {d.sub}
                    </div>
                  </div>
                </div>
              );
              return d.href ? (
                <a key={d.label} href={d.href}>
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
                "Hello Velyn, I'd like to speak with a skincare specialist.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-4 bg-espresso p-5 transition-opacity hover:opacity-90"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#25D366]/15 text-[#25D366]">
                <IconWhatsapp width={20} height={20} />
              </span>
              <div>
                <div className="text-sm font-semibold text-ivory">
                  Chat on WhatsApp
                </div>
                <div className="mt-0.5 text-xs text-ivory/40">
                  Usually responds within 30 minutes
                </div>
              </div>
            </a>
          </Reveal>

          <Reveal delay={0.15} className="mt-4">
            <div className="flex flex-wrap gap-4 border-t border-ivory-mid pt-6 text-[0.72rem] uppercase tracking-[0.12em] text-mocha">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">
                Instagram
              </a>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">
                TikTok
              </a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-espresso">
                Facebook
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal direction="left">
          <div className="border border-ivory-mid bg-white p-6 sm:p-8">
            <h2 className="mb-5 font-serif text-2xl text-espresso">
              Send a Message
            </h2>
            <ContactForm tone="light" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
