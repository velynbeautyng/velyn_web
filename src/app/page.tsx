import { Hero } from "@/components/home/hero";
import { StatsBar } from "@/components/home/stats";
import { WhatWeDo } from "@/components/home/what-we-do";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhoWeServe } from "@/components/home/who-we-serve";
import { BrandsPreview } from "@/components/home/brands-preview";
import { WholesalePreview } from "@/components/home/wholesale-preview";
import { PartnerCta } from "@/components/home/partner-cta";
import { EducationPreview } from "@/components/home/education-preview";
import { ContactSection } from "@/components/home/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <WhatWeDo />
      <FeaturedProducts />
      <WhoWeServe />
      <BrandsPreview />
      <WholesalePreview />
      <PartnerCta />
      <EducationPreview />
      <ContactSection />
    </>
  );
}
