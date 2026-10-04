import { describe, expect, it } from "vitest";
import {
  computeShipping,
  findAreaZone,
  deliveryAreaError,
  needsArea,
  shippingConfigFromOps,
  type ShippingConfig,
} from "@/lib/shipping";

const ABUJA = "FCT - Abuja";

const config: ShippingConfig = {
  isActive: true,
  defaultFee: 3500,
  freeThreshold: null,
  zones: { Lagos: 6000, Kaduna: 3000 },
  areaZones: [
    { state: ABUJA, name: "Zone A", fee: 2500, areas: ["Wuse", "Utako", "Wuye"] },
    { state: ABUJA, name: "Zone C", fee: 4000, areas: ["Gwarinpa", "Life Camp", "Dawaki"] },
    { state: ABUJA, name: "Zone E", fee: 8000, areas: ["Bwari", "Airport"] },
  ],
};

describe("delivery pricing", () => {
  it("prices an Abuja area at its zone's rate", () => {
    expect(computeShipping(20000, ABUJA, config, "Utako")).toBe(2500);
    expect(computeShipping(20000, ABUJA, config, "Life Camp")).toBe(4000);
    expect(computeShipping(20000, ABUJA, config, "Airport")).toBe(8000);
  });

  it("matches an area regardless of case and stray spaces", () => {
    expect(findAreaZone(ABUJA, "  life camp ", config)?.name).toBe("Zone C");
  });

  it("does not match an area that is only part of another name", () => {
    expect(findAreaZone(ABUJA, "Airport Road", config)).toBeUndefined();
  });

  it("knows which states are priced by area", () => {
    expect(needsArea(ABUJA, config)).toBe(true);
    expect(needsArea("Lagos", config)).toBe(false);
    expect(needsArea(undefined, config)).toBe(false);
  });

  it("flags an Abuja area that is not on the list instead of pricing it", () => {
    expect(findAreaZone(ABUJA, "Somewhere New", config)).toBeUndefined();
  });

  it("prices other states by their own rate, and unlisted states by the default", () => {
    expect(computeShipping(20000, "Lagos", config)).toBe(6000);
    expect(computeShipping(20000, "Kaduna", config, "Barnawa")).toBe(3000);
    expect(computeShipping(20000, "Ekiti", config)).toBe(3500);
  });

  it("charges delivery on large orders when there is no free-delivery threshold", () => {
    expect(computeShipping(500000, "Lagos", config)).toBe(6000);
  });

  it("still honours a threshold and the delivery switch when ops sets them", () => {
    expect(computeShipping(60000, "Lagos", { ...config, freeThreshold: 50000 })).toBe(0);
    expect(computeShipping(20000, ABUJA, { ...config, isActive: false }, "Utako")).toBe(0);
  });

  it("charges nothing for an empty cart", () => {
    expect(computeShipping(0, ABUJA, config, "Utako")).toBe(0);
  });
});

describe("reading the ops shipping config", () => {
  it("maps area zones and a removed threshold", () => {
    const c = shippingConfigFromOps({
      is_active: true,
      default_fee: 3500,
      free_shipping_threshold: null,
      zones: { Lagos: 6000 },
      area_zones: [{ state: ABUJA, name: "Zone A", fee: "2500.0000", areas: ["Wuse", "Utako"] }],
    });
    expect(c.freeThreshold).toBeNull();
    expect(c.zones).toEqual({ Lagos: 6000 });
    expect(c.areaZones).toEqual([{ state: ABUJA, name: "Zone A", fee: 2500, areas: ["Wuse", "Utako"] }]);
  });

  it("drops malformed zones instead of pricing with them", () => {
    const c = shippingConfigFromOps({
      area_zones: [
        { state: ABUJA, name: "Zone X", fee: "abc", areas: ["Wuse"] },
        { state: ABUJA, name: "Zone Y", fee: 4000, areas: [] },
        { state: ABUJA, name: "Zone Z", fee: 4000, areas: ["Karu", "", 7] },
      ],
    });
    expect(c.areaZones).toEqual([{ state: ABUJA, name: "Zone Z", fee: 4000, areas: ["Karu"] }]);
  });

  it("works with an older ops that sends no area zones", () => {
    expect(shippingConfigFromOps({ default_fee: 3500 }).areaZones).toEqual([]);
  });
});

describe("checking the delivery area before payment", () => {
  it("asks an Abuja customer to choose an area from the list", () => {
    expect(deliveryAreaError(ABUJA, "", config)).toMatch(/choose your area/i);
    expect(deliveryAreaError(ABUJA, "Somewhere New", config)).toMatch(/choose your area/i);
  });

  it("accepts a listed Abuja area and any other state", () => {
    expect(deliveryAreaError(ABUJA, "Dawaki", config)).toBeNull();
    expect(deliveryAreaError("Lagos", "Ikeja", config)).toBeNull();
  });
});
