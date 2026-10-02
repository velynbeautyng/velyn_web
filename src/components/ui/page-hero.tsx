import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { NuveneIcon } from "@/components/brand/nuvene-logo";

export function PageHero({
  kicker,
  title,
  intro,
  breadcrumb,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  breadcrumb?: { name: string; href: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-sage-night">
      <NuveneIcon className="pointer-events-none absolute -right-16 top-1/2 h-64 -translate-y-1/2 text-linen opacity-[0.07] sm:h-80" />
      <div className="section relative z-10 py-14 lg:py-20">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.1em] text-white/75">
              {breadcrumb.map((b, i) => (
                <li key={b.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-linen/60">/</span>}
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-linen">{b.name}</span>
                  ) : (
                    <Link href={b.href} className="hover:text-white">
                      {b.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Reveal>
          <span className="kicker kicker--onDark">{kicker}</span>
          <h1 className="display mt-3 max-w-3xl text-[clamp(1.9rem,4vw,3.1rem)] text-white [&_em]:text-linen">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-white/85">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
