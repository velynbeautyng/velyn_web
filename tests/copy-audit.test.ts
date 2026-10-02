import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// lib/ops/config.ts keeps the ops hostname as its default until ops moves to
// ops.nuvenebeauty.com, so it may still mention Velyn.
const VELYN_ALLOWED = new Set([
  "lib/maintenance-page.ts",
  "lib/maintenance-velyn-lockup.ts",
  "lib/ops/config.ts",
]);

const BANNED: [string, RegExp][] = [
  [
    "direct sourcing claim",
    /sourced directly|directly from (the )?manufacturer|direct[- ]from[- ]manufacturer|direct sourcing|direct manufacturer/i,
  ],
  // Skips URL path segments (/api/checkout/verify, Paystack's /transaction/verify)
  // and fault descriptions ("a verified defect"); those are not sourcing claims.
  [
    "product verification claim",
    /(?<!\/)\bverif(?:y|ied|ies|ication)\b(?![\s-]+(?:manufacturing\s+)?defect)/i,
  ],
  ["authenticated claim", /\bauthenticated\b|100% authentic/i],
  ["unbacked numbers", /\b10K\b|36 states/i],
  ["superlative", /\bpremier\b/i],
  ["brand protection claim", /brand protection/i],
  ["batch claim", /every batch/i],
  ["em or en dash", /[\u2013\u2014]/],
  [
    "inflated vocabulary",
    /\b(delve|leverage|seamless(ly)?|robust|comprehensive|elevate|unlock|harness|meticulous|testament|tapestry|game-changer)\b/i,
  ],
];

const files = (readdirSync("src", { recursive: true }) as string[])
  .map((f) => f.split(path.sep).join("/"))
  .filter((f) => /\.(tsx?|css)$/.test(f) && !f.startsWith("lib/maintenance"));

describe("copy audit", () => {
  it.each(files)("%s makes no banned claims", (f) => {
    const text = readFileSync(path.join("src", f), "utf8");
    const hits = BANNED.filter(([, re]) => re.test(text)).map(
      ([name, re]) => `${name}: ${text.match(re)![0]}`,
    );
    expect(hits).toEqual([]);
  });

  it.each(files.filter((f) => !VELYN_ALLOWED.has(f)))("%s does not mention Velyn", (f) => {
    expect(readFileSync(path.join("src", f), "utf8")).not.toMatch(/velyn/i);
  });
});
