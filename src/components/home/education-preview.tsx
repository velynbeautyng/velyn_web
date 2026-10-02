import Link from "next/link";
import { articles } from "@/lib/education";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";
import { NuveneIcon } from "@/components/brand/nuvene-logo";

export function EducationPreview() {
  const posts = articles.slice(0, 3);

  return (
    <section className="section section-y bg-linen">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          kicker="Education Hub"
          title={
            <>
              Know Your Skin,
              <br className="hidden sm:block" /> <em>Trust Your Routine</em>
            </>
          }
        />
        <ButtonLink
          href="/education"
          variant="outlineLight"
          size="sm"
          className="w-fit"
        >
          Browse All Articles
        </ButtonLink>
      </div>

      <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/education/${post.slug}`}
              className="group flex h-full flex-col border border-linen-mid bg-white transition-shadow duration-300 hover:shadow-[0_20px_40px_-28px_rgba(0,0,0,0.4)]"
            >
              <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-linen-mid bg-ink">
                <NuveneIcon className="h-10 w-auto opacity-20 transition-transform duration-500 group-hover:scale-110 text-gold" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit bg-sage-pale px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-sage-deep">
                  {post.tag}
                </span>
                <h3 className="mt-3 font-serif text-base leading-snug text-ink group-hover:text-gold-deep">
                  {post.title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-gold-deep">
                  Read Article
                  <IconArrowRight width={13} height={13} />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
