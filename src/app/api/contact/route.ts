import { NextResponse } from "next/server";
import { recordEnquiry } from "@/lib/ops/enquiries";

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

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 422 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
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

  // Durable record in ops (best-effort — never blocks the email or response).
  await recordEnquiry({
    name,
    email,
    phone: body.phone?.trim() || undefined,
    inquiryType: inquiry.inquiryType,
    message,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX || "hello@velynbeauty.com";

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "Velyn Website <noreply@velynbeauty.com>",
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
