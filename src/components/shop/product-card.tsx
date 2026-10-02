import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/ops/types";
import { concernShort } from "@/lib/ops/concerns";
import { cn } from "@/lib/utils";
import { NuveneIcon } from "@/components/brand/nuvene-logo";
import { IconCheck } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const href = `/shop/${product.slug}`;
  const discounted = product.compareAtPrice && product.compareAtPrice > product.price;
  const concern = product.concerns[0];

  return (
    <article
      className={cn(
        "group flex flex-col border border-linen-mid bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_26px_40px_-32px_rgba(0,0,0,0.4)] motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[4/5] overflow-hidden bg-linen-soft"
      >
        {discounted && (
          <span className="absolute right-0 top-0 z-10 bg-ink px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white">
            Sale
          </span>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
            className="object-contain p-[11%] mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <NuveneIcon className="h-10 text-linen-mid" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
            {product.brand}
          </p>
          <span className="auth-tag shrink-0">
            <IconCheck width={10} height={10} strokeWidth={2.4} /> Original
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-[0.95rem] leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>
        {concern && (
          <span className="mt-2.5 w-fit bg-sage-pale px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-sage-deep">
            {concernShort(concern)}
          </span>
        )}
        <div className="mt-auto flex flex-col gap-2.5 border-t border-linen-mid pt-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <div className="flex flex-col leading-none">
            <Price amount={product.price} className="font-serif text-lg text-ink" />
            {discounted && (
              <span className="mt-1 text-xs text-stone line-through">
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
