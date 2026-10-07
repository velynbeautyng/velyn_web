import { describe, expect, it } from "vitest";
import { newOrderReference, normalizeReference } from "@/lib/order-reference";

describe("order references", () => {
  it("start new orders with NB for Nuvene Beauty", () => {
    expect(newOrderReference(1791370000000, "ff2f01")).toBe(
      `NB-${(1791370000000).toString(36).toUpperCase()}-FF2F01`,
    );
  });

  it("tidy a reference typed with spaces or in lower case", () => {
    expect(normalizeReference("  vb muy0vgn0 ff2f01 ")).toBe("VB-MUY0VGN0-FF2F01");
    expect(normalizeReference("nb_ab12__cd34")).toBe("NB-AB12-CD34");
  });

  it("leave an already tidy reference unchanged, old VB ones included", () => {
    expect(normalizeReference("VB-MUY0VGN0-FF2F01")).toBe("VB-MUY0VGN0-FF2F01");
    expect(normalizeReference("NB-MUY0VGN0-FF2F01")).toBe("NB-MUY0VGN0-FF2F01");
  });
});
