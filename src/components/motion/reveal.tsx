"use client";

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right" | "fade";

/**
 * Scroll reveal. Content is rendered visible by default (SSR-safe); the hidden
 * pre-animation state lives in CSS behind `@media (scripting: enabled)`, and
 * this hook simply toggles the `is-in` class when the element enters view.
 * Elements already in view on mount reveal immediately, so nothing is ever
 * gated on an animation that fails to run.
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      el.classList.add("is-in");
      return;
    }

    // Already in view (e.g. above the fold) → reveal on next frame.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      requestAnimationFrame(() => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useReveal<HTMLElement>();
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      data-anim={direction}
      style={delay ? { ["--anim-delay" as string]: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useReveal<HTMLElement>();
  const Tag = as as ElementType;
  return (
    <Tag ref={ref} data-stagger className={className}>
      {children}
    </Tag>
  );
}

/** A single item within a `Stagger`. Kept as a plain element (CSS drives it). */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as as ElementType;
  return <Tag className={cn(className)}>{children}</Tag>;
}
