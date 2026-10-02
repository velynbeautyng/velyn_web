"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconPlus } from "@/components/ui/icons";

export type QA = { q: string; a: string };

export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-linen-mid border-y border-linen-mid">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
            >
              <span className="font-serif text-base text-ink sm:text-lg">
                {item.q}
              </span>
              <IconPlus
                width={18}
                height={18}
                className={cn(
                  "shrink-0 text-gold-deep transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen
                  ? "grid-rows-[1fr] pb-5 opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="prose-body text-[0.9rem]">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
