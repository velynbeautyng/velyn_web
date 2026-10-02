import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TONES = {
  ink: { bg: "bg-ink", kicker: "kicker--onDark", title: "text-white", body: "text-white/80", primary: "gold", secondary: "outlineLight" },
  sage: { bg: "bg-sage-shade", kicker: "text-white", title: "text-white", body: "text-white", primary: "white", secondary: "outlineLight" },
  gold: { bg: "bg-gold", kicker: "text-ink", title: "text-ink", body: "text-ink/80", primary: "ink", secondary: "outline" },
} as const;

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
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <section className={cn("section section-y text-center", t.bg)}>
      <Reveal className="mx-auto max-w-2xl">
        {kicker && (
          <span
            className={cn(
              "kicker kicker--center mx-auto justify-center",
              t.kicker,
            )}
          >
            {kicker}
          </span>
        )}
        <h2
          className={cn(
            "display mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)]",
            tone === "gold" ? "[&_em]:text-ink" : "[&_em]:text-linen",
            t.title,
          )}
        >
          {title}
        </h2>
        {body && (
          <p className={cn("mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed", t.body)}>
            {body}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={primary.href} variant={t.primary} size="lg">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href} variant={t.secondary} size="lg">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </Reveal>
    </section>
  );
}
