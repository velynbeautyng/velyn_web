/**
 * Paystack sends the shopper back to this URL after payment. It is built from
 * the request so it always matches the host the shopper is on (production,
 * the old domain during the move, or a preview deploy), whatever
 * NEXT_PUBLIC_SITE_URL says.
 */
export function checkoutCallbackUrl(requestUrl: string): string {
  return `${new URL(requestUrl).origin}/checkout/success`;
}
