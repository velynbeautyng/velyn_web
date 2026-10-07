/**
 * Field-level messages for the contact and wholesale forms. Shared by the
 * browser (shown under each field) and the API (returned with a 422), so both
 * say the same thing.
 */

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const blank = (v: unknown) => typeof v !== "string" || v.trim() === "";

function emailError(email: unknown): string | null {
  if (blank(email)) return "Please enter your email address.";
  if (!EMAIL_RE.test(String(email).trim())) return "Please enter a valid email, like name@example.com.";
  return null;
}

export function contactErrors(v: {
  name?: unknown;
  email?: unknown;
  inquiryType?: unknown;
  message?: unknown;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (blank(v.name)) errors.name = "Please enter your name.";
  const email = emailError(v.email);
  if (email) errors.email = email;
  if (blank(v.inquiryType)) errors.inquiryType = "Please choose an inquiry type.";
  if (blank(v.message)) errors.message = "Please write a short message.";
  return errors;
}

export function wholesaleErrors(v: {
  businessName?: unknown;
  businessType?: unknown;
  contactName?: unknown;
  location?: unknown;
  email?: unknown;
  phone?: unknown;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (blank(v.businessName)) errors.businessName = "Please enter your business name.";
  if (blank(v.businessType)) errors.businessType = "Please choose your business type.";
  if (blank(v.contactName)) errors.contactName = "Please enter your name.";
  if (blank(v.location)) errors.location = "Please enter your city and state.";
  const email = emailError(v.email);
  if (email) errors.email = email;
  if (blank(v.phone)) errors.phone = "Please enter a phone or WhatsApp number.";
  else if (String(v.phone).replace(/\D/g, "").length < 10)
    errors.phone = "Please enter a full phone number, like 0704 702 4403.";
  return errors;
}
