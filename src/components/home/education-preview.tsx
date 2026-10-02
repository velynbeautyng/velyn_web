import Image from "next/image";
import Link from "next/link";
import { getEducationArticles } from "@/lib/ops/blog";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import { NuveneIcon } from "@/components/brand/nuvene-logo";

export async function EducationPreview() {
  const posts = (await getEducationArticles()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          kicker="Education hub"
          title={
            <>
              Know your skin,
              <br className="hidden sm:block" /> <em>trust your routine</em>
            </>
          }
        />
        <ButtonLink href="/education" variant="outlineGold" size="sm" className="w-fit">
          Browse all articles
        </ButtonLink>
      </div>

      <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/education/${post.slug}`}
              className="group flex h-full flex-col border border-linen-mid bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_26px_40px_-32px_rgba(0,0,0,0.4)] motion-reduce:hover:translate-y-0"
            >
              <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-linen-mid bg-linen-mid">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <NuveneIcon className="h-11 text-sage-deep opacity-25 transition-transform duration-500 group-hover:scale-110" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit bg-sage-pale px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-sage-deep">
                  {post.tag}
                </span>
                <h3 className="mt-3 font-serif text-base leading-snug text-ink transition-colors group-hover:text-gold-deep">
                  {post.title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                  Read article
                  <IconArrowRight
                    width={13}
                    height={13}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
