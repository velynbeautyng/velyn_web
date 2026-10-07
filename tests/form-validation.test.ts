import { describe, expect, it } from "vitest";
import { contactErrors, wholesaleErrors } from "@/lib/form-validation";

const goodContact = {
  name: "Ada Obi",
  email: "ada@example.com",
  inquiryType: "General Inquiry",
  message: "Do you stock CeraVe?",
};

describe("contact form messages", () => {
  it("passes a complete form", () => {
    expect(contactErrors(goodContact)).toEqual({});
  });

  it("names each empty required field", () => {
    expect(contactErrors({ name: " ", email: "", inquiryType: "", message: "" })).toEqual({
      name: "Please enter your name.",
      email: "Please enter your email address.",
      inquiryType: "Please choose an inquiry type.",
      message: "Please write a short message.",
    });
  });

  it("explains a mistyped email", () => {
    expect(contactErrors({ ...goodContact, email: "ada@example" }).email).toBe(
      "Please enter a valid email, like name@example.com.",
    );
  });
});

describe("wholesale form messages", () => {
  const good = {
    businessName: "Glow Pharmacy",
    businessType: "Pharmacy",
    contactName: "Ada Obi",
    location: "Abuja, FCT",
    email: "orders@glow.ng",
    phone: "0704 702 4403",
  };

  it("passes a complete application", () => {
    expect(wholesaleErrors(good)).toEqual({});
  });

  it("names each missing field", () => {
    const errors = wholesaleErrors({ ...good, businessName: "", businessType: "", phone: "" });
    expect(errors).toEqual({
      businessName: "Please enter your business name.",
      businessType: "Please choose your business type.",
      phone: "Please enter a phone or WhatsApp number.",
    });
  });

  it("asks for a real phone number, not a fragment", () => {
    expect(wholesaleErrors({ ...good, phone: "0704" }).phone).toBe(
      "Please enter a full phone number, like 0704 702 4403.",
    );
  });
});
