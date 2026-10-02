import { describe, expect, it } from "vitest";
import { checkoutCallbackUrl } from "./checkout-url";

describe("checkoutCallbackUrl", () => {
  it("returns shoppers to the host they paid from, not a configured default", () => {
    expect(checkoutCallbackUrl("https://www.example-shop.ng/api/checkout/initialize")).toBe(
      "https://www.example-shop.ng/checkout/success",
    );
    expect(checkoutCallbackUrl("https://nuvene-git-branch.vercel.app/api/checkout/initialize?x=1")).toBe(
      "https://nuvene-git-branch.vercel.app/checkout/success",
    );
  });
});
