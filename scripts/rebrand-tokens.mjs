// One-shot rename of Velyn design tokens to Nuvene ones across src/.
// Run once from the repo root: node scripts/rebrand-tokens.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SKIP = new Set([
  "app/globals.css",
  "lib/maintenance-page.ts",
  "components/brand/velyn-lockup-svg.ts",
]);

const RULES = [
  [/espresso-surface/g, "ink-surface"],
  [/espresso-lift/g, "ink-lift"],
  [/espresso-mid/g, "ink-mid"],
  [/\bespresso\b/g, "ink"],
  [/gold-dim/g, "gold-deep"],
  [/gold-faint/g, "linen-soft"],
  [/ivory-mid/g, "linen-mid"],
  [/\bivory\b/g, "linen"],
  [/text-olive(?![-\w])/g, "text-sage-deep"],
  [/olive-pale/g, "sage-pale"],
  [/olive-mid/g, "sage-mid"],
  [/\bolive\b/g, "sage"],
  [/-(cocoa|mocha)\b/g, "-stone"],
  [/rgba\(44,\s*26,\s*14,/g, "rgba(0,0,0,"],
  [/rgba\(247,\s*244,\s*239,/g, "rgba(225,218,198,"],
  [/#2C1A0E/gi, "#000000"],
  [/#F7F4EF/gi, "#E1DAC6"],
  [/#8A8A00/gi, "#8FA893"],
  [/#676700/gi, "#708E74"],
];

let changed = 0;
for (const rel of readdirSync("src", { recursive: true })) {
  const f = rel.split(path.sep).join("/");
  if (!/\.(tsx?)$/.test(f) || SKIP.has(f)) continue;
  const file = path.join("src", f);
  const before = readFileSync(file, "utf8");
  const after = RULES.reduce((s, [re, to]) => s.replace(re, to), before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
    console.log("updated", f);
  }
}
console.log(`${changed} files updated`);
