import { cn } from "@/lib/utils";
import { VELYN_LOCKUP_SVG } from "./velyn-lockup-svg";

/**
 * The Velyn "V" chalice-and-droplet icon, redrawn from the official brand SVG.
 * `tone` controls the fill so it reads on any surface.
 */
export function VelynMark({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "white" | "espresso";
}) {
  const fill =
    tone === "white"
      ? "#F7F4EF"
      : tone === "espresso"
        ? "#2C1A0E"
        : "#BD9468";

  return (
    <svg
      viewBox="0 0 302.62 242.88"
      className={cn("block", className)}
      role="img"
      aria-label="Velyn"
      fill={fill}
    >
      <path d="M162.12,90.11c29,9.83,11.41,55.69-17,45.87-.66-.14-1.39-.7-.65-1.31,15.31-8.5,24.15-27.39,16.3-43.91-.25-.89.69-.94,1.31-.65Z" />
      <path d="M289.36,0H177A13.25,13.25,0,0,0,164,15.5a118.54,118.54,0,0,0,4.48,17.27c4.16,14.45,6.38,14,13.56,34.17,7,19.79,10.54,29.92,9.4,41.8-.89,22.37-14.6,39.55-36.93,42.13-.5,0-1,0-1.58,0s-1.08,0-1.57,0c-22.37-2.58-36.08-19.75-37-42.13-1.11-11.88,2.39-22,9.44-41.8,7.17-20.16,9.36-19.72,13.56-34.17a119.74,119.74,0,0,0,4.47-17.27A13.25,13.25,0,0,0,128.78,0H13.25A13.24,13.24,0,0,0,1.79,19.85l128.78,223h41.48l128.77-223A13.23,13.23,0,0,0,289.36,0Z" />
    </svg>
  );
}

/**
 * Full lockup used in the header/nav, rendered from the official secondary
 * logo SVG. The VELYN wordmark uses the site serif (EB Garamond) via the
 * inlined SVG's font-family so it renders consistently on every device.
 */
export function VelynLockup({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Velyn Beauty & Essentials"
      className={cn(
        "inline-block [&>svg]:block [&>svg]:h-7 [&>svg]:w-auto sm:[&>svg]:h-8",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: VELYN_LOCKUP_SVG }}
    />
  );
}
