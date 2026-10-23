import { afterEach, describe, expect, it, vi } from "vitest";
import {
  claimPurchase,
  metaPixelId,
  tiktokPixelId,
  trackPageView,
  trackPixel,
} from "./pixels";

function memoryStorage(): Pick<Storage, "getItem" | "setItem"> {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
}

function tiktok() {
  return { track: vi.fn(), page: vi.fn() };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("metaPixelId", () => {
  it("accepts a numeric Meta Pixel ID, trimmed", () => {
    expect(metaPixelId(" 1840816177105938 ")).toBe("1840816177105938");
  });

  it("rejects an empty or malformed value so the pixel stays off", () => {
    expect(metaPixelId(undefined)).toBeNull();
    expect(metaPixelId("")).toBeNull();
    expect(metaPixelId("abc123")).toBeNull();
    expect(metaPixelId("123'); alert(1);//")).toBeNull();
  });
});

describe("tiktokPixelId", () => {
  it("accepts TikTok's upper-case letters-and-digits ID", () => {
    expect(tiktokPixelId(" DB822QBC77U45L31JUL0 ")).toBe("DB822QBC77U45L31JUL0");
  });

  it("rejects anything that could break out of the script", () => {
    expect(tiktokPixelId(undefined)).toBeNull();
    expect(tiktokPixelId("")).toBeNull();
    expect(tiktokPixelId("DB822');alert(1)//")).toBeNull();
  });
});

describe("trackPixel", () => {
  it("does nothing when neither pixel has loaded", () => {
    vi.stubGlobal("window", {});
    expect(() => trackPixel("AddToCart", { value: 1000 })).not.toThrow();
  });

  it("sends a Meta standard event with its parameters", () => {
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

  it("sends the same event to TikTok in TikTok's field names", () => {
    const ttq = tiktok();
    vi.stubGlobal("window", { ttq });
    trackPixel("AddToCart", {
      value: 3000,
      currency: "NGN",
      content_ids: ["MSK-MYM-TUR-1"],
      content_name: "Purifying Turmeric Facial Mask",
      content_type: "product",
      contents: [{ id: "MSK-MYM-TUR-1", quantity: 3 }],
    });
    expect(ttq.track).toHaveBeenCalledWith(
      "AddToCart",
      {
        value: 3000,
        currency: "NGN",
        content_type: "product",
        contents: [
          { content_id: "MSK-MYM-TUR-1", content_name: "Purifying Turmeric Facial Mask", quantity: 3 },
        ],
      },
      undefined,
    );
  });

  it("builds TikTok contents from content IDs when no quantities are given", () => {
    const ttq = tiktok();
    vi.stubGlobal("window", { ttq });
    trackPixel("ViewContent", { value: 1800, currency: "NGN", content_ids: ["NB127"], content_type: "product" });
    expect(ttq.track).toHaveBeenCalledWith(
      "ViewContent",
      { value: 1800, currency: "NGN", content_type: "product", contents: [{ content_id: "NB127" }] },
      undefined,
    );
  });

  it("reports a sale to TikTok as CompletePayment with the same event ID", () => {
    const ttq = tiktok();
    vi.stubGlobal("window", { ttq });
    trackPixel("Purchase", { value: 5000, currency: "NGN" }, "NB-ABC123");
    expect(ttq.track).toHaveBeenCalledWith(
      "CompletePayment",
      { value: 5000, currency: "NGN" },
      { event_id: "NB-ABC123" },
    );
  });
});

describe("trackPageView", () => {
  it("counts a page view on both pixels", () => {
    const fbq = vi.fn();
    const ttq = tiktok();
    vi.stubGlobal("window", { fbq, ttq });
    trackPageView();
    expect(fbq).toHaveBeenCalledWith("track", "PageView");
    expect(ttq.page).toHaveBeenCalled();
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
