"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function TrackForm() {
  const [orderId, setOrderId] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = orderId.trim();
    const message = trimmed
      ? `Hi Velyn, I'd like an update on my order ${trimmed}.`
      : "Hi Velyn, I'd like an update on my order.";
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="order-id"
          className="mb-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.14em] text-mocha"
        >
          Order Number
        </label>
        <input
          id="order-id"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. VB-10234"
          className="w-full border border-ivory-mid bg-white px-3.5 py-3 text-sm text-espresso placeholder:text-mocha/60 outline-none focus:border-gold"
        />
      </div>
      <Button type="submit" variant="espresso" size="lg" className="sm:w-auto">
        Track via WhatsApp
      </Button>
    </form>
  );
}
