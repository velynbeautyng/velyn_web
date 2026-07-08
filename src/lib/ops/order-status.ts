import "server-only";
import { opsFetch, OpsError } from "./client";
import { isOpsConfigured } from "./config";

export type OrderStatus = {
  reference: string;
  invoiceNo?: string;
  placedAt?: string;
  cancelled: boolean;
  deliveryMethod: "delivery" | "pickup";
  /** 1..4; 0 = cancelled. Labels depend on deliveryMethod. */
  stage: number;
  stageLabel: string;
  trackingNote?: string | null;
  total: number;
  items: { name: string; quantity: number }[];
};

type RawOrderStatus = {
  reference?: string;
  invoice_no?: string | null;
  placed_at?: string | null;
  cancelled?: boolean;
  delivery_method?: string;
  stage?: number;
  stage_label?: string;
  tracking_note?: string | null;
  final_total?: number;
  items?: { name?: string | null; quantity?: number }[];
};

export type OrderLookup =
  | { ok: true; order: OrderStatus }
  | { ok: false; reason: "not-found" | "unconfigured" | "error" };

/** Look up a paid website order by reference + email (private). */
export async function getOrderStatus(
  reference: string,
  email: string,
): Promise<OrderLookup> {
  if (!isOpsConfigured()) return { ok: false, reason: "unconfigured" };
  try {
    const res = await opsFetch<{ data: RawOrderStatus }>("order-status", {
      query: { reference, email },
    });
    const d = res.data ?? {};
    return {
      ok: true,
      order: {
        reference: d.reference ?? reference,
        invoiceNo: d.invoice_no ?? undefined,
        placedAt: d.placed_at ?? undefined,
        cancelled: Boolean(d.cancelled),
        deliveryMethod: d.delivery_method === "pickup" ? "pickup" : "delivery",
        stage: Number(d.stage ?? 1),
        stageLabel: d.stage_label ?? "Confirmed",
        trackingNote: d.tracking_note ?? null,
        total: Number(d.final_total ?? 0),
        items: (d.items ?? []).map((i) => ({
          name: i.name ?? "Item",
          quantity: Number(i.quantity ?? 1),
        })),
      },
    };
  } catch (err) {
    if (err instanceof OpsError && err.status === 404) {
      return { ok: false, reason: "not-found" };
    }
    return { ok: false, reason: "error" };
  }
}
