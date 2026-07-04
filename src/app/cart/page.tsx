import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        kicker="Cart"
        title={<>Your Shopping Cart</>}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
        ]}
      />
      <CartView />
    </>
  );
}
