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
    "Answers about our sourcing, ordering, delivery across Nigeria, payments, returns and wholesale at Nuvene Beauty.",
  alternates: { canonical: `${site.url}/faq` },
};

const faqs: QA[] = [
  {
    q: "Are your products original?",
    a: "Yes. We buy only through established distributors and authorised suppliers, and we tell you which one each product came from. Where a brand offers a batch checker, we run it with you. If a product you bought from us is ever confirmed counterfeit, we replace it or refund you.",
  },
  {
    q: "Do you deliver nationwide?",
    a: "We deliver across Nigeria from Abuja. Delivery fees and timelines are confirmed at checkout based on your location.",
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
    a: "Submit the wholesale application on our Wholesale page. We review your application, then send your pricing catalogue and onboarding details.",
  },
  {
    q: "I represent an international brand. How do I partner with Nuvene?",
    a: "Visit our Partner With Us page and start a conversation. We help effective international brands reach Nigerian customers, retailers and skincare professionals through a structured rollout.",
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
            Frequently asked <em>questions</em>
          </>
        }
        intro="Everything you need to know about our sourcing, ordering, delivery and partnerships."
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
            Still have <em>a question?</em>
          </>
        }
        body="Send us a message, or chat with us on WhatsApp about your skin concern or an order."
        primary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
