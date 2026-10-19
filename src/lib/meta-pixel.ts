/**
 * Meta Pixel helpers. The pixel only loads when NEXT_PUBLIC_META_PIXEL_ID is
 * set (see components/seo/meta-pixel.tsx); every call here is a no-op until it
 * has, so the shop works the same with or without it.
 */

type Fbq = (...args: unknown[]) => void;

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

export type PixelParams = {
  value?: number;
  currency?: "NGN";
  content_ids?: string[];
  content_name?: string;
  content_type?: "product";
  contents?: { id: string; quantity: number }[];
  num_items?: number;
};

/** The configured pixel ID, or null when it is missing or not a plain number. */
export function pixelId(raw: string | undefined): string | null {
  const id = raw?.trim();
  return id && /^\d{6,20}$/.test(id) ? id : null;
}

/** Send a standard event. eventId lets Meta drop a repeat of the same event. */
export function trackPixel(event: PixelEvent, params: PixelParams, eventId?: string): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  if (eventId) fbq("track", event, params, { eventID: eventId });
  else fbq("track", event, params);
}

/**
 * True the first time it is called for an order reference in this browser, so
 * refreshing the confirmation page does not count the sale twice.
 */
export function claimPurchase(
  reference: string,
  storage: Pick<Storage, "getItem" | "setItem">,
): boolean {
  const key = `nuvene:pixel-purchase:${reference}`;
  try {
    if (storage.getItem(key)) return false;
    storage.setItem(key, "1");
  } catch {
    // Private mode or blocked storage: report the sale rather than lose it.
  }
  return true;
}
