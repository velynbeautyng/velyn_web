"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconClose, IconSearch } from "@/components/ui/icons";

/**
 * Header search: an icon that opens a search bar under the header on every
 * page. Submitting goes to the shop's search results (/shop?q=...).
 */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const input = useRef<HTMLInputElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapper}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 cursor-pointer items-center justify-center text-ink transition-colors hover:text-gold-deep"
        aria-label={open ? "Close search" : "Search products"}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {open ? <IconClose /> : <IconSearch />}
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full border-b border-linen-mid bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
        >
          <form action="/shop" method="get" role="search" className="section flex gap-2 py-4">
            <label htmlFor={`${panelId}-q`} className="sr-only">
              Search products
            </label>
            <input
              ref={input}
              id={`${panelId}-q`}
              type="search"
              name="q"
              required
              placeholder="Search products, brands or concerns"
              className="h-12 flex-1 border border-linen-mid bg-white px-3.5 text-base text-ink placeholder:text-stone outline-none transition-colors focus:border-gold sm:text-sm"
            />
            <button
              type="submit"
              className="h-12 shrink-0 cursor-pointer bg-ink px-5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-linen transition-colors hover:bg-ink-lift"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
