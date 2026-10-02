import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { resolveCart, type ClientCartItem } from "@/lib/ops/checkout";
import { initializeTransaction, isPaystackConfigured } from "@/lib/paystack";
import { whatsappLink } from "@/lib/site";
import { checkoutCallbackUrl } from "@/lib/checkout-url";
import { formatNaira } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  items?: ClientCartItem[];
  deliveryMethod?: "delivery" | "pickup";
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    notes?: string;
  };
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const c = body.customer ?? {};
  const method = body.deliveryMethod === "pickup" ? "pickup" : "delivery";

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });
  }
  // Contact details are always required; a delivery address only when the
  // customer chose home delivery (self pickup collects from the store).
  if (!c.name || !c.email || !c.phone) {
    return NextResponse.json(
      { error: "Please complete your name, email and phone." },
      { status: 422 },
    );
  }
  if (method === "delivery" && (!c.address || !c.city || !c.state)) {
    return NextResponse.json(
      { error: "Please complete all delivery details." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(c.email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 422 },
    );
  }

  // Authoritative re-pricing, client amounts are never trusted. Delivery is
  // priced from the ops shipping config using the destination state; pickup is
  // always free.
  const cart = await resolveCart(items, method === "pickup" ? undefined : c.state);
  if (cart.lines.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available." },
      { status: 409 },
    );
  }

  const shipping = method === "pickup" ? 0 : cart.shipping;
  const total = cart.subtotal + shipping;

  const reference = `VB-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

  const customer = {
    name: c.name.slice(0, 50),
    email: c.email,
    phone: c.phone,
    address: method === "pickup" ? "" : (c.address ?? ""),
    city: method === "pickup" ? "" : (c.city ?? ""),
    state: method === "pickup" ? "" : (c.state ?? ""),
    notes: c.notes ?? "",
  };

  // No payment gateway configured yet → offer a manual WhatsApp checkout so the
  // customer is never blocked while keys are being set up.
  if (!isPaystackConfigured()) {
    const summary = cart.lines
      .map((l) => `• ${l.quantity}× ${l.brand} ${l.name}, ${formatNaira(l.lineTotal)}`)
      .join("\n");
    const fulfilment =
      method === "pickup"
        ? "Fulfilment: Self Pickup (collect from store)"
        : `Deliver to: ${customer.address}, ${customer.city}, ${customer.state}`;
    const message = [
      `New order ${reference}`,
      "",
      summary,
      "",
      `Subtotal: ${formatNaira(cart.subtotal)}`,
      `${method === "pickup" ? "Pickup" : "Delivery"}: ${shipping === 0 ? "Free" : formatNaira(shipping)}`,
      `Total: ${formatNaira(total)}`,
      "",
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      fulfilment,
    ].join("\n");

    return NextResponse.json({
      mode: "manual",
      reference,
      whatsapp: whatsappLink(message),
      total,
    });
  }

  try {
    const { authorizationUrl } = await initializeTransaction({
      email: customer.email,
      amount: Math.round(total * 100), // kobo
      reference,
      callbackUrl: checkoutCallbackUrl(request.url),
      metadata: {
        reference,
        customer,
        lines: cart.lines,
        subtotal: cart.subtotal,
        shipping,
        deliveryMethod: method,
      },
    });

    return NextResponse.json({
      mode: "paystack",
      reference,
      authorizationUrl,
    });
  } catch (err) {
    console.error("[checkout] initialize failed:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
