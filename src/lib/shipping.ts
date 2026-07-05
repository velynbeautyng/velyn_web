/**
 * Shipping model shared by server (authoritative pricing) and client (live
 * checkout display). Pure — no server-only imports — so both can use it.
 *
 * Config comes from ops (GET /api/storefront/shipping); the env values are the
 * fallback defaults when ops is unreachable or unconfigured.
 */

export type ShippingConfig = {
  /** When false, delivery is free everywhere (e.g. a promotion). */
  isActive: boolean;
  /** Fee for any state without a specific zone rate. */
  defaultFee: number;
  /** Subtotal at/above which delivery is free. null = never free. */
  freeThreshold: number | null;
  /** Per-state overrides, keyed by the exact checkout state name. */
  zones: Record<string, number>;
};

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  isActive: true,
  defaultFee: Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 3500),
  freeThreshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 50000),
  zones: {},
};

/** Delivery fee for a subtotal + destination state under the given config. */
export function computeShipping(
  subtotal: number,
  state: string | undefined,
  config: ShippingConfig,
): number {
  if (subtotal <= 0) return 0;
  if (!config.isActive) return 0;
  if (config.freeThreshold != null && subtotal >= config.freeThreshold) return 0;
  if (state && Object.prototype.hasOwnProperty.call(config.zones, state)) {
    return config.zones[state];
  }
  return config.defaultFee;
}
