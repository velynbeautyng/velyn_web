import "server-only";
import { opsFetch, OpsError } from "./client";
import { isOpsConfigured, opsConfig } from "./config";
import { dataSource } from "./products";
import type { ResolvedCart } from "./checkout";

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
};

/**
 * Record a completed order in ops.velynbeauty.com (UltimatePOS `sell` API).
 * Best-effort and never throws to the caller: a failure here must not prevent
 * the customer from seeing their confirmation. When the catalogue is still in
 * demo mode (non-numeric product ids) or the API isn't configured, the order
 * is logged for manual entry instead.
 */
export async function recordOrder(order: OrderRecord): Promise<{
  recorded: boolean;
  reason?: string;
}> {
  if (dataSource() === "demo" || !isOpsConfigured()) {
    console.info("[order] recorded (manual — ops not live):", {
      reference: order.reference,
      customer: order.customer,
      total: order.cart.total,
      lines: order.cart.lines.map((l) => `${l.quantity}× ${l.name}`),
    });
    return { recorded: false, reason: "ops-not-live" };
  }

  try {
    const payload = {
      sells: [
        {
          location_id: opsConfig.locationId
            ? Number(opsConfig.locationId)
            : undefined,
          contact_id: process.env.OPS_DEFAULT_CONTACT_ID
            ? Number(process.env.OPS_DEFAULT_CONTACT_ID)
            : undefined,
          status: "final",
          payment_status: "paid",
          sale_note: `Website order ${order.reference} — ${order.customer.name}, ${order.customer.phone}, ${order.customer.address}, ${order.customer.city}, ${order.customer.state}`,
          shipping_charges: order.cart.shipping,
          products: order.cart.lines.map((l) => ({
            product_id: Number(l.slug.split("-").pop()) || undefined,
            variation_id: Number(l.id) || undefined,
            quantity: l.quantity,
            unit_price: l.unitPrice,
          })),
          payments: [
            {
              amount: order.cart.total,
              method: "card",
              note: `Paystack ${order.reference}`,
            },
          ],
        },
      ],
    };

    await opsFetch("sell", { method: "POST", body: payload });
    return { recorded: true };
  } catch (err) {
    const reason = err instanceof OpsError ? err.message : "unknown";
    console.error("[order] ops sell failed, logged for manual entry:", reason, {
      reference: order.reference,
    });
    return { recorded: false, reason };
  }
}
