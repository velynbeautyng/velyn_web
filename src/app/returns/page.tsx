import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Returns Policy",
  description:
    "Velyn Beauty & Essentials returns policy, eligibility, timelines and how to request a return for authentic skincare purchased in Nigeria.",
  alternates: { canonical: `${site.url}/returns` },
};

export default function ReturnsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Returns Policy", url: `${site.url}/returns` },
        ]}
      />
      <PageHero
        kicker="Support"
        title={<>Returns Policy</>}
        intro="We want you to shop with confidence. Here's how returns work."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Returns", href: "/returns" },
        ]}
      />
      <section className="section section-y">
        <Reveal>
          <Prose>
            <h2>Our approach</h2>
            <p>
              Because skincare is a personal, hygiene-sensitive category and
              authenticity is central to what we do, our returns policy balances
              customer protection with product safety. Please read the eligibility
              conditions below before requesting a return.
            </p>

            <h2>Eligible returns</h2>
            <ul>
              <li>Products that are unopened and in their original, sealed packaging.</li>
              <li>Items where the wrong product was delivered.</li>
              <li>Products with a verified manufacturing defect or damage sustained in transit.</li>
            </ul>

            <h2>Not eligible</h2>
            <ul>
              <li>Opened or used skincare products (for hygiene and authenticity reasons), except in the case of a verified defect.</li>
              <li>Products reported after the returns window has closed.</li>
              <li>Items without proof of purchase from Velyn.</li>
            </ul>

            <h2>Returns window</h2>
            <p>
              Report any issue within <strong>7 days</strong> of delivery. Damaged
              or incorrect items should be reported within <strong>48 hours</strong>{" "}
              of delivery, with photos where possible, so we can resolve them
              quickly.
            </p>

            <h2>How to request a return</h2>
            <p>
              Contact us at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>{" "}
              or on WhatsApp at {site.contact.whatsappDisplay} with your order
              number and a description of the issue. Our team will confirm
              eligibility and guide you through the next steps.
            </p>

            <h2>Refunds</h2>
            <p>
              Approved refunds are processed to your original payment method or via
              bank transfer, typically within 5–10 business days of the returned
              item being received and inspected. Delivery fees are non-refundable
              except where the return is due to our error.
            </p>
          </Prose>
        </Reveal>
      </section>
    </>
  );
}
