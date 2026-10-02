import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");
const tokens: Record<string, string> = {
  white: "#ffffff",
  ...Object.fromEntries(
    [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
      m[1],
      m[2],
    ]),
  ),
};

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg: string, bg: string) {
  const a = luminance(tokens[fg]);
  const b = luminance(tokens[bg]);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Every text-on-ground pairing the components use for body-size text.
const BODY: [string, string][] = [
  ["ink", "linen"],
  ["ink", "white"],
  ["ink", "gold"],
  ["stone", "white"],
  ["stone", "linen"],
  ["stone", "linen-soft"],
  ["gold-deep", "white"],
  ["gold-deep", "linen"],
  ["gold-deep", "linen-soft"],
  ["sage-deep", "white"],
  ["sage-deep", "linen"],
  ["sage-deep", "sage-pale"],
  ["white", "ink"],
  ["linen", "ink"],
  ["gold", "ink"],
  ["linen", "ink-surface"],
  ["white", "sage-shade"],
  ["white", "sage-dusk"],
  ["white", "sage-night"],
  ["linen", "sage-night"],
];

// Pairings used only for 24px+ type.
const LARGE: [string, string][] = [
  ["white", "sage"],
  ["linen", "sage-shade"],
];

describe("brand contrast", () => {
  it("defines every token the pairs use", () => {
    for (const [fg, bg] of [...BODY, ...LARGE]) {
      expect(tokens[fg], fg).toMatch(/^#/);
      expect(tokens[bg], bg).toMatch(/^#/);
    }
  });

  it.each(BODY)("%s on %s reaches 4.5:1", (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(LARGE)("%s on %s reaches 3:1 for large text", (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3);
  });

  it("keeps the five brand colours exact", () => {
    expect(tokens.ink.toLowerCase()).toBe("#000000");
    expect(tokens.gold.toLowerCase()).toBe("#bd9468");
    expect(tokens.linen.toLowerCase()).toBe("#e1dac6");
    expect(tokens.sage.toLowerCase()).toBe("#708e74");
  });
});
