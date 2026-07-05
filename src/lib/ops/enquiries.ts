import "server-only";
import { opsFetch, OpsError } from "./client";
import { isOpsConfigured } from "./config";

export type Enquiry = {
  name: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  message: string;
  meta?: Record<string, unknown>;
};

/**
 * Record a website enquiry (contact / partnership / wholesale) in ops so it
 * appears under Enquiries with an admin bell notification. Best-effort and
 * never throws: email delivery is the primary channel, ops is the durable
 * record. When ops isn't configured the caller's email/log path still runs.
 */
export async function recordEnquiry(enquiry: Enquiry): Promise<{
  recorded: boolean;
  reason?: string;
}> {
  if (!isOpsConfigured()) {
    return { recorded: false, reason: "ops-not-configured" };
  }

  try {
    await opsFetch<{ data?: { enquiry_id?: number } }>("enquiry", {
      method: "POST",
      body: {
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        inquiry_type: enquiry.inquiryType,
        message: enquiry.message,
        source: "website",
        meta: enquiry.meta,
      },
    });
    return { recorded: true };
  } catch (err) {
    const reason = err instanceof OpsError ? err.message : "unknown";
    console.error("[enquiry] ops capture failed (email still sent):", reason, {
      name: enquiry.name,
      type: enquiry.inquiryType,
    });
    return { recorded: false, reason };
  }
}
