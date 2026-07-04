import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing your use of the Velyn Beauty & Essentials website and services.",
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Terms of Use", url: `${site.url}/terms` },
        ]}
      />
      <PageHero
        kicker="Legal"
        title={<>Terms of Use</>}
        intro="Please read these terms carefully before using our website and services."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Terms of Use", href: "/terms" },
        ]}
      />
      <section className="section section-y">
        <Reveal>
          <Prose>
            <p>
              These Terms of Use govern your access to and use of the{" "}
              {site.legalName} website. By using the site, you agree to these terms.
            </p>

            <h2>Products and pricing</h2>
            <p>
              We take care to describe products and prices accurately. Prices are in
              Nigerian Naira and may change without notice. Availability is subject
              to stock, and we reserve the right to correct errors and to limit
              quantities.
            </p>

            <h2>Orders</h2>
            <p>
              Placing an order constitutes an offer to purchase. We may accept or
              decline any order, and an order is confirmed once payment is received
              and verified. We reserve the right to cancel orders in cases of
              suspected fraud or pricing errors.
            </p>

            <h2>Authenticity</h2>
            <p>
              We guarantee that products sold through Velyn are authentic and
              sourced from manufacturers or authorised outlets. See our{" "}
              <a href="/authenticity">Authenticity Guarantee</a> for details.
            </p>

            <h2>Acceptable use</h2>
            <ul>
              <li>Do not use the site for unlawful purposes or to infringe others&apos; rights.</li>
              <li>Do not attempt to disrupt, reverse-engineer or gain unauthorised access to the site.</li>
              <li>Do not reproduce our content or branding without permission.</li>
            </ul>

            <h2>Intellectual property</h2>
            <p>
              All content, branding and design on this site are owned by or licensed
              to {site.legalName} and protected by applicable laws.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, Velyn is not liable for indirect or
              consequential losses arising from use of the site. Nothing in these
              terms excludes liability that cannot be excluded under Nigerian law.
            </p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          </Prose>
        </Reveal>
      </section>
    </>
  );
}
