import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Accordion, type QA } from "@/components/ui/accordion";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about authenticity, ordering, delivery across Nigeria, payments, returns and wholesale with Velyn Beauty & Essentials.",
  alternates: { canonical: `${site.url}/faq` },
};

const faqs: QA[] = [
  {
    q: "Are your products 100% authentic?",
    a: "Yes. Every product is sourced directly from manufacturers or authorised outlets and verified, printing, holograms, tamper seals and batch codes, before it is listed. Authenticity is built into our standard operating procedure.",
  },
  {
    q: "Do you deliver nationwide?",
    a: "We deliver across all 36 states of Nigeria. Delivery timelines and fees are confirmed at checkout based on your location.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept secure card payments and bank transfers through our payment provider at checkout. You can also arrange payment via WhatsApp for assisted orders.",
  },
  {
    q: "How do I know which product is right for my skin?",
    a: "Filter the shop by your skin concern, read our Education Hub guides, or message a skincare specialist on WhatsApp for a personalised recommendation.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened products in their original, sealed packaging can be returned within our returns window. For hygiene and authenticity reasons, opened skincare cannot be resold and is only eligible in the case of a verified defect. See our Returns Policy for details.",
  },
  {
    q: "How do I become a wholesale partner?",
    a: "Submit the wholesale application on our Wholesale page. We verify business credentials within 48 hours and send your pricing catalogue and onboarding details.",
  },
  {
    q: "I represent an international brand, how do I partner with Velyn?",
    a: "Visit our Partner With Us page and start a partnership conversation. We provide market-entry strategy, distribution, brand protection and customer intelligence for the Nigerian market.",
  },
];

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "FAQ", url: `${site.url}/faq` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <PageHero
        kicker="Support"
        title={
          <>
            Frequently Asked <em>Questions</em>
          </>
        }
        intro="Everything you need to know about authenticity, ordering, delivery and partnerships."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />

      <section className="section section-y">
        <Reveal className="mx-auto max-w-3xl">
          <Accordion items={faqs} />
        </Reveal>
      </section>

      <CtaBand
        title={
          <>
            Still Have a <em className="text-white/70">Question?</em>
          </>
        }
        body="Our team responds within 24 business hours, or reach a specialist instantly on WhatsApp."
        primary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
