import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/ops/types";
import { cn } from "@/lib/utils";
import { VelynMark } from "@/components/brand/velyn-mark";
import { IconCheck } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const href = `/shop/${product.slug}`;
  const discounted =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <article
      className={cn(
        "group flex flex-col border border-linen-mid bg-white transition-shadow duration-300 hover:shadow-[0_20px_40px_-28px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden border-b border-linen-mid bg-linen"
        tabIndex={-1}
        aria-hidden
      >
        <span className="auth-tag absolute left-2.5 top-2.5 z-10">
          <IconCheck width={11} height={11} strokeWidth={2.5} /> Authentic
        </span>
        {discounted && (
          <span className="absolute right-2.5 top-2.5 z-10 bg-ink px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-linen">
            Sale
          </span>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
            className="object-contain p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <VelynMark className="h-9 w-auto opacity-15" tone="ink" />
            <span className="text-[0.6rem] uppercase tracking-[0.14em] text-ink/25">
              {product.brand}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 font-serif text-[0.95rem] leading-snug text-ink">
          <Link href={href} className="hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>

        {product.concerns[0] && (
          <span className="mt-2.5 inline-block w-fit bg-sage-pale px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-sage-deep">
            {product.concerns[0]}
          </span>
        )}

        <div className="mt-auto flex flex-col gap-2.5 border-t border-linen-mid pt-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="flex flex-col leading-none">
            <Price
              amount={product.price}
              className="font-serif text-lg text-ink"
            />
            {discounted && (
              <span className="mt-0.5 text-xs text-stone line-through">
                <Price amount={product.compareAtPrice!} />
              </span>
            )}
          </div>
          <AddToCartButton product={product} full className="sm:w-auto" />
        </div>
      </div>
    </article>
  );
}
