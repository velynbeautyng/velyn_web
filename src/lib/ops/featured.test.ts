import { describe, expect, it } from "vitest";
import { FEATURED_BRANDS, pickFeatured } from "./featured";

const p = (id: string, brandSlug: string) => ({ id, brandSlug });

describe("pickFeatured", () => {
  it("leads with the charter's headline brands in their listed order", () => {
    const products = [
      p("1", "abbott"),
      p("2", "acewell"),
      p("3", "the-ordinary"),
      p("4", "cerave"),
      p("5", "cosrx"),
    ];
    expect(pickFeatured(products, 3)).toEqual(["4", "3", "5"]);
  });

  it("features one product per brand", () => {
    const products = [p("1", "cerave"), p("2", "cerave"), p("3", "anua")];
    expect(pickFeatured(products, 3)).toEqual(["1", "3"]);
  });

  it("fills remaining slots with other brands in catalogue order", () => {
    const products = [p("1", "abbott"), p("2", "cerave"), p("3", "acewell")];
    expect(pickFeatured(products, 3)).toEqual(["2", "1", "3"]);
  });

  it("skips brandless products", () => {
    expect(pickFeatured([p("1", ""), p("2", "dove")], 2)).toEqual(["2"]);
  });

  it("starts the list with CeraVe and The Ordinary", () => {
    expect(FEATURED_BRANDS.slice(0, 2)).toEqual(["cerave", "the-ordinary"]);
  });
});
