import "server-only";
import { getProductBySlug } from "./products";
import { getShippingConfig } from "./shipping";
import { computeShipping, deliveryAreaError } from "@/lib/shipping";

export type ClientCartItem = {
  id: string; // variation id
  slug: string;
  quantity: number;
};

export type ResolvedLine = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  variationName?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type ResolvedCart = {
  lines: ResolvedLine[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "NGN";
  /** Set when the destination needs a listed area (Abuja) and none matched. */
  areaError: string | null;
};

/**
 * Re-price the cart from the authoritative catalogue. Client-supplied prices
 * are ignored entirely (only the product id/slug/quantity are trusted), so a
 * tampered cart cannot change what is charged. Delivery is priced server-side
 * from the ops shipping config, the destination `state` and, for states priced
 * by area (Abuja), the customer's `area`.
 */
export async function resolveCart(
  items: ClientCartItem[],
  state?: string,
  area?: string,
): Promise<ResolvedCart> {
  const lines: ResolvedLine[] = [];

  for (const item of items) {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 0));
    if (!item.slug || qty < 1) continue;

    const product = await getProductBySlug(item.slug);
    if (!product) continue;

    const variation =
      product.variations.find((v) => v.id === item.id) ??
      product.variations[0];
    if (!variation || !variation.inStock) continue;

    const cappedQty = variation.qtyAvailable
      ? Math.min(qty, variation.qtyAvailable)
      : qty;

    lines.push({
      id: variation.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      variationName:
        variation.name !== "Default" ? variation.name : undefined,
      unitPrice: variation.price,
      quantity: cappedQty,
      lineTotal: variation.price * cappedQty,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const config = await getShippingConfig();
  const shipping = computeShipping(subtotal, state, config, area);

  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "NGN",
    areaError: state ? deliveryAreaError(state, area, config) : null,
  };
}
