import { describe, expect, it } from "vitest";
import { normalizeProduct, type RawOpsProduct } from "@/lib/ops/normalize";

const raw = (name: string, brand: string | null): RawOpsProduct => ({
  id: 7,
  name,
  brand: brand ? { id: 1, name: brand } : null,
  product_variations: [
    { id: 1, name: "DUMMY", variations: [{ id: 9, name: "DUMMY", sell_price_inc_tax: 9800 }] },
  ],
});

describe("normalizeProduct names", () => {
  it("drops the brand from the start of the name, since the card prints the brand above it", () => {
    const p = normalizeProduct(raw("EOS Shea Butter Cashmere Body Lotion 473ml", "EOS"));
    expect(p.brand).toBe("EOS");
    expect(p.name).toBe("Shea Butter Cashmere Body Lotion 473ml");
  });

  it("matches the brand prefix regardless of case", () => {
    expect(normalizeProduct(raw("eos Vanilla Cashmere Body Wash", "EOS")).name).toBe("Vanilla Cashmere Body Wash");
  });

  it("leaves a name alone when the brand is only part of a word", () => {
    expect(normalizeProduct(raw("Simpleton Cream", "Simple")).name).toBe("Simpleton Cream");
  });

  it("keeps the full name when it is nothing but the brand or there is no brand", () => {
    expect(normalizeProduct(raw("Vaseline", "Vaseline")).name).toBe("Vaseline");
    expect(normalizeProduct(raw("Cotton Pads 80 pcs", null)).name).toBe("Cotton Pads 80 pcs");
  });

  it("keeps the slug readable without repeating the brand", () => {
    expect(normalizeProduct(raw("EOS Pink Champagne Body Wash 473ml", "EOS")).slug).toBe(
      "eos-pink-champagne-body-wash-473ml-7",
    );
  });
});
