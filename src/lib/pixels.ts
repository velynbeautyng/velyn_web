/**
 * Meta Pixel and TikTok Pixel helpers. Each pixel loads only with a valid ID
 * (see components/seo/pixels.tsx); every call here is a no-op until one has,
 * so the shop works the same with or without them.
 */

type Fbq = (...args: unknown[]) => void;
type Ttq = {
  track: (event: string, params: object, options?: { event_id: string }) => void;
  page: () => void;
};

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

/** Parameters in Meta's names; TikTok gets the same data in its own names. */
export type PixelParams = {
  value?: number;
  currency?: "NGN";
  content_ids?: string[];
  content_name?: string;
  content_type?: "product";
  contents?: { id: string; quantity: number }[];
  num_items?: number;
};

/** TikTok calls a completed sale CompletePayment. */
const TIKTOK_EVENT: Record<PixelEvent, string> = {
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
};

/** The Meta Pixel ID, or null when it is missing or not a plain number. */
export function metaPixelId(raw: string | undefined): string | null {
  const id = raw?.trim();
  return id && /^\d{6,20}$/.test(id) ? id : null;
}

/** The TikTok Pixel ID, or null when it is missing or malformed. */
export function tiktokPixelId(raw: string | undefined): string | null {
  const id = raw?.trim();
  return id && /^[A-Z0-9]{10,30}$/.test(id) ? id : null;
}

function pixels(): { fbq?: Fbq; ttq?: Ttq } {
  if (typeof window === "undefined") return {};
  const w = window as unknown as { fbq?: unknown; ttq?: Ttq };
  return {
    fbq: typeof w.fbq === "function" ? (w.fbq as Fbq) : undefined,
    ttq: w.ttq && typeof w.ttq.track === "function" ? w.ttq : undefined,
  };
}

function tiktokParams(p: PixelParams) {
  const contents = p.contents
    ? p.contents.map((c) => ({
        content_id: c.id,
        ...(p.content_name && p.contents?.length === 1 ? { content_name: p.content_name } : {}),
        quantity: c.quantity,
      }))
    : p.content_ids?.map((id) => ({ content_id: id }));
  return {
    ...(p.value !== undefined ? { value: p.value } : {}),
    ...(p.currency ? { currency: p.currency } : {}),
    ...(p.content_type ? { content_type: p.content_type } : {}),
    ...(contents?.length ? { contents } : {}),
  };
}

/** Send a standard event to both pixels. eventId lets each drop a repeat. */
export function trackPixel(event: PixelEvent, params: PixelParams, eventId?: string): void {
  const { fbq, ttq } = pixels();
  if (fbq) {
    if (eventId) fbq("track", event, params, { eventID: eventId });
    else fbq("track", event, params);
  }
  ttq?.track(TIKTOK_EVENT[event], tiktokParams(params), eventId ? { event_id: eventId } : undefined);
}

/** Count a page view after a client-side navigation. */
export function trackPageView(): void {
  const { fbq, ttq } = pixels();
  fbq?.("track", "PageView");
  ttq?.page();
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
