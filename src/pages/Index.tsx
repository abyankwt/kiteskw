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
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
// TEMP DISABLED: import { IntroRevealAR } from "@/components/intro/IntroRevealAR";

const Index = () => {
  const { language } = useLanguage();
  // TEMP DISABLED: const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <SEO page="home" />
      <SkipLink />

      {/* TEMP DISABLED: {!introComplete && <IntroRevealAR onComplete={() => setIntroComplete(true)} />} */}

      <ErrorBoundary>
        {/* 1. Hero Section - Lead with value proposition */}
        <Hero />

        {/* 2. Key Pillars - Core fundamental pillars */}
        <KeyPillarsSection />

        {/* 3. Our Services - Demonstrate capability */}
        <ServicesSection />

        {/* 3.5 Client Testimonials - Social proof */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  {language === 'en' ? 'Client Success Stories' : 'قصص نجاح العملاء'}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'Trusted by leading organizations across the GCC'
                    : 'موثوق به من قبل المؤسسات الرائدة في دول مجلس التعاون الخليجي'}
                </p>
              </div>
            </ScrollReveal>
            <TestimonialsCarousel />
          </div>
        </section>

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
