import { describe, expect, it } from "vitest";
import { displaySku } from "./utils";

describe("displaySku", () => {
  it("shows the store's product code", () => {
    expect(displaySku("SER-ORD-10%NIA-30")).toBe("SER-ORD-10%NIA-30");
    expect(displaySku(" NB071 ")).toBe("NB071");
  });

  it("hides the numeric fallback the API uses when a product has no code", () => {
    expect(displaySku("4182")).toBeNull();
    expect(displaySku("")).toBeNull();
    expect(displaySku(undefined)).toBeNull();
  });
});
