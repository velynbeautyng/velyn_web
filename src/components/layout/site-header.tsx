"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { cartCount, useCart } from "@/lib/cart-store";
import { NuveneLockup } from "@/components/brand/nuvene-logo";
import { IconBag, IconClose, IconMenu } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const count = mounted ? cartCount(items) : 0;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement */}
      <div className="bg-ink-surface">
        <div className="section flex items-center justify-between py-2.5">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-gold">
            <span aria-hidden>✦</span> Authentic · Sourced Directly from
            Manufacturers <span className="hidden sm:inline">· Nationwide Delivery</span>
          </p>
          <Link
            href="/wholesale"
            className="hidden text-[0.58rem] uppercase tracking-[0.12em] text-gold/60 underline-offset-4 hover:text-gold hover:underline sm:block"
          >
            Wholesale Inquiry
          </Link>
        </div>
      </div>

      {/* Nav */}
      <div
        className={cn(
          "border-b border-gold-pale bg-white transition-shadow duration-300",
          scrolled && "shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)]",
        )}
      >
        <div className="section flex items-center justify-between gap-4 py-3.5">
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
            <NuveneLockup className="h-8 w-auto sm:h-9" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "border-b-2 border-transparent px-3 py-2 text-[0.66rem] font-medium uppercase tracking-[0.06em] transition-colors",
                  isActive(item.href)
                    ? "border-gold text-ink"
                    : "text-stone hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* Visibility is controlled on the wrapper — putting `hidden` on the
                ButtonLink itself loses to its base `inline-flex`. */}
            <span className="hidden xl:inline-flex">
              <ButtonLink href="/wholesale" variant="outline" size="sm">
                Wholesale
              </ButtonLink>
            </span>
            <span className="hidden sm:inline-flex">
              <ButtonLink href="/shop" variant="ink" size="sm">
                Shop Now
              </ButtonLink>
            </span>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-gold-deep cursor-pointer"
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <IconBag />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.56rem] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink xl:hidden cursor-pointer"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 xl:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink-surface/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col bg-linen shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-gold-pale px-6 py-4">
            <NuveneLockup className="h-8 w-auto sm:h-9" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-ink cursor-pointer"
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-col px-2 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 font-serif text-lg transition-colors",
                  isActive(item.href)
                    ? "text-gold-deep"
                    : "text-ink hover:text-gold-deep",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 border-t border-gold-pale p-6">
            <ButtonLink href="/shop" variant="ink" size="md" className="w-full">
              Shop Authentic Skincare
            </ButtonLink>
            <ButtonLink href="/wholesale" variant="outline" size="md" className="w-full">
              Apply for Wholesale
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
