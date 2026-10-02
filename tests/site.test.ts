import { describe, expect, it } from "vitest";
import { site, whatsappLink } from "@/lib/site";

describe("site config", () => {
  it("is Nuvene throughout", () => {
    expect(site.name).toBe("Nuvene Beauty");
    expect(JSON.stringify(site)).not.toMatch(/velyn/i);
  });

  it("defaults to the new domain", () => {
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      expect(site.url).toBe("https://nuvenebeauty.com");
    }
  });

  it("stores phones in E.164 with a readable display form", () => {
    expect(site.contact.phones.length).toBeGreaterThanOrEqual(2);
    for (const p of site.contact.phones) {
      expect(p.tel).toMatch(/^\+234\d{10}$/);
      expect(p.display.replace(/\s/g, "")).toBe("0" + p.tel.slice(4));
    }
  });

  it("uses the details the company confirmed on 2 October 2026", () => {
    expect(site.contact.email).toBe("hello@nuvenebeauty.com");
    expect(site.contact.whatsapp).toBe("2347047024403");
    expect(site.contact.hours).toMatch(/24\/7/);
    expect(site.social.facebook).toBe("https://www.facebook.com/profile.php?id=61594144782677");
  });

  it("builds WhatsApp links from digits only", () => {
    expect(whatsappLink("Hello")).toBe(
      `https://wa.me/${site.contact.whatsapp}?text=Hello`,
    );
    expect(site.contact.whatsapp).toMatch(/^234\d{10}$/);
  });

  it("only states numbers the business can stand behind", () => {
    const stats = JSON.stringify(site.stats);
    expect(stats).not.toMatch(/10K|36|states|customers/i);
  });
});
