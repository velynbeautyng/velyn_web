import { describe, expect, it } from "vitest";
import { maintenancePage } from "@/lib/maintenance-page";

describe("velynbeauty.com holding page", () => {
  it("carries its own favicon instead of the site icon, which is now Nuvene's", () => {
    expect(maintenancePage).not.toContain('href="/icon.svg"');
    expect(maintenancePage).toMatch(/rel="icon" href="data:image\/svg\+xml/);
  });

  it("keeps the Velyn contact details", () => {
    expect(maintenancePage).toContain("+234 814 174 1207");
    expect(maintenancePage).not.toMatch(/nuvene/i);
  });
});
