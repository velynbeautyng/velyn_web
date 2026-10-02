"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  cartSubtotal,
  useCart,
  type CartItem,
} from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/price";
import { IconClose, IconMinus, IconPlus, IconTrash } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";
import { NuveneIcon } from "@/components/brand/nuvene-logo";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const subtotal = cartSubtotal(items);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70]",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink-surface/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-[min(92vw,26rem)] flex-col bg-linen shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-gold-pale px-6 py-4">
          <h2 className="font-serif text-xl text-ink">
            Your Cart{" "}
            <span className="text-sm text-stone">
              ({items.reduce((n, i) => n + i.quantity, 0)})
            </span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="flex h-10 w-10 items-center justify-center text-ink cursor-pointer"
            aria-label="Close cart"
          >
            <IconClose />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <NuveneIcon className="h-10 w-auto opacity-30 text-ink" />
            <p className="prose-body text-stone">Your cart is empty.</p>
            <ButtonLink href="/shop" variant="ink" size="md" onClick={close}>
              Browse Products
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gold-pale overflow-y-auto px-6">
              {items.map((item) => (
                <CartLine key={item.id} item={item} />
              ))}
            </ul>
            <footer className="border-t border-gold-pale px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.14em] text-stone">
                  Subtotal
                </span>
                <Price
                  amount={subtotal}
                  className="font-serif text-2xl text-ink"
                />
              </div>
              <p className="mb-4 text-xs text-stone">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <ButtonLink
                href="/checkout"
                variant="gold"
                size="lg"
                className="w-full"
                onClick={close}
              >
                Proceed to Checkout
              </ButtonLink>
              <Link
                href="/shop"
                onClick={close}
                className="mt-3 block text-center text-xs uppercase tracking-[0.12em] text-stone hover:text-ink"
              >
                Continue Shopping
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  return (
    <li className="flex gap-4 py-4">
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden border border-linen-mid bg-white">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-contain p-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <NuveneIcon className="h-5 w-auto opacity-20 text-ink" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold-deep">
              {item.brand}
            </p>
            <p className="font-serif text-sm leading-snug text-ink">
              {item.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="h-fit text-stone hover:text-ink cursor-pointer"
            aria-label={`Remove ${item.name}`}
          >
            <IconTrash width={16} height={16} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border border-linen-mid">
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-ink hover:bg-linen-mid cursor-pointer"
              aria-label="Decrease quantity"
            >
              <IconMinus width={14} height={14} />
            </button>
            <span className="w-8 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-ink hover:bg-linen-mid cursor-pointer"
              aria-label="Increase quantity"
            >
              <IconPlus width={14} height={14} />
            </button>
          </div>
          <Price
            amount={item.price * item.quantity}
            className="font-serif text-base text-ink"
          />
        </div>
      </div>
    </li>
  );
}
