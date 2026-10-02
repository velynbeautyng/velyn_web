import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { VelynMark } from "@/components/brand/velyn-mark";

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
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 opacity-[0.06]"
      >
        <VelynMark className="h-72 w-auto" tone="gold" />
      </div>
      <div className="section relative z-10 py-14 lg:py-20">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.1em] text-linen/35">
              {breadcrumb.map((b, i) => (
                <li key={b.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-gold/40">/</span>}
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-gold">{b.name}</span>
                  ) : (
                    <Link href={b.href} className="hover:text-linen">
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
          <h1 className="display mt-3 max-w-3xl text-[clamp(2.1rem,4.5vw,3.4rem)] text-linen">
            {title}
          </h1>
          {intro && (
            <p className="prose-body mt-4 max-w-2xl text-[1rem] text-linen/55">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
