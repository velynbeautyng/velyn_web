import { NextResponse } from "next/server";
import { recordEnquiry } from "@/lib/ops/enquiries";
import { contactErrors } from "@/lib/form-validation";

/**
 * Contact / inquiry endpoint. Validates the payload, records it in ops (so it
 * shows under Enquiries with an admin notification) and dispatches an email.
 * Email delivery is wired via RESEND_API_KEY when present; otherwise the
 * submission is logged so nothing is lost during setup and the user still
 * receives a success response. Both channels are best-effort and independent.
 */

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  // Same messages the form shows, so a field the browser let through still
  // gets a specific answer. Inquiry type defaults below, so it is never missing.
  const fieldErrors = contactErrors({ name, email, message, inquiryType: "set" });
  if (!name || !email || !message || !EMAIL_RE.test(email) || Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const inquiry = {
    name,
    email,
    phone: body.phone?.trim() || "Not provided",
    inquiryType: body.inquiryType?.trim() || "General Inquiry",
    message,
    receivedAt: new Date().toISOString(),
  };

  // Durable record in ops (best-effort: never blocks the email or response).
  await recordEnquiry({
    name,
    email,
    phone: body.phone?.trim() || undefined,
    inquiryType: inquiry.inquiryType,
    message,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX || "hello@nuvenebeauty.com";

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "Nuvene Website <noreply@nuvenebeauty.com>",
          to: [to],
          reply_to: email,
          subject: `New ${inquiry.inquiryType}: ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${inquiry.phone}`,
            `Type: ${inquiry.inquiryType}`,
            "",
            message,
          ].join("\n"),
        }),
      });
      if (!res.ok) throw new Error(`Resend failed (${res.status})`);
    } catch (err) {
      console.error("[contact] email dispatch failed:", err);
      return NextResponse.json(
        { error: "Could not send message. Please try WhatsApp." },
        { status: 502 },
      );
    }
  } else {
    console.info("[contact] submission (email not configured):", inquiry);
  }

  return NextResponse.json({ ok: true });
}
