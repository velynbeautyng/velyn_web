import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand({
  kicker,
  title,
  body,
  primary,
  secondary,
  tone = "ink",
}: {
  kicker?: string;
  title: ReactNode;
  body?: ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "ink" | "gold" | "sage";
}) {
  const bg =
    tone === "gold" ? "bg-gold" : tone === "sage" ? "bg-sage" : "bg-ink";

  return (
    <section className={`section section-y ${bg} text-center`}>
      <Reveal className="mx-auto max-w-2xl">
        {kicker && (
          <span className="kicker kicker--center kicker--onDark mx-auto justify-center">
            {kicker}
          </span>
        )}
        <h2 className="display mt-3 text-[clamp(1.9rem,3.8vw,2.8rem)] text-white">
          {title}
        </h2>
        {body && (
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/60">
            {body}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={primary.href} variant="white" size="lg">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink
              href={secondary.href}
              variant="outlineLight"
              size="lg"
              className="!border-white/30 !text-white/80 hover:!border-white hover:!text-white"
            >
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </Reveal>
    </section>
  );
}
