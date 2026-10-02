import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { LOGO_HORIZONTAL, LOGO_ICON, LOGO_STACKED } from "./nuvene-logo-paths";

type Tone = "brand" | "ink" | "white" | "linen";

const TONES: Record<Tone, CSSProperties> = {
  brand: { "--logo-mark": "#708E74", "--logo-word": "#000000" } as CSSProperties,
  ink: { "--logo-mark": "#000000", "--logo-word": "#000000" } as CSSProperties,
  white: { "--logo-mark": "#FFFFFF", "--logo-word": "#FFFFFF" } as CSSProperties,
  linen: { "--logo-mark": "#E1DAC6", "--logo-word": "#E1DAC6" } as CSSProperties,
};

// The path markup is generated at build time from the client's own logo files
// (scripts/build-logos.mjs), so injecting it carries no user input.
function Svg({
  logo,
  className,
  style,
  title,
}: {
  logo: { viewBox: string; body: string };
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <svg
      viewBox={logo.viewBox}
      className={cn("block", className)}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: logo.body }}
    />
  );
}

/** The NB monogram. Colour comes from `currentColor`; decorative unless `title` is set. */
export function NuveneIcon({ className, title }: { className?: string; title?: string }) {
  return <Svg logo={LOGO_ICON} className={cn("h-8 w-auto", className)} title={title} />;
}

/** Horizontal lockup for headers and narrow spaces. */
export function NuveneLockup({ className, tone = "brand" }: { className?: string; tone?: Tone }) {
  return (
    <Svg
      logo={LOGO_HORIZONTAL}
      className={cn("h-8 w-auto", className)}
      style={TONES[tone]}
      title="Nuvene Beauty"
    />
  );
}

/** Stacked primary logo for footers and prominent placements. */
export function NuveneStacked({ className, tone = "brand" }: { className?: string; tone?: Tone }) {
  return (
    <Svg
      logo={LOGO_STACKED}
      className={cn("h-16 w-auto", className)}
      style={TONES[tone]}
      title="Nuvene Beauty"
    />
  );
}
