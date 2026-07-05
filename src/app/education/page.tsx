import type { Metadata } from "next";
import Link from "next/link";
import { getEducationArticles } from "@/lib/ops/blog";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { VelynMark } from "@/components/brand/velyn-mark";
import { IconArrowRight } from "@/components/ui/icons";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Education Hub — Skincare Guides",
  description:
    "Evidence-based skincare education from Velyn: ingredient guides, treating hyperpigmentation on Nigerian skin, spotting counterfeits, and building effective routines.",
  alternates: { canonical: `${site.url}/education` },
};

export const revalidate = 300;

export default async function EducationPage() {
  const articles = await getEducationArticles();
  const [lead, ...rest] = articles;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Education", url: `${site.url}/education` },
        ]}
      />
      <PageHero
        kicker="Education Hub"
        title={
          <>
            Know Your Skin, <em>Trust Your Routine</em>
          </>
        }
        intro="Evidence-based insights that translate complex dermatology into clear, practical guidance — so you can make confident, well-informed choices."
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Education", href: "/education" },
        ]}
      />

      <section className="section section-y">
        {/* Featured */}
        <Link
          href={`/education/${lead.slug}`}
          className="group grid overflow-hidden border border-ivory-mid bg-white md:grid-cols-2"
        >
          <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-espresso">
            {lead.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lead.coverImage}
                alt={lead.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <VelynMark
                className="h-16 w-auto opacity-20 transition-transform duration-500 group-hover:scale-110"
                tone="gold"
              />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <span className="w-fit bg-olive-pale px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-olive">
              {lead.tag}
            </span>
            <h2 className="mt-4 font-serif text-2xl leading-tight text-espresso group-hover:text-gold-dim lg:text-3xl">
              {lead.title}
            </h2>
            <p className="prose-body mt-3 text-[0.9rem]">{lead.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gold-dim">
              Read Article <IconArrowRight width={14} height={14} />
            </span>
          </div>
        </Link>

        {/* Rest */}
        <Stagger className="mt-4 grid gap-4 md:grid-cols-3">
          {rest.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/education/${post.slug}`}
                className="group flex h-full flex-col border border-ivory-mid bg-white transition-shadow duration-300 hover:shadow-[0_20px_40px_-28px_rgba(44,26,14,0.4)]"
              >
                <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-ivory-mid bg-espresso">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <VelynMark
                      className="h-10 w-auto opacity-20 transition-transform duration-500 group-hover:scale-110"
                      tone="gold"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="w-fit bg-olive-pale px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-olive">
                    {post.tag}
                  </span>
                  <h3 className="mt-3 font-serif text-base leading-snug text-espresso group-hover:text-gold-dim">
                    {post.title}
                  </h3>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-gold-dim">
                    {post.readMinutes} min read
                    <IconArrowRight width={13} height={13} />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand
        title={
          <>
            Ready to Build Your <em className="text-white/70">Routine?</em>
          </>
        }
        body="Shop authenticated skincare curated for your concerns, or talk to a specialist on WhatsApp."
        primary={{ label: "Shop Skincare", href: "/shop" }}
        secondary={{ label: "Contact a Specialist", href: "/contact" }}
      />
    </>
  );
}
