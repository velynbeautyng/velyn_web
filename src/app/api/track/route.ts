import { NextResponse } from "next/server";
import { getOrderStatus } from "@/lib/ops/order-status";
import { normalizeReference } from "@/lib/order-reference";
import { emailFromTrackToken, trackSecret } from "@/lib/track-link";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Order tracking lookup. Proxies the ops order-status endpoint so ops
 * credentials stay server-side. Requires the order reference AND either the
 * email used at checkout or a signed link token (from the confirmation email
 * or Thank You page), so orders can't be enumerated.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = normalizeReference(searchParams.get("reference") || "");
  const token = (searchParams.get("k") || "").trim();
  let email = (searchParams.get("email") || "").trim();

  if (!reference) {
    return NextResponse.json({ error: "Enter your order reference." }, { status: 400 });
  }
  if (!email && token) {
    email = emailFromTrackToken(reference, token, trackSecret()) ?? "";
    if (!email) {
      return NextResponse.json(
        { error: "This tracking link is incomplete. Enter the email you used at checkout." },
        { status: 400 },
      );
    }
  }
  if (!email) {
    return NextResponse.json({ error: "Enter the email you used at checkout." }, { status: 400 });
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
