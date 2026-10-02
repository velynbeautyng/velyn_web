import { ButtonLink } from "@/components/ui/button";
import { VelynMark } from "@/components/brand/velyn-mark";

export default function NotFound() {
  return (
    <section className="section flex min-h-[60vh] items-center justify-center py-20">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <VelynMark className="h-14 w-auto opacity-30" tone="ink" />
        <p className="kicker">Error 404</p>
        <h1 className="display text-[clamp(2rem,5vw,3rem)] text-ink">
          This page has <em>drifted away</em>
        </h1>
        <p className="prose-body text-center">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back to something beautiful.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="ink" size="lg">
            Back Home
          </ButtonLink>
          <ButtonLink href="/shop" variant="outline" size="lg">
            Shop Skincare
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
