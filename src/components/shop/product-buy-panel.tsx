"use client";

import { useState } from "react";
import type { Product } from "@/lib/ops/types";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { IconCheck, IconMinus, IconPlus } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/site";

export function ProductBuyPanel({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [variationId, setVariationId] = useState(product.variations[0]?.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variation =
    product.variations.find((v) => v.id === variationId) ??
    product.variations[0];
  const soldOut = !product.inStock || !variation?.inStock;
  const max = variation?.qtyAvailable || 99;
  const hasVariants =
    product.variations.length > 1 ||
    (product.variations[0] && product.variations[0].name !== "Default");

  function handleAdd() {
    if (!variation) return;
    add(
      {
        id: variation.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        variationName: variation.name !== "Default" ? variation.name : undefined,
        price: variation.price,
        image: product.image,
        maxQty: variation.qtyAvailable || undefined,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <Price
          amount={variation?.price ?? product.price}
          className="font-serif text-3xl text-espresso"
        />
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="pb-1 text-base text-mocha line-through">
            <Price amount={product.compareAtPrice} />
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            soldOut ? "bg-mocha" : "bg-olive-mid",
          )}
        />
        <span className="text-[0.8rem] text-cocoa">
          {soldOut
            ? "Currently out of stock"
            : max <= 5
              ? `Only ${max} left in stock`
              : "In stock — ready to ship"}
        </span>
      </div>

      {hasVariants && (
        <div>
          <label className="mb-2 block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-mocha">
            Option
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variations.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariationId(v.id)}
                disabled={!v.inStock}
                className={cn(
                  "border px-3.5 py-2 text-[0.75rem] transition-colors cursor-pointer disabled:opacity-40",
                  v.id === variationId
                    ? "border-espresso bg-espresso text-ivory"
                    : "border-ivory-mid bg-white text-espresso hover:border-gold",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!soldOut && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-ivory-mid">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-espresso hover:bg-ivory-mid cursor-pointer"
              aria-label="Decrease quantity"
            >
              <IconMinus width={16} height={16} />
            </button>
            <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(max, q + 1))}
              className="flex h-11 w-11 items-center justify-center text-espresso hover:bg-ivory-mid cursor-pointer"
              aria-label="Increase quantity"
            >
              <IconPlus width={16} height={16} />
            </button>
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            variant="gold"
            size="lg"
            className={cn("flex-1", added && "!bg-olive !border-olive")}
          >
            {added ? (
              <>
                <IconCheck width={16} height={16} /> Added to Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      )}

      <a
        href={whatsappLink(
          `Hi Velyn, I'm interested in ${product.brand} — ${product.name}. Is it available?`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-[0.72rem] uppercase tracking-[0.12em] text-gold-dim underline-offset-4 hover:underline"
      >
        Or enquire on WhatsApp
      </a>
    </div>
  );
}
