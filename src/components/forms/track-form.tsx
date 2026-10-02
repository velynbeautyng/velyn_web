"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { IconCheck } from "@/components/ui/icons";

type Order = {
  reference: string;
  invoiceNo?: string;
  placedAt?: string;
  cancelled: boolean;
  deliveryMethod: "delivery" | "pickup";
  stage: number;
  stageLabel: string;
  trackingNote?: string | null;
  total: number;
  items: { name: string; quantity: number }[];
};

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; order: Order }
  | { kind: "not-found"; reference: string }
  | { kind: "manual"; reference: string }
  | { kind: "error"; message: string };

const DELIVERY_STAGES = ["Confirmed", "Preparing", "Shipped", "Delivered"];
const PICKUP_STAGES = ["Confirmed", "Preparing", "Ready for Pickup", "Collected"];

function stagesFor(method: "delivery" | "pickup"): string[] {
  return method === "pickup" ? PICKUP_STAGES : DELIVERY_STAGES;
}

const fieldClass =
  "w-full border border-linen-mid bg-white px-3.5 py-3 text-sm text-ink placeholder:text-stone/60 outline-none transition-colors focus:border-gold";
const labelClass =
  "mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone";

export function TrackForm() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ref = reference.trim();
    const em = email.trim();
    if (!ref || !em) return;
    setResult({ kind: "loading" });
    try {
      const res = await fetch(
        `/api/track?reference=${encodeURIComponent(ref)}&email=${encodeURIComponent(em)}`,
      );
      const data = await res.json();
      if (data.status === "ok") setResult({ kind: "found", order: data.order });
      else if (data.status === "not-found")
        setResult({ kind: "not-found", reference: ref });
      else if (data.status === "unconfigured")
        setResult({ kind: "manual", reference: ref });
      else
        setResult({
          kind: "error",
          message: data.error || "Something went wrong.",
        });
    } catch {
      setResult({
        kind: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="track-ref" className={labelClass}>
            Order Reference
          </label>
          <input
            id="track-ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. VB-1AB2C3-4D5E6F"
            className={fieldClass}
            required
          />
        </div>
        <div>
          <label htmlFor="track-email" className={labelClass}>
            Email used at checkout
          </label>
          <input
            id="track-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={fieldClass}
            required
          />
        </div>
        <Button
          type="submit"
          variant="ink"
          size="lg"
          disabled={result.kind === "loading"}
          className="w-full"
        >
          {result.kind === "loading" ? "Checking…" : "Track Order"}
        </Button>
      </form>

      {result.kind === "found" && <OrderResult order={result.order} />}
      {result.kind === "not-found" && (
        <Fallback
          title="We couldn't find that order"
          body="Double-check your reference and the email you used at checkout. If it still doesn't show, we're happy to look it up for you."
          reference={result.reference}
        />
      )}
      {result.kind === "manual" && (
        <Fallback
          title="Let's check that for you"
          body="Send us your reference on WhatsApp and we'll give you a real-time update."
          reference={result.reference}
        />
      )}
      {result.kind === "error" && (
        <p className="mt-5 text-sm text-red-500" role="alert">
          {result.message}
        </p>
      )}
    </div>
  );
}

function OrderResult({ order }: { order: Order }) {
  const placed = order.placedAt
    ? new Date(order.placedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const stages = stagesFor(order.deliveryMethod);
  const statusLabel = order.cancelled
    ? "Cancelled"
    : (stages[order.stage - 1] ?? order.stageLabel);

  return (
    <div className="mt-8 border-t border-linen-mid pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone">
            Order {order.reference}
          </p>
          {placed && (
            <p className="mt-0.5 text-[0.8rem] text-stone">Placed {placed}</p>
          )}
        </div>
        <span
          className={cn(
            "px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em]",
            order.cancelled
              ? "bg-red-50 text-red-600"
              : "bg-sage-pale text-sage-deep",
          )}
        >
          {statusLabel}
        </span>
      </div>

      {order.cancelled ? (
        <p className="mt-6 border border-red-100 bg-red-50 px-4 py-3 text-[0.85rem] text-red-600">
          This order was cancelled. If you believe this is a mistake, please
          contact us.
        </p>
      ) : (
        <Stepper stage={order.stage} stages={stages} />
      )}

      {order.trackingNote && !order.cancelled && (
        <p className="mt-6 border border-gold-pale bg-linen-soft px-4 py-3 text-[0.85rem] text-stone">
          <span className="font-semibold text-ink">Update: </span>
          {order.trackingNote}
        </p>
      )}

      {order.items.length > 0 && (
        <div className="mt-7">
          <p className={labelClass}>Items</p>
          <ul className="flex flex-col gap-1.5 border-y border-linen-mid py-3">
            {order.items.map((it, i) => (
              <li
                key={i}
                className="flex justify-between text-[0.85rem] text-ink"
              >
                <span>
                  {it.quantity}× {it.name}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between text-sm">
            <span className="uppercase tracking-[0.1em] text-stone">Total</span>
            <span className="font-serif text-ink">
              {formatNaira(order.total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({ stage, stages }: { stage: number; stages: string[] }) {
  return (
    <ol className="mt-7 grid grid-cols-4 gap-1">
      {stages.map((label, i) => {
        const stepNo = i + 1;
        const done = stepNo < stage;
        const current = stepNo === stage;
        return (
          <li key={label} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === 0
                    ? "bg-transparent"
                    : stepNo <= stage
                      ? "bg-gold"
                      : "bg-linen-mid",
                )}
              />
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  done && "border-sage-deep bg-sage-deep text-white",
                  current && "border-gold bg-gold text-ink",
                  !done &&
                    !current &&
                    "border-linen-mid bg-white text-stone",
                )}
              >
                {done ? (
                  <IconCheck width={14} height={14} strokeWidth={2.4} />
                ) : (
                  <span className="text-[0.7rem] font-bold">{stepNo}</span>
                )}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === stages.length - 1
                    ? "bg-transparent"
                    : stepNo < stage
                      ? "bg-gold"
                      : "bg-linen-mid",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
                current
                  ? "text-ink"
                  : done
                    ? "text-sage-deep"
                    : "text-stone/50",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Fallback({
  title,
  body,
  reference,
}: {
  title: string;
  body: string;
  reference: string;
}) {
  const message = reference
    ? `Hi Nuvene, I'd like an update on my order ${reference}.`
    : "Hi Nuvene, I'd like an update on my order.";
  return (
    <div className="mt-7 border-t border-linen-mid pt-6 text-center">
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[0.85rem] leading-relaxed text-stone">
        {body}
      </p>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-linen"
      >
        Ask on WhatsApp
      </a>
    </div>
  );
}
