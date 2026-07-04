import "server-only";

/**
 * Minimal Paystack server client. All calls use the secret key from the
 * environment; when it is absent the storefront falls back to manual
 * (WhatsApp/email) order handling so checkout never hard-fails during setup.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

type InitInput = {
  email: string;
  /** Amount in the smallest currency unit (kobo). */
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

type InitResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export async function initializeTransaction(
  input: InitInput,
): Promise<InitResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack not configured");

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data?.message || `Paystack init failed (${res.status})`);
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

type VerifyResult = {
  status: "success" | "failed" | "abandoned" | "pending";
  amount: number;
  reference: string;
  paidAt?: string;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
};

export async function verifyTransaction(
  reference: string,
): Promise<VerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Paystack not configured");

  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    },
  );

  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new Error(data?.message || `Paystack verify failed (${res.status})`);
  }

  return {
    status: data.data.status,
    amount: data.data.amount,
    reference: data.data.reference,
    paidAt: data.data.paid_at,
    customerEmail: data.data.customer?.email,
    metadata: data.data.metadata,
  };
}
