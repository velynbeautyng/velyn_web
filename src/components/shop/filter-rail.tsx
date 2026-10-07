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

      <BrandFilter brands={brands} active={active} />
    </aside>
  );
}

/**
 * Brand list behind a "Brand" toggle, closed until the customer opens it (or
 * while a brand is selected, so the active choice stays visible). A native
 * <details> keeps it keyboard and screen-reader friendly with no script.
 */
export function BrandFilter({ brands, active }: { brands: Brand[]; active: Active }) {
  const selected = brands.find((b) => b.slug === active.brand);
  return (
    <details className="group border-b border-linen-mid pb-6" open={Boolean(selected)}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
          Brand
          <span className="ml-2 font-medium normal-case tracking-normal text-stone">
            {selected ? selected.name : `${brands.length} brands`}
          </span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="shrink-0 text-ink transition-transform duration-200 group-open:rotate-180"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <ul className="mt-3 flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1 [scrollbar-color:var(--color-gold-deep)_transparent] [scrollbar-width:thin]">
        <li>
          <Link
            href={buildHref(active, { brand: undefined })}
            className={cn(
              "text-[0.85rem]",
              !active.brand ? "font-semibold text-ink" : "text-stone hover:text-ink",
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
    </details>
  );
}
