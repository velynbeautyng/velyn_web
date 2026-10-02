import Link from "next/link";
import type { Brand } from "@/lib/ops/types";
import { CONCERN_OPTIONS } from "@/lib/ops/constants";
import { cn } from "@/lib/utils";

type Active = { concern?: string; brand?: string };

function buildHref(base: Active, patch: Partial<Active>) {
  const merged = { ...base, ...patch };
  const params = new URLSearchParams();
  if (merged.concern) params.set("concern", merged.concern);
  if (merged.brand) params.set("brand", merged.brand);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-linen-mid pb-6">
      <h3 className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Server-rendered filter rail (SEO-friendly links). */
export function FilterRail({
  brands,
  active,
}: {
  brands: Brand[];
  active: Active;
}) {
  return (
    <aside className="flex flex-col gap-6">
      <Group title="Skin Concern">
        <ul className="flex flex-col gap-1.5">
          <li>
            <Link
              href={buildHref(active, { concern: undefined })}
              className={cn(
                "text-[0.85rem]",
                !active.concern
                  ? "font-semibold text-ink"
                  : "text-stone hover:text-ink",
              )}
            >
              All Concerns
            </Link>
          </li>
          {CONCERN_OPTIONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={buildHref(active, {
                  concern: active.concern === c.slug ? undefined : c.slug,
                })}
                className={cn(
                  "text-[0.85rem]",
                  active.concern === c.slug
                    ? "font-semibold text-gold-deep"
                    : "text-stone hover:text-ink",
                )}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Brand">
        <div className="relative">
          <ul className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1 [scrollbar-color:var(--color-gold-deep)_transparent] [scrollbar-width:thin]">
          <li>
            <Link
              href={buildHref(active, { brand: undefined })}
              className={cn(
                "text-[0.85rem]",
                !active.brand
                  ? "font-semibold text-ink"
                  : "text-stone hover:text-ink",
              )}
            >
              All Brands
            </Link>
          </li>
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={buildHref(active, {
                  brand: active.brand === b.slug ? undefined : b.slug,
                })}
                className={cn(
                  "flex items-center justify-between gap-2 text-[0.85rem]",
                  active.brand === b.slug
                    ? "font-semibold text-gold-deep"
                    : "text-stone hover:text-ink",
                )}
              >
                {b.name}
                {typeof b.productCount === "number" && (
                  <span className="text-[0.7rem] text-stone">{b.productCount}</span>
                )}
              </Link>
            </li>
          ))}
          </ul>
          {brands.length > 8 && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-linen to-transparent"
            />
          )}
        </div>
        {brands.length > 8 && (
          <p className="mt-2 flex items-center gap-1 text-[0.65rem] font-medium text-stone">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            Scroll to see all {brands.length} brands
          </p>
        )}
      </Group>
    </aside>
  );
}
