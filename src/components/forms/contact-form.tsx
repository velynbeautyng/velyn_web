"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const inquiryTypes = [
  "General Inquiry",
  "Product Question",
  "Wholesale / Retail",
  "Brand Partnership",
  "Order Support",
];

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

  const dark = tone === "dark";
  const fieldClass = cn(
    "w-full border px-3.5 py-2.5 text-base sm:text-sm outline-none transition-colors",
    dark
      ? "border-gold/30 bg-linen/[0.04] text-linen placeholder:text-linen/60 focus:border-gold"
      : "border-linen-mid bg-white text-ink placeholder:text-stone focus:border-gold",
  );
  const labelClass = cn(
    "mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em]",
    dark ? "text-linen/80" : "text-stone",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or reach us on WhatsApp.");
    }
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      <div>
        <label htmlFor="cf-name" className={labelClass}>
          Full Name
        </label>
        <input id="cf-name" name="name" required autoComplete="name" placeholder="Your full name" className={fieldClass} />
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email Address
          </label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="your@email.com" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 ..." className={fieldClass} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-type" className={labelClass}>
          Inquiry Type
        </label>
        <select
          id="cf-type"
          name="inquiryType"
          defaultValue={defaultInquiry ?? ""}
          className={cn(fieldClass, "appearance-none cursor-pointer")}
          required
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
      </div>
      <div>
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
        <textarea id="cf-message" name="message" required rows={4} placeholder="How can we help you?" className={cn(fieldClass, "resize-y")} />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-300" role="alert">
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
