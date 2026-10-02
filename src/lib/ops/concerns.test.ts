import { describe, expect, it } from "vitest";
import {
  CONCERNS,
  concernShort,
  concernSlug,
  inferConcerns,
  resolveConcernSlug,
} from "./concerns";

describe("CONCERNS", () => {
  it("lists the charter's five concerns in charter order", () => {
    expect(CONCERNS.map((c) => c.slug)).toEqual([
      "acne-oily",
      "dryness",
      "dark-spots",
      "sensitive",
      "sun",
    ]);
  });
});

describe("inferConcerns", () => {
  it("puts sun protection first for an oil-control sunscreen", () => {
    const c = inferConcerns(
      "Anthelios UV Mune 400 Oil Control Invisible Fluid SPF 50 Sunscreen 50ml",
    );
    expect(c[0]).toBe("Sun protection");
    expect(c).toContain("Acne & oily skin");
  });

  it("reads zinc niacinamide as acne first, dark spots second", () => {
    expect(inferConcerns("Niacinamide 10% + Zinc 1% 30ml")).toEqual([
      "Acne & oily skin",
      "Dark spots & uneven tone",
    ]);
  });

  it("does not treat 'toner' as 'tone'", () => {
    expect(inferConcerns("Heartleaf 77% Soothing Toner 250ml")).toEqual([
      "Sensitive skin",
    ]);
  });

  it("does not treat 'creamy' as 'cream'", () => {
    expect(inferConcerns("Acne Creamy Wash (4% Benzoyl Peroxide) 170g")).toEqual([
      "Acne & oily skin",
    ]);
  });

  it("maps moisturisers to dryness", () => {
    expect(inferConcerns("CeraVe Moisturizing Lotion 473ml")).toEqual(["Dryness"]);
  });

  it("maps TXA serums to dark spots", () => {
    expect(
      inferConcerns("Niacinamide 10% + TXA 4% Dark Spot Correcting Serum 30ml")[0],
    ).toBe("Dark spots & uneven tone");
  });

  it("uses the category as a hint", () => {
    expect(inferConcerns("Aqua Protect 70ml", "Sunscreen")).toEqual(["Sun protection"]);
  });

  it("treats hydroquinone creams as dark-spot treatments, not moisturisers", () => {
    expect(inferConcerns("Abbot Melalite Hydroquinone USP 30g", "face cream")[0]).toBe(
      "Dark spots & uneven tone",
    );
  });

  it("treats licorice as a brightening ingredient", () => {
    expect(inferConcerns("Acwell 5.5 Licorice pH Balancing Cleansing Toner 150ml")).toContain(
      "Dark spots & uneven tone",
    );
  });

  it("returns nothing for products with no concern signal", () => {
    expect(inferConcerns("100% Cotton Pads 80pcs")).toEqual([]);
  });
});

describe("slugs and labels", () => {
  it("round-trips label to slug", () => {
    for (const c of CONCERNS) expect(concernSlug(c.label)).toBe(c.slug);
  });

  it("has a short label for chips", () => {
    expect(concernShort("Dark spots & uneven tone")).toBe("Dark spots");
  });
});

describe("resolveConcernSlug", () => {
  it("accepts current slugs", () => {
    expect(resolveConcernSlug("dryness")).toBe("dryness");
  });

  it("maps slugs from the old site", () => {
    expect(resolveConcernSlug("acne-prone")).toBe("acne-oily");
    expect(resolveConcernSlug("oily-skin")).toBe("acne-oily");
    expect(resolveConcernSlug("hyperpigmentation")).toBe("dark-spots");
    expect(resolveConcernSlug("dry-skin")).toBe("dryness");
    expect(resolveConcernSlug("sensitive-skin")).toBe("sensitive");
  });

  it("drops slugs with no charter equivalent", () => {
    expect(resolveConcernSlug("anti-ageing")).toBeUndefined();
    expect(resolveConcernSlug("all-skin-types")).toBeUndefined();
    expect(resolveConcernSlug(undefined)).toBeUndefined();
    expect(resolveConcernSlug("")).toBeUndefined();
  });
});
