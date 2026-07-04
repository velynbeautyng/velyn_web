"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatNaira } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { VelynMark } from "@/components/brand/velyn-mark";
import { IconCheck } from "@/components/ui/icons";

type State =
  | { kind: "verifying" }
  | { kind: "success"; reference: string; amount?: number }
  | { kind: "failed"; message: string }
  | { kind: "pending"; reference: string };

export function CheckoutSuccess() {
  const params = useSearchParams();
  const reference = params.get("reference") || params.get("trxref") || "";
  const clear = useCart((s) => s.clear);
  const [state, setState] = useState<State>({ kind: "verifying" });
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!reference) {
      setState({ kind: "failed", message: "No payment reference was found." });
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/verify?reference=${encodeURIComponent(reference)}`,
        );
        const data = await res.json();
        if (data.status === "success") {
          clear();
          setState({
            kind: "success",
            reference: data.reference,
            amount: data.amount,
          });
        } else if (data.status === "unconfigured") {
          // Gateway not live — treat the returned reference as a placed order.
          clear();
          setState({ kind: "success", reference });
        } else {
          setState({
            kind: "pending",
            reference: data.reference || reference,
          });
        }
      } catch {
        setState({
          kind: "failed",
          message: "We couldn't confirm your payment automatically.",
        });
      }
    })();
  }, [reference, clear]);

  if (state.kind === "verifying") {
    return (
      <Shell>
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <h1 className="font-serif text-2xl text-espresso">
          Confirming your payment…
        </h1>
        <p className="prose-body text-center">This only takes a moment.</p>
      </Shell>
    );
  }

  if (state.kind === "success") {
    return (
      <Shell>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive text-white">
          <IconCheck width={30} height={30} strokeWidth={2.2} />
        </div>
        <h1 className="font-serif text-3xl text-espresso">Thank you!</h1>
        <p className="prose-body text-center">
          Your order has been placed. A confirmation is on its way, and our team
          will be in touch about delivery.
        </p>
        <div className="flex flex-col items-center gap-1 border border-ivory-mid bg-ivory px-6 py-4">
          <span className="text-[0.62rem] uppercase tracking-[0.14em] text-mocha">
            Order Reference
          </span>
          <span className="font-serif text-lg text-espresso">
            {state.reference}
          </span>
          {typeof state.amount === "number" && (
            <span className="text-[0.8rem] text-cocoa">
              {formatNaira(state.amount)} paid
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop" variant="espresso" size="lg">
            Continue Shopping
          </ButtonLink>
          <ButtonLink href="/track" variant="outline" size="lg">
            Track Order
          </ButtonLink>
        </div>
      </Shell>
    );
  }

  if (state.kind === "pending") {
    return (
      <Shell>
        <VelynMark className="h-12 w-auto opacity-30" tone="espresso" />
        <h1 className="font-serif text-2xl text-espresso">
          Payment not completed
        </h1>
        <p className="prose-body text-center">
          Your payment for reference{" "}
          <strong className="text-espresso">{state.reference}</strong> wasn&apos;t
          completed. If you were charged, contact us and we&apos;ll sort it out.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/checkout" variant="espresso" size="lg">
            Try Again
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline" size="lg">
            Contact Support
          </ButtonLink>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <VelynMark className="h-12 w-auto opacity-30" tone="espresso" />
      <h1 className="font-serif text-2xl text-espresso">
        Something went wrong
      </h1>
      <p className="prose-body text-center">{state.message}</p>
      <ButtonLink href="/contact" variant="espresso" size="lg">
        Contact Support
      </ButtonLink>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="section section-y">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-12 text-center">
        {children}
      </div>
    </div>
  );
}
