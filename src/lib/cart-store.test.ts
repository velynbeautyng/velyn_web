import { describe, expect, it } from "vitest";
import { cartPersistence } from "./cart-store";

describe("cart persistence", () => {
  it("saves the items but never the drawer's open state", () => {
    const saved = cartPersistence.partialize({
      items: [{ id: "v1", quantity: 2 }],
      isOpen: true,
    } as never);
    expect(saved).toEqual({ items: [{ id: "v1", quantity: 2 }] });
  });

  it("ignores an open-drawer flag left in older saved state", () => {
    const current = { items: [], isOpen: false } as never;
    const merged = cartPersistence.merge(
      { items: [{ id: "v1", quantity: 1 }], isOpen: true },
      current,
    );
    expect(merged).toMatchObject({ items: [{ id: "v1", quantity: 1 }], isOpen: false });
  });

  it("stores under the Nuvene key", () => {
    expect(cartPersistence.name).toBe("nuvene-cart");
  });
});
