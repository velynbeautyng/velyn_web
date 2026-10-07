"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { wholesaleErrors, type FieldErrors } from "@/lib/form-validation";

const businessTypes = [
  "Pharmacy",
  "Beauty / Cosmetics Store",
  "Dermatology / Skin Clinic",
  "Spa / Salon",
  "Online Reseller",
  "Distributor",
  "Other",
];

// Checked in form order, so focus lands on the first field with a problem.
const FIELD_ORDER = ["businessName", "businessType", "contactName", "location", "email", "phone"];

type Status = "idle" | "submitting" | "success" | "error";

const label =
  "mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone";
const errorClass = "mt-1.5 text-[0.75rem] text-[#b42318]";

export function WholesaleForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const field = (name: string) =>
    cn(
      "w-full border border-linen-mid bg-white px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-stone outline-none transition-colors focus:border-gold",
      errors[name] && "border-[#b42318]",
    );
  const fieldProps = (name: string) => ({
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `w-${name}-error` : undefined,
  });
  const message = (name: string) =>
    errors[name] ? <p id={`w-${name}-error`} className={errorClass}>{errors[name]}</p> : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const values = Object.fromEntries(fd);

    const found = wholesaleErrors(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = FIELD_ORDER.find((f) => found[f]);
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");

    const payload = {
      name: fd.get("contactName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      inquiryType: "Wholesale / Retail Application",
      message: [
        `Business: ${fd.get("businessName")}`,
        `Type: ${fd.get("businessType")}`,
        `Location: ${fd.get("location")}`,
        `Products of interest: ${fd.get("interests") || "Not specified"}`,
        "",
        String(fd.get("message") || ""),
      ].join("\n"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
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
      <div className="flex flex-col items-center gap-3 border border-linen-mid bg-white p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-deep text-white">
          <IconCheck width={22} height={22} strokeWidth={2.2} />
        </div>
        <h3 className="font-serif text-xl text-ink">Application received</h3>
        <p className="max-w-sm text-sm text-stone">
          Thank you. Our wholesale team will review your application and get in
          touch with pricing and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onChange={clearError} className="flex flex-col gap-3.5" noValidate>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="w-biz" className={label}>Business Name</label>
          <input id="w-biz" {...fieldProps("businessName")} placeholder="Registered business name" className={field("businessName")} />
          {message("businessName")}
        </div>
        <div>
          <label htmlFor="w-type" className={label}>Business Type</label>
          <select id="w-type" {...fieldProps("businessType")} defaultValue="" className={`${field("businessType")} cursor-pointer appearance-none`}>
            <option value="" disabled>Select type</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {message("businessType")}
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="w-name" className={label}>Contact Name</label>
          <input id="w-name" {...fieldProps("contactName")} autoComplete="name" placeholder="Your full name" className={field("contactName")} />
          {message("contactName")}
        </div>
        <div>
          <label htmlFor="w-loc" className={label}>Location (City / State)</label>
          <input id="w-loc" {...fieldProps("location")} placeholder="e.g. Abuja, FCT" className={field("location")} />
          {message("location")}
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="w-email" className={label}>Email Address</label>
          <input id="w-email" {...fieldProps("email")} type="email" autoComplete="email" placeholder="business@email.com" className={field("email")} />
          {message("email")}
        </div>
        <div>
          <label htmlFor="w-phone" className={label}>Phone / WhatsApp</label>
          <input id="w-phone" {...fieldProps("phone")} type="tel" autoComplete="tel" placeholder="+234 ..." className={field("phone")} />
          {message("phone")}
        </div>
      </div>
      <div>
        <label htmlFor="w-interest" className={label}>Products / Brands of Interest</label>
        <input id="w-interest" name="interests" placeholder="e.g. CeraVe, The Ordinary, sunscreens" className={field("interests")} />
      </div>
      <div>
        <label htmlFor="w-msg" className={label}>Anything else? (optional)</label>
        <textarea id="w-msg" name="message" rows={3} placeholder="Tell us about your business and expected order volumes." className={`${field("message")} resize-y`} />
      </div>

      {status === "error" && (
        <p className="text-sm text-[#b42318]" role="alert">
          We couldn&apos;t send your application just now. Please try again or message us on WhatsApp.
        </p>
      )}

      <Button type="submit" variant="ink" size="lg" disabled={status === "submitting"} className="mt-1 w-full">
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </Button>
      <p className="text-center text-[0.7rem] text-stone">
        We review every application and reply by email or phone.
      </p>
    </form>
  );
}
