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
import { VelynMark } from "@/components/brand/velyn-mark";
import { IconMinus, IconPlus, IconTrash } from "@/components/ui/icons";

const FREE_SHIPPING = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 50000,
);

export function CartView() {
  const items = useCart((s) => s.items);
  const subtotal = cartSubtotal(items);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  if (items.length === 0) {
    return (
      <div className="section section-y">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
          <VelynMark className="h-12 w-auto opacity-20" tone="espresso" />
          <h1 className="font-serif text-2xl text-espresso">
            Your cart is empty
          </h1>
          <p className="prose-body text-center">
            Discover authenticated skincare curated for your concerns.
          </p>
          <ButtonLink href="/shop" variant="espresso" size="lg">
            Shop Authentic Skincare
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="section section-y grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        {remaining > 0 ? (
          <p className="mb-5 border border-gold-pale bg-gold-faint px-4 py-2.5 text-[0.82rem] text-cocoa">
            You&apos;re {formatNaira(remaining)} away from{" "}
            <strong className="text-espresso">free delivery.</strong>
          </p>
        ) : (
          <p className="mb-5 border border-olive-mid/30 bg-olive-pale/40 px-4 py-2.5 text-[0.82rem] text-olive">
            You&apos;ve unlocked <strong>free delivery.</strong>
          </p>
        )}

        <ul className="divide-y divide-ivory-mid border-y border-ivory-mid">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </ul>
        <Link
          href="/shop"
          className="mt-6 inline-block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-dim hover:text-espresso"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Summary */}
      <aside className="h-fit border border-ivory-mid bg-ivory p-6 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <h2 className="font-serif text-xl text-espresso">Order Summary</h2>
        <dl className="mt-5 flex flex-col gap-2.5 text-[0.88rem]">
          <div className="flex justify-between">
            <dt className="text-mocha">Subtotal</dt>
            <dd className="text-espresso">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mocha">Delivery</dt>
            <dd className="text-espresso">
              {subtotal >= FREE_SHIPPING ? "Free" : "Calculated at checkout"}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-ivory-mid pt-4">
          <span className="text-sm uppercase tracking-[0.1em] text-mocha">
            Total
          </span>
          <Price
            amount={subtotal}
            className="font-serif text-2xl text-espresso"
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
        <p className="mt-3 text-center text-[0.7rem] text-mocha">
          Secure payment · 100% authentic products
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
        className="relative h-24 w-20 shrink-0 overflow-hidden border border-ivory-mid bg-white"
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
            <VelynMark className="h-6 w-auto opacity-20" tone="espresso" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold-dim">
              {item.brand}
            </p>
            <Link
              href={`/shop/${item.slug}`}
              className="font-serif text-[0.95rem] text-espresso hover:text-gold-dim"
            >
              {item.name}
            </Link>
            {item.variationName && (
              <p className="text-[0.75rem] text-mocha">{item.variationName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="h-fit text-mocha hover:text-espresso cursor-pointer"
            aria-label={`Remove ${item.name}`}
          >
            <IconTrash width={16} height={16} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-ivory-mid">
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-espresso hover:bg-ivory-mid cursor-pointer"
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
              className="flex h-8 w-8 items-center justify-center text-espresso hover:bg-ivory-mid cursor-pointer"
              aria-label="Increase quantity"
            >
              <IconPlus width={14} height={14} />
            </button>
          </div>
          <Price
            amount={item.price * item.quantity}
            className="font-serif text-base text-espresso"
          />
        </div>
      </div>
    </li>
  );
}
