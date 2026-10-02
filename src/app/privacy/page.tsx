import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nuvene Beauty collects, uses and protects your personal information.",
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Privacy Policy", url: `${site.url}/privacy` },
        ]}
      />
      <PageHero
        kicker="Legal"
        title={<>Privacy Policy</>}
        intro="Your privacy matters to us. This policy explains what we collect and why."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />
      <section className="section section-y">
        <Reveal>
          <Prose>
            <p>
              This Privacy Policy explains how {site.legalName} (&ldquo;Nuvene&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses and safeguards your
              information when you use our website and services.
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li>Contact details you provide (name, email, phone) when you order, enquire or apply for wholesale.</li>
              <li>Order and delivery information needed to fulfil your purchase.</li>
              <li>Payment information, processed securely by our payment provider, we do not store full card details.</li>
              <li>Basic usage data (such as pages visited) to improve the site.</li>
            </ul>

            <h2>How we use your information</h2>
            <ul>
              <li>To process orders, payments and deliveries.</li>
              <li>To respond to enquiries and provide customer support.</li>
              <li>To review and manage wholesale and partnership applications.</li>
              <li>To improve our products, services and website experience.</li>
              <li>With your consent, to send updates and offers you can opt out of at any time.</li>
            </ul>

            <h2>Sharing your information</h2>
            <p>
              We share information only with trusted service providers who help us
              operate, such as payment processors and delivery partners, and only
              to the extent necessary. We do not sell your personal information.
            </p>

            <h2>Data security</h2>
            <p>
              We apply reasonable technical and organisational measures to protect
              your information. Payments are handled over encrypted connections by
              our payment provider.
            </p>

            <h2>Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              information, and you may withdraw marketing consent at any time. To
              exercise these rights, contact{" "}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>

            <h2>Contact</h2>
            <p>
              For any privacy questions, email{" "}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or
              write to us at {site.contact.address.line1},{" "}
              {site.contact.address.line2}, {site.contact.address.city}, Nigeria.
            </p>
          </Prose>
        </Reveal>
      </section>
    </>
  );
}
