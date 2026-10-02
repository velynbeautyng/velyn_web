import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Pairings that fail 4.5:1 for small text (see tests/contrast.test.ts):
// white on brand sage is 3.6:1, linen on sage-shade is 3.3:1.
const files = (readdirSync("src", { recursive: true }) as string[])
  .map((f) => f.split(path.sep).join("/"))
  .filter((f) => f.endsWith(".tsx"));

describe("component colour pairings", () => {
  it.each(files)("%s never sets white text on brand sage", (f) => {
    const text = readFileSync(path.join("src", f), "utf8");
    expect(text).not.toMatch(/bg-sage(?![-\w])[^"]*text-white|text-white[^"]*bg-sage(?![-\w])/);
  });

  it("gives sage CTA bands a white kicker, not linen", () => {
    const band = readFileSync("src/components/ui/cta-band.tsx", "utf8");
    expect(band).toMatch(/sage:\s*\{[^}]*kicker:\s*"text-white"/);
  });
});
