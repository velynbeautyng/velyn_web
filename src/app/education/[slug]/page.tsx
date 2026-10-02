import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEducationArticle, getEducationArticles } from "@/lib/ops/blog";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getEducationArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getEducationArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    alternates: { canonical: `${site.url}/education/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.metaDescription || article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getEducationArticle(slug);
  if (!article) notFound();

  const related = (await getEducationArticles())
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: site.url },
          { name: "Education", url: `${site.url}/education` },
          { name: article.title, url: `${site.url}/education/${article.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          author: { "@type": "Organization", name: site.name },
          publisher: {
            "@type": "Organization",
            name: site.name,
            logo: {
              "@type": "ImageObject",
              url: `${site.url}/brand/PNG/PRIMARY%20LOGO/COLORED%201.png`,
            },
          },
          mainEntityOfPage: `${site.url}/education/${article.slug}`,
        }}
      />

      <PageHero
        kicker={article.tag}
        title={article.title}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Education", href: "/education" },
          { name: article.tag, href: "/education" },
        ]}
      />

      <article className="section section-y">
        <Reveal className="mb-8 flex items-center gap-4 border-b border-linen-mid pb-6 text-[0.7rem] uppercase tracking-[0.12em] text-stone">
          <span>{article.readMinutes} min read</span>
          <span className="text-gold">·</span>
          <span>
            {new Date(article.date).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </Reveal>

        <Reveal>
          <Prose>
            {article.bodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
            ) : (
              article.body.map((block, i) => (
                <div key={i}>
                  {block.heading && <h2>{block.heading}</h2>}
                  {block.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              ))
            )}
          </Prose>
        </Reveal>

        <div className="mt-12 border-t border-linen-mid pt-8">
          <div className="flex flex-col items-start justify-between gap-5 bg-linen-soft p-7 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-xl text-ink">
                Shop original skincare
              </h2>
              <p className="mt-1 text-[0.85rem] text-stone">
                Put this into practice with products matched to your concern.
              </p>
            </div>
            <ButtonLink href="/shop" variant="gold" size="md" className="shrink-0">
              Browse Products
            </ButtonLink>
          </div>
        </div>
      </article>

      <section className="section section-y bg-linen">
        <h2 className="font-serif text-2xl text-ink">Keep reading</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {related.map((post) => (
            <Link
              key={post.slug}
              href={`/education/${post.slug}`}
              className="group border border-linen-mid bg-white p-6 transition-shadow duration-300 hover:shadow-[0_20px_40px_-28px_rgba(0,0,0,0.4)]"
            >
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.12em] text-sage-deep">
                {post.tag}
              </span>
              <h3 className="mt-2 font-serif text-base leading-snug text-ink group-hover:text-gold-deep">
                {post.title}
              </h3>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-gold-deep">
                Read <IconArrowRight width={12} height={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
