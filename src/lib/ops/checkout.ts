import "server-only";
import { getProductBySlug } from "./products";

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
};

const FREE_SHIPPING_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 50000,
);
const FLAT_SHIPPING = Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 3500);

export function computeShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
}

/**
 * Re-price the cart from the authoritative catalogue. Client-supplied prices
 * are ignored entirely — only the product id/slug/quantity are trusted — so a
 * tampered cart cannot change what is charged.
 */
export async function resolveCart(
  items: ClientCartItem[],
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
  const shipping = computeShipping(subtotal);

  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "NGN",
  };
}
