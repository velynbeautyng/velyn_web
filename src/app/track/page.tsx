import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { TrackForm } from "@/components/forms/track-form";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Check the status of your Velyn Beauty & Essentials order. Enter your order number and we'll help you track it.",
  alternates: { canonical: `${site.url}/track` },
};

export default function TrackPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Track Order", url: `${site.url}/track` },
        ]}
      />
      <PageHero
        kicker="Support"
        title={
          <>
            Track Your <em>Order</em>
          </>
        }
        intro="Enter your order number and we'll connect you with a specialist for a real-time update."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Track Order", href: "/track" },
        ]}
      />
      <section className="section section-y">
        <Reveal className="mx-auto max-w-xl">
          <div className="border border-ivory-mid bg-white p-6 sm:p-8">
            <TrackForm />
            <p className="mt-5 border-t border-ivory-mid pt-5 text-[0.83rem] leading-relaxed text-cocoa">
              You can find your order number in your confirmation email or
              message. Prefer to talk? Reach us directly at{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-gold-dim underline underline-offset-2 hover:text-espresso"
              >
                {site.contact.email}
              </a>{" "}
              or on WhatsApp at {site.contact.whatsappDisplay}.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
