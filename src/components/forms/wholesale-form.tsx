"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";

const businessTypes = [
  "Pharmacy",
  "Beauty / Cosmetics Store",
  "Dermatology / Skin Clinic",
  "Spa / Salon",
  "Online Reseller",
  "Distributor",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

const field =
  "w-full border border-linen-mid bg-white px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-stone outline-none transition-colors focus:border-gold";
const label =
  "mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em] text-stone";

export function WholesaleForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);
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

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border border-linen-mid bg-white p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white">
          <IconCheck width={22} height={22} strokeWidth={2.2} />
        </div>
        <h3 className="font-serif text-xl text-ink">Application received</h3>
        <p className="max-w-sm text-sm text-stone">
          Thank you. Our wholesale team verifies business credentials within 48
          hours and will be in touch with pricing and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="w-biz" className={label}>Business Name</label>
          <input id="w-biz" name="businessName" required placeholder="Registered business name" className={field} />
        </div>
        <div>
          <label htmlFor="w-type" className={label}>Business Type</label>
          <select id="w-type" name="businessType" required defaultValue="" className={`${field} cursor-pointer appearance-none`}>
            <option value="" disabled>Select type</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="w-name" className={label}>Contact Name</label>
          <input id="w-name" name="contactName" required autoComplete="name" placeholder="Your full name" className={field} />
        </div>
        <div>
          <label htmlFor="w-loc" className={label}>Location (City / State)</label>
          <input id="w-loc" name="location" required placeholder="e.g. Abuja, FCT" className={field} />
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="w-email" className={label}>Email Address</label>
          <input id="w-email" name="email" type="email" required autoComplete="email" placeholder="business@email.com" className={field} />
        </div>
        <div>
          <label htmlFor="w-phone" className={label}>Phone / WhatsApp</label>
          <input id="w-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+234 ..." className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="w-interest" className={label}>Products / Brands of Interest</label>
        <input id="w-interest" name="interests" placeholder="e.g. CeraVe, The Ordinary, sunscreens" className={field} />
      </div>
      <div>
        <label htmlFor="w-msg" className={label}>Anything else? (optional)</label>
        <textarea id="w-msg" name="message" rows={3} placeholder="Tell us about your business and expected order volumes." className={`${field} resize-y`} />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500" role="alert">
          Something went wrong. Please try again or message us on WhatsApp.
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
