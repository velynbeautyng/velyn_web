"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global Lenis smooth-scroll driver. Disabled when the user prefers reduced
 * motion, or in `?still=1` screenshot mode (which also forces reveals to their
 * final state via the `.still` class so captures aren't caught mid-animation).
 */
export function SmoothScroll() {
  useEffect(() => {
    const still = new URLSearchParams(window.location.search).has("still");
    if (still) {
      document.documentElement.classList.add("still");
      document
        .querySelectorAll("[data-anim], [data-stagger]")
        .forEach((el) => el.classList.add("is-in"));
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || still) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
