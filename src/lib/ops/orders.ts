import "server-only";
import { opsFetch, OpsError } from "./client";
import { isOpsConfigured, opsConfig } from "./config";
import { dataSource } from "./products";
import type { ResolvedCart } from "./checkout";
import { site } from "@/lib/site";

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
};

export type OrderRecord = {
  reference: string;
  cart: ResolvedCart;
  customer: Customer;
  paidAt?: string;
  deliveryMethod?: "delivery" | "pickup";
  /** One-click tracking link for the confirmation email ops sends. */
  trackUrl?: string;
};

/** What happened to the customer's confirmation email, as reported by ops. */
export type ConfirmationEmail = "sent" | "not-configured" | "failed" | "duplicate" | "unknown";

/**
 * Record a completed order in ops (UltimatePOS `sell` API).
 * Best-effort and never throws to the caller: a failure here must not prevent
 * the customer from seeing their confirmation. When the catalogue is still in
 * demo mode (non-numeric product ids) or the API isn't configured, the order
 * is logged for manual entry instead.
 */
export async function recordOrder(order: OrderRecord): Promise<{
  recorded: boolean;
  reason?: string;
  confirmationEmail?: ConfirmationEmail;
}> {
  if (dataSource() === "demo" || !isOpsConfigured()) {
    console.info("[order] recorded (manual, ops not live):", {
      reference: order.reference,
      customer: order.customer,
      total: order.cart.total,
      lines: order.cart.lines.map((l) => `${l.quantity}× ${l.name}`),
    });
    return { recorded: false, reason: "ops-not-live" };
  }

  try {
    // Post to our custom storefront order endpoint (auth:api). It creates a
    // native UltimatePOS sale (CRM contact, stock deduction, payment and an
    // admin bell notification) and is idempotent on `reference`.
    const payload = {
      reference: order.reference,
      location_id: opsConfig.locationId
        ? Number(opsConfig.locationId)
        : undefined,
      paid_at: order.paidAt,
      shipping: order.cart.shipping,
      delivery_method: order.deliveryMethod ?? "delivery",
      customer: order.customer,
      track_url: order.trackUrl,
      store: {
        name: site.name,
        url: site.url,
        email: site.contact.email,
        phones: site.contact.phones.map((p) => `${p.label} ${p.display}`),
      },
      items: order.cart.lines
        .map((l) => ({
          variation_id: Number(l.id),
          quantity: l.quantity,
        }))
        .filter((i) => Number.isFinite(i.variation_id) && i.variation_id > 0),
    };

    const res = await opsFetch<{
      data?: {
        transaction_id?: number;
        invoice_no?: string;
        duplicate?: boolean;
        confirmation_email?: ConfirmationEmail;
      };
    }>("order", { method: "POST", body: payload });

    console.info("[order] recorded in ops:", {
      reference: order.reference,
      invoice_no: res.data?.invoice_no,
      transaction_id: res.data?.transaction_id,
      confirmation_email: res.data?.confirmation_email,
    });
    return {
      recorded: true,
      confirmationEmail: res.data?.duplicate ? "duplicate" : (res.data?.confirmation_email ?? "unknown"),
    };
  } catch (err) {
    const reason = err instanceof OpsError ? err.message : "unknown";
    console.error("[order] ops order failed, logged for manual entry:", reason, {
      reference: order.reference,
      customer: order.customer,
      lines: order.cart.lines.map((l) => `${l.quantity}× ${l.name}`),
      total: order.cart.total,
    });
    return { recorded: false, reason };
  }
}
