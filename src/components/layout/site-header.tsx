"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { cartCount, useCart } from "@/lib/cart-store";
import { NuveneLockup } from "@/components/brand/nuvene-logo";
import { IconBag, IconClose, IconMenu } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";

const noopSubscribe = () => () => {};

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  // The cart lives in localStorage, so its count is only real after hydration.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);

  // Close the drawer when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = drawer.current;
    const trigger = menuButton.current;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  const count = hydrated ? cartCount(items) : 0;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-sage-dusk">
        <div className="section flex items-center justify-between gap-4 py-2.5">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white">
            {site.positioning}
            <span className="hidden sm:inline"> Delivery across Nigeria.</span>
          </p>
          <Link
            href="/authenticity"
            className="hidden shrink-0 text-[0.6rem] uppercase tracking-[0.12em] text-white underline-offset-4 hover:underline sm:block"
          >
            Our sourcing promise
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "border-b border-gold-pale bg-white transition-shadow duration-300",
          scrolled && "shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]",
        )}
      >
        <div className="section flex items-center justify-between gap-4 py-3.5">
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
            <NuveneLockup className="h-8 w-auto sm:h-9" />
          </Link>

          <nav className="hidden items-center xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap border-b-2 border-transparent px-2.5 py-2 text-[0.66rem] font-medium uppercase tracking-[0.06em] transition-colors 2xl:px-3",
                  isActive(item.href) ? "border-gold text-ink" : "text-stone hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* Visibility sits on the wrapper: `hidden` on the ButtonLink itself loses to its base `inline-flex`. */}
            <span className="hidden 2xl:inline-flex">
              <ButtonLink href="/wholesale" variant="outline" size="sm">
                Wholesale
              </ButtonLink>
            </span>
            <span className="hidden sm:inline-flex">
              <ButtonLink href="/shop" variant="ink" size="sm">
                Shop by concern
              </ButtonLink>
            </span>

            <button
              type="button"
              onClick={openCart}
              className="relative flex h-11 w-11 cursor-pointer items-center justify-center text-ink transition-colors hover:text-gold-deep"
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            >
              <IconBag />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.56rem] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>

            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center text-ink xl:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 xl:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          ref={drawer}
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col bg-linen shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-gold-pale px-6 py-4">
            <NuveneLockup className="h-7 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center text-ink"
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-col overflow-y-auto px-2 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "px-4 py-3.5 font-serif text-lg transition-colors",
                  isActive(item.href) ? "text-gold-deep" : "text-ink hover:text-gold-deep",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 border-t border-gold-pale p-6">
            <ButtonLink href="/shop" variant="ink" size="md" className="w-full">
              Shop by concern
            </ButtonLink>
            <ButtonLink href="/wholesale" variant="outline" size="md" className="w-full">
              Apply for wholesale
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
