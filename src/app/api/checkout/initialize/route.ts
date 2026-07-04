import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { resolveCart, type ClientCartItem } from "@/lib/ops/checkout";
import { initializeTransaction, isPaystackConfigured } from "@/lib/paystack";
import { site, whatsappLink } from "@/lib/site";
import { formatNaira } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  items?: ClientCartItem[];
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

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });
  }
  if (!c.name || !c.email || !c.phone || !c.address || !c.city || !c.state) {
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

  // Authoritative re-pricing — client amounts are never trusted.
  const cart = await resolveCart(items);
  if (cart.lines.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available." },
      { status: 409 },
    );
  }

  const reference = `VB-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

  const customer = {
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    notes: c.notes ?? "",
  };

  // No payment gateway configured yet → offer a manual WhatsApp checkout so the
  // customer is never blocked while keys are being set up.
  if (!isPaystackConfigured()) {
    const summary = cart.lines
      .map((l) => `• ${l.quantity}× ${l.brand} ${l.name} — ${formatNaira(l.lineTotal)}`)
      .join("\n");
    const message = [
      `New order ${reference}`,
      "",
      summary,
      "",
      `Subtotal: ${formatNaira(cart.subtotal)}`,
      `Delivery: ${cart.shipping === 0 ? "Free" : formatNaira(cart.shipping)}`,
      `Total: ${formatNaira(cart.total)}`,
      "",
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Deliver to: ${customer.address}, ${customer.city}, ${customer.state}`,
    ].join("\n");

    return NextResponse.json({
      mode: "manual",
      reference,
      whatsapp: whatsappLink(message),
      total: cart.total,
    });
  }

  try {
    const { authorizationUrl } = await initializeTransaction({
      email: customer.email,
      amount: Math.round(cart.total * 100), // kobo
      reference,
      callbackUrl: `${site.url}/checkout/success`,
      metadata: {
        reference,
        customer,
        lines: cart.lines,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
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
