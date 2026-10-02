import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const items: (number | "…")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push("…");
    items.push(p);
    prev = p;
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      {page > 1 && (
        <Link
          href={makeHref(page - 1)}
          className="flex h-9 items-center border border-linen-mid bg-white px-3 text-xs uppercase tracking-[0.1em] text-ink hover:border-gold"
          scroll={false}
        >
          Prev
        </Link>
      )}
      {items.map((it, i) =>
        it === "…" ? (
          <span key={`e${i}`} className="px-2 text-stone">
            …
          </span>
        ) : (
          <Link
            key={it}
            href={makeHref(it)}
            aria-current={it === page ? "page" : undefined}
            scroll={false}
            className={cn(
              "flex h-9 w-9 items-center justify-center border text-xs tabular-nums transition-colors",
              it === page
                ? "border-ink bg-ink text-linen"
                : "border-linen-mid bg-white text-ink hover:border-gold",
            )}
          >
            {it}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          href={makeHref(page + 1)}
          className="flex h-9 items-center border border-linen-mid bg-white px-3 text-xs uppercase tracking-[0.1em] text-ink hover:border-gold"
          scroll={false}
        >
          Next
        </Link>
      )}
    </nav>
  );
}
