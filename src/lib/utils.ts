import { clsx, type ClassValue } from "clsx";

/** Merge conditional class names. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format a Naira amount with the ₦ symbol (for plain strings: WhatsApp, alt text). */
export function formatNaira(amount: number): string {
  return "₦" + nairaAmount(amount);
}

/** Grouped number only, no currency symbol (for the <Price> component). */
export function nairaAmount(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Slugify a string for URLs. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The product code to print on a product page, or null. The ops API falls back
 * to the numeric variation id when a product has no SKU, which means nothing
 * to a shopper, so that is hidden.
 */
export function displaySku(sku: string | undefined): string | null {
  const code = sku?.trim();
  return code && !/^\d+$/.test(code) ? code : null;
}
