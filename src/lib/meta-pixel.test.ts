import { afterEach, describe, expect, it, vi } from "vitest";
import { claimPurchase, pixelId, trackPixel } from "./meta-pixel";

function memoryStorage(): Pick<Storage, "getItem" | "setItem"> {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("pixelId", () => {
  it("accepts a numeric Meta Pixel ID, trimmed", () => {
    expect(pixelId(" 1234567890123456 ")).toBe("1234567890123456");
  });

  it("rejects an empty or malformed value so the pixel stays off", () => {
    expect(pixelId(undefined)).toBeNull();
    expect(pixelId("")).toBeNull();
    expect(pixelId("abc123")).toBeNull();
    expect(pixelId("123'); alert(1);//")).toBeNull();
  });
});

describe("trackPixel", () => {
  it("does nothing when the pixel has not loaded", () => {
    vi.stubGlobal("window", {});
    expect(() => trackPixel("AddToCart", { value: 1000 })).not.toThrow();
  });

  it("sends a standard event with its parameters", () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq });
    trackPixel("AddToCart", { value: 1000, currency: "NGN" });
    expect(fbq).toHaveBeenCalledWith("track", "AddToCart", { value: 1000, currency: "NGN" });
  });

  it("passes an event ID so Meta can drop duplicates", () => {
    const fbq = vi.fn();
    vi.stubGlobal("window", { fbq });
    trackPixel("Purchase", { value: 5000, currency: "NGN" }, "NB-ABC123");
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "Purchase",
      { value: 5000, currency: "NGN" },
      { eventID: "NB-ABC123" },
    );
  });
});

describe("claimPurchase", () => {
  it("allows one Purchase per order reference", () => {
    const storage = memoryStorage();
    expect(claimPurchase("NB-ABC123", storage)).toBe(true);
    expect(claimPurchase("NB-ABC123", storage)).toBe(false);
    expect(claimPurchase("NB-XYZ789", storage)).toBe(true);
  });

  it("still allows the event when storage is unavailable", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(claimPurchase("NB-ABC123", broken)).toBe(true);
  });
});
