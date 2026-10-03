import { describe, expect, it } from "vitest";
import { maintenancePage } from "@/lib/maintenance-page";
import { site } from "@/lib/site";

describe("holding page", () => {
  it("carries its own favicon so it never depends on the app's assets", () => {
    expect(maintenancePage).toMatch(/rel="icon" href="data:image\/svg\+xml/);
  });

  it("is branded Nuvene with no trace of Velyn", () => {
    expect(maintenancePage).toContain("<title>Nuvene Beauty, back shortly</title>");
    expect(maintenancePage).not.toMatch(/velyn/i);
  });

  it("uses the current contact details from the site config", () => {
    expect(maintenancePage).toContain(`mailto:${site.contact.email}`);
    expect(maintenancePage).toContain(`https://wa.me/${site.contact.whatsapp}`);
    for (const phone of site.contact.phones) {
      expect(maintenancePage).toContain(`tel:${phone.tel}`);
    }
    expect(maintenancePage).toContain(site.contact.hours);
    expect(maintenancePage).toContain(site.contact.address.line1);
  });

  it("embeds the Nuvene logo inline", () => {
    expect(maintenancePage).toMatch(/<svg[^>]*viewBox="0 0 3480\.44 1483\.76"/);
  });
});
