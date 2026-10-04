/**
 * Shipping model shared by server (authoritative pricing) and client (live
 * checkout display). Pure (no server-only imports), so both can use it.
 *
 * Config comes from ops (GET /api/storefront/shipping); the env values are the
 * fallback defaults when ops is unreachable or unconfigured.
 */

/** A priced group of areas inside one state, e.g. Abuja's Zone A. */
export type AreaZone = {
  state: string;
  name: string;
  fee: number;
  areas: string[];
};

export type ShippingConfig = {
  /** When false, delivery is free everywhere (e.g. a promotion). */
  isActive: boolean;
  /** Fee for any state without a specific zone rate. */
  defaultFee: number;
  /** Subtotal at/above which delivery is free. null = never free. */
  freeThreshold: number | null;
  /** Per-state overrides, keyed by the exact checkout state name. */
  zones: Record<string, number>;
  /** States priced by area instead of one rate (Abuja). */
  areaZones: AreaZone[];
};

const envThreshold = process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD;

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  isActive: true,
  defaultFee: Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 3500),
  freeThreshold: envThreshold ? Number(envThreshold) : null,
  zones: {},
  areaZones: [],
};

/** Shape of GET /api/storefront/shipping from ops (decimals may arrive as strings). */
export type RawShipping = {
  is_active?: boolean;
  default_fee?: number | string;
  free_shipping_threshold?: number | string | null;
  zones?: Record<string, number>;
  area_zones?: { state?: unknown; name?: unknown; fee?: unknown; areas?: unknown }[];
};

/** Turn the ops payload into a config, dropping any zone that could misprice. */
export function shippingConfigFromOps(d: RawShipping): ShippingConfig {
  const areaZones: AreaZone[] = [];
  for (const z of Array.isArray(d.area_zones) ? d.area_zones : []) {
    const fee = Number(z.fee);
    const areas = Array.isArray(z.areas)
      ? z.areas.filter((a): a is string => typeof a === "string" && a.trim() !== "")
      : [];
    if (typeof z.state !== "string" || typeof z.name !== "string") continue;
    if (!Number.isFinite(fee) || fee < 0 || areas.length === 0) continue;
    areaZones.push({ state: z.state, name: z.name, fee, areas });
  }
  return {
    isActive: d.is_active ?? true,
    defaultFee: Number(d.default_fee ?? DEFAULT_SHIPPING_CONFIG.defaultFee),
    freeThreshold: d.free_shipping_threshold != null ? Number(d.free_shipping_threshold) : null,
    zones: d.zones ?? {},
    areaZones,
  };
}

const key = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/** The area zones for a state, empty when the state has one flat rate. */
export function areaZonesFor(state: string | undefined, config: ShippingConfig): AreaZone[] {
  if (!state) return [];
  return (config.areaZones ?? []).filter((z) => z.state === state);
}

/** Whether checkout must ask for an area to price delivery to this state. */
export function needsArea(state: string | undefined, config: ShippingConfig): boolean {
  return areaZonesFor(state, config).length > 0;
}

/** The zone an area belongs to, matched on the whole name. */
export function findAreaZone(
  state: string | undefined,
  area: string | undefined,
  config: ShippingConfig,
): AreaZone | undefined {
  if (!area) return undefined;
  const wanted = key(area);
  return areaZonesFor(state, config).find((z) => z.areas.some((a) => key(a) === wanted));
}

/** Why delivery to this destination cannot be priced yet, or null when it can. */
export function deliveryAreaError(
  state: string | undefined,
  area: string | undefined,
  config: ShippingConfig,
): string | null {
  if (!needsArea(state, config) || findAreaZone(state, area, config)) return null;
  return "Please choose your area from the list so we can price delivery.";
}

/**
 * Delivery fee for a subtotal and destination under the given config. A state
 * priced by area falls back to its state rate when the area is unknown; checkout
 * rejects that case before charging, so the fallback is only ever displayed.
 */
export function computeShipping(
  subtotal: number,
  state: string | undefined,
  config: ShippingConfig,
  area?: string,
): number {
  if (subtotal <= 0) return 0;
  if (!config.isActive) return 0;
  if (config.freeThreshold != null && subtotal >= config.freeThreshold) return 0;
  const zone = findAreaZone(state, area, config);
  if (zone) return zone.fee;
  if (state && Object.prototype.hasOwnProperty.call(config.zones, state)) {
    return config.zones[state];
  }
  return config.defaultFee;
}
