"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { formatNaira } from "@/lib/utils";
import {
  computeShipping,
  DEFAULT_SHIPPING_CONFIG,
  type ShippingConfig,
} from "@/lib/shipping";
import { site } from "@/lib/site";
import { Price } from "@/components/ui/price";
import { NIGERIAN_STATES } from "@/lib/ng-states";
import { Button, ButtonLink } from "@/components/ui/button";
import { VelynMark } from "@/components/brand/velyn-mark";
import { IconShield } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Method = "delivery" | "pickup";

const field =
  "w-full border border-ivory-mid bg-white px-3.5 py-2.5 text-sm text-espresso placeholder:text-mocha/60 outline-none transition-colors focus:border-gold";
const label =
  "mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em] text-mocha";

export function CheckoutView() {
  const items = useCart((s) => s.items);
  const subtotal = cartSubtotal(items);

  const [config, setConfig] = useState<ShippingConfig>(DEFAULT_SHIPPING_CONFIG);
  const [method, setMethod] = useState<Method>("delivery");
  const [state, setState] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");

  // Live delivery pricing from the ops shipping config + selected state.
  useEffect(() => {
    let alive = true;
    fetch("/api/shipping")
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => {
        if (alive && c) setConfig(c as ShippingConfig);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const shipping =
    method === "pickup" ? 0 : computeShipping(subtotal, state, config);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="section section-y">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
          <VelynMark className="h-12 w-auto opacity-20" tone="espresso" />
          <h1 className="font-serif text-2xl text-espresso">
            Nothing to check out
          </h1>
          <ButtonLink href="/shop" variant="espresso" size="lg">
            Return to Shop
          </ButtonLink>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const fd = new FormData(e.currentTarget);
    const customer = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: fd.get("address") ?? "",
      city: fd.get("city") ?? "",
      state: fd.get("state") ?? "",
      notes: fd.get("notes"),
    };

    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            slug: i.slug,
            quantity: i.quantity,
          })),
          customer,
          deliveryMethod: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed.");

      if (data.mode === "paystack" && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      if (data.mode === "manual" && data.whatsapp) {
        // Payment gateway not live yet, hand off to WhatsApp to finalise.
        window.location.href = data.whatsapp;
        return;
      }
      throw new Error("Unexpected checkout response.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setStatus("idle");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="section section-y grid gap-10 lg:grid-cols-[1fr_22rem]"
    >
      {/* Delivery details */}
      <div>
        <h2 className="font-serif text-2xl text-espresso">Your Details</h2>

        {/* Delivery method */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <MethodCard
            active={method === "delivery"}
            onClick={() => setMethod("delivery")}
            title="Home Delivery"
            subtitle="Delivered to your address"
            icon={
              <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            }
          />
          <MethodCard
            active={method === "pickup"}
            onClick={() => setMethod("pickup")}
            title="Self Pickup"
            subtitle="Collect from our store · Free"
            icon={
              <path d="M3 21l18 0M5 21v-14l8 -4v18M19 21v-10l-6 -4M9 9l0 .01M9 12l0 .01M9 15l0 .01M9 18l0 .01" />
            }
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="co-name" className={label}>Full Name</label>
            <input id="co-name" name="name" required maxLength={50} autoComplete="name" placeholder="Your full name" className={field} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="co-email" className={label}>Email</label>
              <input id="co-email" name="email" type="email" required maxLength={120} autoComplete="email" placeholder="your@email.com" className={field} />
            </div>
            <div>
              <label htmlFor="co-phone" className={label}>Phone / WhatsApp</label>
              <input id="co-phone" name="phone" type="tel" required maxLength={20} autoComplete="tel" placeholder="+234 ..." className={field} />
            </div>
          </div>

          {method === "delivery" ? (
            <>
              <div>
                <label htmlFor="co-address" className={label}>Delivery Address</label>
                <input id="co-address" name="address" required maxLength={160} autoComplete="street-address" placeholder="House number, street, area" className={field} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-city" className={label}>City / Town</label>
                  <input id="co-city" name="city" required maxLength={60} placeholder="e.g. Utako" className={field} />
                </div>
                <div>
                  <label htmlFor="co-state" className={label}>State</label>
                  <select id="co-state" name="state" required value={state} onChange={(e) => setState(e.target.value)} className={`${field} cursor-pointer appearance-none`}>
                    <option value="" disabled>Select state</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="border border-gold-pale bg-gold-faint p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-dim">
                Pick up from our store
              </p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-espresso">
                {site.contact.address.line1}, {site.contact.address.line2},{" "}
                {site.contact.address.city}.
              </p>
              <p className="mt-3 text-[0.83rem] leading-relaxed text-cocoa">
                We&apos;ll call you when your order is packed and ready to
                collect. For anything urgent, reach support on{" "}
                <a href={`tel:${site.contact.phoneMtn}`} className="font-semibold text-espresso hover:text-gold-dim">
                  {site.contact.phoneMtn}
                </a>{" "}
                or{" "}
                <a href={`tel:${site.contact.phoneAirtel}`} className="font-semibold text-espresso hover:text-gold-dim">
                  {site.contact.phoneAirtel}
                </a>
                . No delivery fee is charged for pickup.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="co-notes" className={label}>
              {method === "pickup" ? "Order Notes (optional)" : "Delivery Notes (optional)"}
            </label>
            <textarea id="co-notes" name="notes" rows={2} maxLength={300} placeholder={method === "pickup" ? "Anything we should know" : "Landmark, preferred time, etc."} className={`${field} resize-y`} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <aside className="h-fit border border-ivory-mid bg-ivory p-6 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <h2 className="font-serif text-xl text-espresso">Your Order</h2>
        <ul className="mt-4 flex flex-col gap-3 border-b border-ivory-mid pb-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden border border-ivory-mid bg-white">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <VelynMark className="h-4 w-auto opacity-20" tone="espresso" />
                  </div>
                )}
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-espresso px-1 text-[0.55rem] font-bold text-ivory">
                  {item.quantity}
                </span>
              </div>
              <div className="flex flex-1 justify-between gap-2">
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-gold-dim">
                    {item.brand}
                  </p>
                  <p className="font-serif text-[0.82rem] leading-tight text-espresso">
                    {item.name}
                  </p>
                </div>
                <span className="whitespace-nowrap text-[0.82rem] text-espresso">
                  {formatNaira(item.price * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-2 text-[0.85rem]">
          <div className="flex justify-between">
            <dt className="text-mocha">Subtotal</dt>
            <dd className="text-espresso">{formatNaira(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mocha">
              {method === "pickup" ? "Pickup" : "Delivery"}
            </dt>
            <dd className="text-espresso">
              {method === "pickup"
                ? "Free"
                : shipping === 0
                  ? "Free"
                  : formatNaira(shipping)}
            </dd>
          </div>
        </dl>
        <div className="mt-3 flex justify-between border-t border-ivory-mid pt-3">
          <span className="text-sm uppercase tracking-[0.1em] text-mocha">Total</span>
          <Price
            amount={total}
            className="font-serif text-2xl text-espresso"
          />
        </div>

        {error && (
          <p className="mt-4 text-[0.8rem] text-red-500" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={status === "submitting"}
          className="mt-5 w-full"
        >
          {status === "submitting" ? "Processing…" : "Pay Securely"}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-mocha">
          <IconShield width={13} height={13} /> Secured payment · Cards &amp; transfers
        </p>
        <Link
          href="/cart"
          className="mt-3 block text-center text-[0.7rem] uppercase tracking-[0.1em] text-mocha hover:text-espresso"
        >
          ← Back to Cart
        </Link>
      </aside>
    </form>
  );
}

function MethodCard({
  active,
  onClick,
  title,
  subtitle,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-start gap-1.5 border p-4 text-left transition-colors cursor-pointer",
        active
          ? "border-espresso bg-espresso text-ivory"
          : "border-ivory-mid bg-white text-espresso hover:border-gold",
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "text-gold" : "text-gold-dim"}
      >
        {icon}
      </svg>
      <span className="text-[0.9rem] font-semibold leading-tight">{title}</span>
      <span
        className={cn(
          "text-[0.7rem] leading-tight",
          active ? "text-ivory/60" : "text-mocha",
        )}
      >
        {subtitle}
      </span>
    </button>
  );
}
