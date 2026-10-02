"use client";

import { useState } from "react";
import type { Product } from "@/lib/ops/types";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { IconCheck } from "@/components/ui/icons";

export function AddToCartButton({
  product,
  variationId,
  quantity = 1,
  size = "sm",
  full = false,
  label = "Add to Cart",
  className,
}: {
  product: Product;
  variationId?: string;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  label?: string;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const variation =
    product.variations.find((v) => v.id === variationId) ??
    product.variations[0];
  const soldOut = !product.inStock || !variation;

  function handleAdd() {
    if (!variation) return;
    add(
      {
        id: variation.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        variationName:
          variation.name !== "Default" ? variation.name : undefined,
        price: variation.price,
        image: product.image,
        maxQty: variation.qtyAvailable || undefined,
      },
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  if (soldOut) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center border border-linen-mid px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-stone",
          full && "w-full",
          className,
        )}
      >
        Sold Out
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={buttonClass({
        variant: size === "sm" ? "outline" : "gold",
        size,
        className: cn(
          full && "w-full",
          added && "!bg-sage !border-sage !text-white",
          className,
        ),
      })}
    >
      {added ? (
        <>
          <IconCheck width={14} height={14} /> Added
        </>
      ) : (
        label
      )}
    </button>
  );
}
