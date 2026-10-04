import "server-only";
import { opsFetch } from "./client";
import { isOpsConfigured } from "./config";
import {
  DEFAULT_SHIPPING_CONFIG,
  shippingConfigFromOps,
  type RawShipping,
  type ShippingConfig,
} from "@/lib/shipping";

/**
 * Load the ops-managed shipping config (default fee, free threshold, per-state
 * rates, Abuja area zones). Falls back to the env defaults if ops is
 * unconfigured or unreachable so checkout never breaks.
 */
export async function getShippingConfig(): Promise<ShippingConfig> {
  if (!isOpsConfigured()) return DEFAULT_SHIPPING_CONFIG;
  try {
    const res = await opsFetch<{ data: RawShipping }>("shipping", {
      revalidate: 300,
    });
    return shippingConfigFromOps(res.data ?? {});
  } catch (err) {
    console.error(
      "[shipping] config fetch failed, using defaults:",
      err instanceof Error ? err.message : err,
    );
    return DEFAULT_SHIPPING_CONFIG;
  }
}
