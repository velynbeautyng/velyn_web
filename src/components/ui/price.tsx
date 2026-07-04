import { nairaAmount } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Renders a Naira price. The ₦ symbol is drawn in a font stack that has the
 * correct double-bar glyph (many serif fonts, incl. EB Garamond, draw it with a
 * single bar). The numeric part inherits the surrounding font so prices still
 * look native in serif headings, sans body, etc.
 */
export function Price({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <span className={cn("tabular-nums", className)}>
      <span className="naira-symbol">₦</span>
      {nairaAmount(amount)}
    </span>
  );
}
