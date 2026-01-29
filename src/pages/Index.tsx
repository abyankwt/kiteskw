import { useState } from "react";
import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";

import { Hero } from "@/components/home/Hero";
import { WhoWeAreSection } from "@/components/sections/WhoWeAreSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { KeyPillarsSection } from "@/components/sections/KeyPillarsSection";
import { CTASection } from "@/components/sections/CTASection";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const Index = () => {
  return (
    <>
      <SEO page="home" />
      <SkipLink />

      <ErrorBoundary>
        {/* 1. Hero Section - Lead with value proposition */}
        <Hero />

        {/* 2. Key Pillars - Core fundamental pillars */}
        <KeyPillarsSection />

        {/* 3. Our Services - Demonstrate capability */}
        <ServicesSection />

        {/* 4. Organizations We Support - Establish institutional credibility */}
        <ClientsSection />

        {/* 5. Technology Partners - Tools support outcomes */}
        <PartnersSection />

        {/* 6. Who We Are - Contextual depth and self-description */}
        <WhoWeAreSection />

        {/* 7. Final CTA */}
        <CTASection />
      </ErrorBoundary>

    </>
  );
};

export default Index;
