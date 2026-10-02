import { describe, expect, it } from "vitest";
import {
  LOGO_HORIZONTAL,
  LOGO_ICON,
  LOGO_STACKED,
} from "@/components/brand/nuvene-logo-paths";

describe.each([
  ["icon", LOGO_ICON],
  ["horizontal", LOGO_HORIZONTAL],
  ["stacked", LOGO_STACKED],
])("%s logo", (_name, logo) => {
  it("has a numeric viewBox", () => {
    expect(logo.viewBox).toMatch(/^0 0 [\d.]+ [\d.]+$/);
  });

  it("is outlined paths coloured through CSS variables", () => {
    expect(logo.body).toContain("<path");
    expect(logo.body).toContain("var(--logo-mark,currentColor)");
    expect(logo.body).not.toMatch(/class=|#373435|#708E74|#FEFEFE|<text|<metadata/i);
  });
});

it("keeps the wordmark separately colourable on lockups", () => {
  expect(LOGO_HORIZONTAL.body).toContain("var(--logo-word,currentColor)");
  expect(LOGO_STACKED.body).toContain("var(--logo-word,currentColor)");
});
