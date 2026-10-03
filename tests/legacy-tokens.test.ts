import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ALLOW = new Set<string>();
const LEGACY =
  /\b(?:bg|text|border|divide|ring|fill|stroke|from|to|via|outline|decoration|shadow|accent|caret)-(?:espresso|ivory|olive|cocoa|mocha|gold-dim|gold-faint)\b|--color-(?:espresso|ivory|olive|cocoa|mocha)|font-(?:eb-garamond|manrope)/;

const files = (readdirSync("src", { recursive: true }) as string[])
  .map((f) => f.split(path.sep).join("/"))
  .filter((f) => /\.(tsx?|css)$/.test(f) && !ALLOW.has(f));

describe("legacy Velyn tokens", () => {
  it.each(files)("%s uses no Velyn colour or font tokens", (f) => {
    const hit = readFileSync(path.join("src", f), "utf8").match(LEGACY);
    expect(hit?.[0]).toBeUndefined();
  });
});
