"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { contactErrors, type FieldErrors } from "@/lib/form-validation";

const inquiryTypes = [
  "General Inquiry",
  "Product Question",
  "Wholesale / Retail",
  "Brand Partnership",
  "Order Support",
];

// Checked in this order, so focus lands on the first field the customer meets.
const FIELD_ORDER = ["name", "email", "inquiryType", "message"];

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  tone = "dark",
  defaultInquiry,
}: {
  tone?: "dark" | "light";
  defaultInquiry?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const dark = tone === "dark";
  const fieldClass = (name: string) =>
    cn(
      "w-full border px-3.5 py-2.5 text-base sm:text-sm outline-none transition-colors",
      dark
        ? "border-gold/30 bg-linen/[0.04] text-linen placeholder:text-linen/60 focus:border-gold"
        : "border-linen-mid bg-white text-ink placeholder:text-stone focus:border-gold",
      errors[name] && (dark ? "border-[#ffb4a8]" : "border-[#b42318]"),
    );
  const labelClass = cn(
    "mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em]",
    dark ? "text-linen/80" : "text-stone",
  );
  const errorClass = cn("mt-1.5 text-[0.75rem]", dark ? "text-[#ffb4a8]" : "text-[#b42318]");

  const fieldProps = (name: string) => ({
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `cf-${name}-error` : undefined,
  });

  function showErrors(form: HTMLFormElement, found: FieldErrors) {
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setError("");

    const found = contactErrors(data);
    if (Object.keys(found).length > 0) {
      showErrors(form, found);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 422) {
        const body = await res.json().catch(() => ({}));
        if (body.fieldErrors) {
          setStatus("idle");
          showErrors(form, body.fieldErrors);
          return;
        }
      }
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("We couldn't send your message just now. Please try again or reach us on WhatsApp.");
    }
  }

  function clearError(e: React.FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (!name || !errors[name]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 border p-10 text-center",
          dark ? "border-gold/15 bg-linen/[0.03]" : "border-linen-mid bg-white",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-deep text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 9 17.5 20 6.5" />
          </svg>
        </div>
        <h3 className={cn("font-serif text-xl", dark ? "text-linen" : "text-ink")}>
          Message received
        </h3>
        <p className={cn("max-w-xs text-sm", dark ? "text-linen/75" : "text-stone")}>
          Thank you for reaching out. Our team will get back to you by email or
          phone.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onChange={clearError} className="flex flex-col gap-3.5" noValidate>
      <div>
        <label htmlFor="cf-name" className={labelClass}>
          Full Name
        </label>
        <input id="cf-name" {...fieldProps("name")} autoComplete="name" placeholder="Your full name" className={fieldClass("name")} />
        {errors.name && <p id="cf-name-error" className={errorClass}>{errors.name}</p>}
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email Address
          </label>
          <input id="cf-email" {...fieldProps("email")} type="email" autoComplete="email" placeholder="your@email.com" className={fieldClass("email")} />
          {errors.email && <p id="cf-email-error" className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 ..." className={fieldClass("phone")} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-type" className={labelClass}>
          Inquiry Type
        </label>
        <select
          id="cf-type"
          {...fieldProps("inquiryType")}
          defaultValue={defaultInquiry ?? ""}
          className={cn(fieldClass("inquiryType"), "appearance-none cursor-pointer")}
        >
          <option value="" disabled>
            Select inquiry type
          </option>
          {inquiryTypes.map((t) => (
            <option key={t} value={t} className="text-ink">
              {t}
            </option>
          ))}
        </select>
        {errors.inquiryType && <p id="cf-inquiryType-error" className={errorClass}>{errors.inquiryType}</p>}
      </div>
      <div>
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
        <textarea id="cf-message" {...fieldProps("message")} rows={4} placeholder="How can we help you?" className={cn(fieldClass("message"), "resize-y")} />
        {errors.message && <p id="cf-message-error" className={errorClass}>{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className={cn("text-sm", dark ? "text-[#ffb4a8]" : "text-[#b42318]")} role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={status === "submitting"}
        className="mt-1 w-full"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
      <p className={cn("text-center text-[0.7rem] leading-relaxed", dark ? "text-linen/70" : "text-stone")}>
        We&apos;re open 24/7. We reply by email, phone or WhatsApp.
      </p>
    </form>
  );
}
