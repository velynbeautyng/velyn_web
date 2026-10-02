import { NextResponse } from "next/server";
import { getOrderStatus } from "@/lib/ops/order-status";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Order tracking lookup. Proxies the ops order-status endpoint so ops
 * credentials stay server-side. Requires the order reference AND the email
 * used at checkout, so orders can't be enumerated.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = (searchParams.get("reference") || "").trim();
  const email = (searchParams.get("email") || "").trim();

  if (!reference || !email) {
    return NextResponse.json(
      { error: "Enter your order reference and email." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const result = await getOrderStatus(reference, email);
  if (!result.ok) {
    if (result.reason === "not-found") {
      return NextResponse.json({ status: "not-found" }, { status: 404 });
    }
    if (result.reason === "unconfigured") {
      return NextResponse.json({ status: "unconfigured" }, { status: 200 });
    }
    return NextResponse.json(
      { error: "We couldn't check your order right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ status: "ok", order: result.order });
}
