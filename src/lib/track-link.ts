import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed one-click tracking links for the confirmation email. The token holds
 * the customer's email (so the order shows without typing anything) plus a
 * signature tying it to one order reference, so it cannot be edited to look
 * up someone else's order.
 */

function sign(reference: string, email: string, secret: string): string {
  return createHmac("sha256", secret).update(`${reference}|${email}`).digest("hex").slice(0, 32);
}

export function trackToken(reference: string, email: string, secret: string): string {
  const e = email.trim().toLowerCase();
  return `${Buffer.from(e).toString("base64url")}.${sign(reference, e, secret)}`;
}

/** The email inside a valid token for this reference, or null. */
export function emailFromTrackToken(reference: string, token: string, secret: string): string | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || !secret) return null;
  const email = Buffer.from(encoded, "base64url").toString("utf8");
  const expected = Buffer.from(sign(reference, email, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return email;
}

/** Path to the tracking page with the order filled in. */
export function trackPath(reference: string, email: string, secret: string): string {
  const base = `/track?ref=${encodeURIComponent(reference)}`;
  return secret ? `${base}&k=${trackToken(reference, email, secret)}` : base;
}

/** Signing secret: a dedicated one if set, else the Paystack secret already on the server. */
export function trackSecret(): string {
  return process.env.TRACK_LINK_SECRET || process.env.PAYSTACK_SECRET_KEY || "";
}
