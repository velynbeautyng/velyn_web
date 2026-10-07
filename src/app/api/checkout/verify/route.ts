import { NextResponse } from "next/server";
import { verifyTransaction, isPaystackConfigured } from "@/lib/paystack";
import { recordOrder } from "@/lib/ops/orders";
import type { ResolvedCart } from "@/lib/ops/checkout";
import type { ConfirmationEmail, Customer } from "@/lib/ops/orders";
import { site } from "@/lib/site";
import { trackPath, trackSecret } from "@/lib/track-link";

/**
 * Check a Paystack reference and, on success, record the order in ops.
 * Order details come from the Paystack transaction metadata set at
 * initialization, so no interim datastore is required.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";

  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }
  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { status: "unconfigured", reference },
      { status: 200 },
    );
  }

  try {
    const result = await verifyTransaction(reference);
    if (result.status !== "success") {
      return NextResponse.json({ status: result.status, reference });
    }

    const meta = (result.metadata ?? {}) as {
      customer?: Customer;
      lines?: ResolvedCart["lines"];
      subtotal?: number;
      shipping?: number;
      deliveryMethod?: "delivery" | "pickup";
    };

    let recorded = false;
    let confirmationEmail: ConfirmationEmail | undefined;
    // Signed link that opens the order status with nothing to type; it goes
    // into the confirmation email and behind the Track Order button.
    const email = meta.customer?.email || result.customerEmail || "";
    const track = email ? trackPath(reference, email, trackSecret()) : `/track?ref=${encodeURIComponent(reference)}`;
    if (meta.customer && meta.lines) {
      const cart: ResolvedCart = {
        lines: meta.lines,
        subtotal: meta.subtotal ?? 0,
        shipping: meta.shipping ?? 0,
        total: result.amount / 100,
        currency: "NGN",
        // The area was checked before Paystack was ever called.
        areaError: null,
      };
      const outcome = await recordOrder({
        reference,
        cart,
        customer: meta.customer,
        paidAt: result.paidAt,
        deliveryMethod: meta.deliveryMethod ?? "delivery",
        trackUrl: `${site.url}${track}`,
      });
      recorded = outcome.recorded;
      confirmationEmail = outcome.confirmationEmail;
    }

    return NextResponse.json({
      status: "success",
      reference,
      amount: result.amount / 100,
      email: result.customerEmail,
      recorded,
      trackPath: track,
      confirmationEmail: confirmationEmail ?? "unknown",
    });
  } catch (err) {
    console.error("[checkout] payment check failed:", err);
    return NextResponse.json(
      { error: "Could not confirm payment." },
      { status: 502 },
    );
  }
}
