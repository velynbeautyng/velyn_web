"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const options = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

export function ShopSort() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const current = params.get("sort") ?? "featured";

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    next.delete("page");
    startTransition(() => {
      router.push(`/shop?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <label className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.12em] text-stone">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
        className="cursor-pointer border border-linen-mid bg-white px-3 py-2 text-[0.7rem] text-ink outline-none focus:border-gold"
        aria-label="Sort products"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
