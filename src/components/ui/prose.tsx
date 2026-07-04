import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent long-form typography for legal, policy and article body copy. */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-espresso",
        "[&_h3]:mt-7 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-espresso",
        "[&_p]:mt-4 [&_p]:text-[0.95rem] [&_p]:leading-[1.75] [&_p]:text-cocoa",
        "[&_ul]:mt-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:relative [&_li]:pl-5 [&_li]:text-[0.95rem] [&_li]:leading-relaxed [&_li]:text-cocoa",
        "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-2.5 [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:bg-gold",
        "[&_a]:text-gold-dim [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-espresso",
        "[&_strong]:font-semibold [&_strong]:text-espresso",
        className,
      )}
    >
      {children}
    </div>
  );
}
