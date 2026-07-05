import "server-only";
import { opsFetch } from "./client";
import { isOpsConfigured } from "./config";
import { DEFAULT_SHIPPING_CONFIG, type ShippingConfig } from "@/lib/shipping";

type RawShipping = {
  is_active?: boolean;
  default_fee?: number;
  free_shipping_threshold?: number | null;
  zones?: Record<string, number>;
};

/**
 * Load the ops-managed shipping config (default fee, free threshold, per-state
 * rates). Falls back to the env defaults if ops is unconfigured or unreachable
 * so checkout never breaks.
 */
export async function getShippingConfig(): Promise<ShippingConfig> {
  if (!isOpsConfigured()) return DEFAULT_SHIPPING_CONFIG;
  try {
    const res = await opsFetch<{ data: RawShipping }>("shipping", {
      revalidate: 300,
    });
    const d = res.data ?? {};
    return {
      isActive: d.is_active ?? true,
      defaultFee: Number(d.default_fee ?? DEFAULT_SHIPPING_CONFIG.defaultFee),
      freeThreshold:
        d.free_shipping_threshold != null
          ? Number(d.free_shipping_threshold)
          : null,
      zones: d.zones ?? {},
    };
  } catch (err) {
    console.error(
      "[shipping] config fetch failed, using defaults:",
      err instanceof Error ? err.message : err,
    );
    return DEFAULT_SHIPPING_CONFIG;
  }
}
