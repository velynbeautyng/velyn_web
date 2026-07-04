import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "espresso" | "outline" | "outlineLight" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-white border border-gold hover:bg-gold-dim",
  espresso:
    "bg-espresso text-ivory border border-espresso hover:bg-espresso-mid",
  outline:
    "bg-transparent text-espresso border border-espresso hover:bg-espresso hover:text-ivory",
  outlineLight:
    "bg-transparent text-gold-dim border border-gold/60 hover:border-gold hover:text-gold",
  white: "bg-white text-espresso border border-white hover:bg-ivory-mid",
  ghost: "bg-transparent text-espresso hover:text-gold-dim",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.6rem]",
  md: "px-6 py-3 text-[0.68rem]",
  lg: "px-8 py-4 text-[0.72rem]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.14em] cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";

export function buttonClass({
  variant = "espresso",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(baseClass, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={buttonClass({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
