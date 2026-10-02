import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Every /brand/... public asset referenced from the code must exist, so a
// deleted logo can't leave a 404 behind in metadata or JSON-LD.
const files = (readdirSync("src", { recursive: true }) as string[])
  .map((f) => f.split(path.sep).join("/"))
  .filter((f) => /\.(tsx?|css)$/.test(f));

const refs = files.flatMap((f) =>
  [...readFileSync(path.join("src", f), "utf8").matchAll(/["'`(]\$?\{?[\w.]*\}?(\/brand\/[^"'`)\s]+)/g)].map(
    (m) => [f, decodeURI(m[1])] as const,
  ),
);

describe("public brand assets", () => {
  it("finds some references to check", () => {
    expect(refs.length).toBeGreaterThan(0);
  });

  it.each(refs)("%s references an existing file: %s", (_file, ref) => {
    expect(existsSync(path.join("public", ref))).toBe(true);
  });
});
