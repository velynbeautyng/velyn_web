import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Optional kicker, Cinzel title and optional intro, stacked. `tone="dark"`
 * is for sage, sage-night and ink bands.
 */
export function SectionHeading({
  kicker,
  title,
  intro,
  tone = "light",
  align = "start",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {kicker && (
        <span
          className={cn(
            "kicker",
            align === "center" && "kicker--center",
            tone === "dark" && "kicker--onDark",
          )}
        >
          {kicker}
        </span>
      )}
      <h2
        className={cn(
          "display text-[clamp(1.65rem,3vw,2.5rem)]",
          tone === "dark" ? "text-white [&_em]:text-linen" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "prose-body mt-1 max-w-[60ch] text-[0.95rem]",
            align === "center" && "mx-auto",
            tone === "dark" && "text-white/85",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
