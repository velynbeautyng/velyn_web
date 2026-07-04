import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout/checkout-success";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="section section-y">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-16 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        </div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}
