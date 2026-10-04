"use client";

import Image from "next/image";
import Link from "next/link";
import {
  cartSubtotal,
  useCart,
  type CartItem,
} from "@/lib/cart-store";
import { formatNaira } from "@/lib/utils";
import { Price } from "@/components/ui/price";
import { ButtonLink } from "@/components/ui/button";
import { NuveneIcon } from "@/components/brand/nuvene-logo";
import { IconMinus, IconPlus, IconTrash } from "@/components/ui/icons";
import { useShippingConfig } from "@/lib/use-shipping-config";

export function CartView() {
  const items = useCart((s) => s.items);
  const subtotal = cartSubtotal(items);
  // Free delivery is an ops setting; with no threshold set there is nothing to promise.
  const { isActive, freeThreshold } = useShippingConfig();
  const freeDelivery = !isActive || (freeThreshold != null && subtotal >= freeThreshold);
  const remaining = freeThreshold != null ? Math.max(0, freeThreshold - subtotal) : 0;

  if (items.length === 0) {
    return (
      <div className="section section-y">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
          <NuveneIcon className="h-12 w-auto opacity-20 text-ink" />
          <h1 className="font-serif text-2xl text-ink">
            Your cart is empty
          </h1>
          <p className="prose-body text-center">
            Find original skincare matched to your concern.
          </p>
          <ButtonLink href="/shop" variant="ink" size="lg">
            Shop by concern
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="section section-y grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        {isActive && freeThreshold != null && remaining > 0 && (
          <p className="mb-5 border border-gold-pale bg-linen-soft px-4 py-2.5 text-[0.82rem] text-stone">
            You&apos;re {formatNaira(remaining)} away from{" "}
            <strong className="text-ink">free delivery.</strong>
          </p>
        )}
        {freeDelivery && (
          <p className="mb-5 border border-sage-mid/30 bg-sage-pale/40 px-4 py-2.5 text-[0.82rem] text-sage-deep">
            Your order ships with <strong>free delivery.</strong>
          </p>
        )}

        <ul className="divide-y divide-linen-mid border-y border-linen-mid">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </ul>
        <Link
          href="/shop"
          className="mt-6 inline-block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:text-ink"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Summary */}
      <aside className="h-fit border border-linen-mid bg-linen p-6 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <h2 className="font-serif text-xl text-ink">Order summary</h2>
        <dl className="mt-5 flex flex-col gap-2.5 text-[0.88rem]">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd className="text-ink">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Delivery</dt>
            <dd className="text-ink">
              {freeDelivery ? "Free" : "Calculated at checkout"}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-linen-mid pt-4">
          <span className="text-sm uppercase tracking-[0.1em] text-stone">
            Total
          </span>
          <Price
            amount={subtotal}
            className="font-serif text-2xl text-ink"
          />
        </div>
        <ButtonLink
          href="/checkout"
          variant="gold"
          size="lg"
          className="mt-5 w-full"
        >
          Proceed to Checkout
        </ButtonLink>
        <p className="mt-3 text-center text-[0.7rem] text-stone">
          Secure payment with Paystack. Replace or refund on confirmed counterfeits.
        </p>
      </aside>
    </div>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/shop/${item.slug}`}
        className="relative h-24 w-20 shrink-0 overflow-hidden border border-linen-mid bg-white"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain p-1.5"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <NuveneIcon className="h-6 w-auto opacity-20 text-ink" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold-deep">
              {item.brand}
            </p>
            <Link
              href={`/shop/${item.slug}`}
              className="font-serif text-[0.95rem] text-ink hover:text-gold-deep"
            >
              {item.name}
            </Link>
            {item.variationName && (
              <p className="text-[0.75rem] text-stone">{item.variationName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="-m-3 flex h-fit shrink-0 cursor-pointer p-3 text-stone hover:text-ink"
            aria-label={`Remove ${item.name}`}
          >
            <IconTrash width={16} height={16} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-linen-mid">
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-ink hover:bg-linen-mid cursor-pointer"
              aria-label="Decrease quantity"
            >
              <IconMinus width={14} height={14} />
            </button>
            <span className="w-9 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-ink hover:bg-linen-mid cursor-pointer"
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
