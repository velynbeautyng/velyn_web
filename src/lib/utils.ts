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
