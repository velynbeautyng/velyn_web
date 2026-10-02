import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "ink" | "gold" | "outline" | "outlineGold" | "outlineLight" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-white border border-ink hover:bg-ink-lift",
  gold: "bg-gold text-ink border border-gold hover:bg-white hover:border-white",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-white",
  outlineGold: "bg-transparent text-gold-deep border border-gold hover:bg-gold hover:text-ink",
  outlineLight: "bg-transparent text-white border border-white/70 hover:bg-white hover:text-ink",
  white: "bg-white text-ink border border-white hover:bg-linen hover:border-linen",
  ghost: "bg-transparent text-ink hover:text-gold-deep",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.6rem]",
  md: "px-6 py-3 text-[0.68rem]",
  lg: "px-8 py-4 text-[0.72rem]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold uppercase tracking-[0.14em] cursor-pointer transition-[color,background-color,border-color,transform] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none";

export function buttonClass({
  variant = "ink",
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
