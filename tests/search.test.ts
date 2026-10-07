import { describe, expect, it } from "vitest";
import { matchesSearch } from "@/lib/search";

const cleanser = {
  name: "Hydrating Cleanser 236ml",
  brand: "CeraVe",
  category: "Cleansers",
  concerns: ["Dryness"],
};

describe("shop search", () => {
  it("matches across brand and product name", () => {
    expect(matchesSearch(cleanser, "cerave cleanser")).toBe(true);
    expect(matchesSearch(cleanser, "CeraVe Hydrating")).toBe(true);
  });

  it("needs every word to match", () => {
    expect(matchesSearch(cleanser, "cerave sunscreen")).toBe(false);
  });

  it("matches category and concern words", () => {
    expect(matchesSearch(cleanser, "cleansers")).toBe(true);
    expect(matchesSearch(cleanser, "dryness")).toBe(true);
  });

  it("ignores case, extra spaces and apostrophes", () => {
    expect(matchesSearch({ ...cleanser, brand: "Dr Teal's", name: "Shea Sugar Scrub" }, "  dr teals   scrub ")).toBe(true);
  });

  it("matches everything for an empty search", () => {
    expect(matchesSearch(cleanser, "   ")).toBe(true);
  });
});
