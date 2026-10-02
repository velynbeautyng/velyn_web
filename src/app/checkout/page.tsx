import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        kicker="Checkout"
        title={<>Secure checkout</>}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
          { name: "Checkout", href: "/checkout" },
        ]}
      />
      <CheckoutView />
    </>
  );
}
