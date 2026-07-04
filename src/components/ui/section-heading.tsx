import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Kicker + serif display heading, the recurring section header from the brand
 * wireframe. `tone` adapts colours for dark (espresso/olive) section bands.
 */
export function SectionHeading({
  kicker,
  title,
  intro,
  tone = "light",
  align = "start",
  className,
}: {
  kicker: string;
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
      <span
        className={cn(
          "kicker",
          align === "center" && "kicker--center",
          tone === "dark" && "kicker--onDark",
        )}
      >
        {kicker}
      </span>
      <h2
        className={cn(
          "display text-[clamp(1.85rem,3.6vw,2.85rem)]",
          tone === "dark" ? "text-ivory" : "text-espresso",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "prose-body mt-1 text-[0.95rem]",
            align === "center" && "mx-auto",
            tone === "dark" && "text-ivory/55",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
