import { SEO } from "@/components/common/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContent } from "@/hooks/useContent";

import { Link } from "react-router-dom";
import { partners as allPartners, type Partner } from "@/data/partners";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FloatingParticles } from "@/components/hero/FloatingParticles";
import { NetworkLines } from "@/components/hero/NetworkLines";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { cn } from "@/lib/utils";

interface PartnersContent {
  pageTitle: string;
  intro: string;
  categories: {
    engineering: string;
    sustainability: string;
    research: string;
    manufacturing: string;
  };
}

// Define category order
const categoryOrder: Array<Partner['category']> = ['engineering', 'sustainability', 'research', 'manufacturing'];

// Default content fallback
const defaultContent = {
  categories: {
    engineering: "Engineering & Simulation Software",
    sustainability: "Sustainability & Environmental Solutions",
    research: "Research & Analytics Software",
    manufacturing: "Advanced Manufacturing & Innovation"
  }
};

// Brand Colors Map for Glow Effects
const brandColors: Record<string, string> = {
  dassault: "#005596",
  solidworks: "#E02D3B",
  simulia: "#005F9E",
  msc: "#D02C2F",
  cype: "#008FD3",
  simlab: "#FCA311",
  driveworks: "#543C93",
  chaos: "#F0562D",
  simapro: "#78BE20",
  maxqda: "#1B75BC",
  creality: "#24A328",
  herowear: "#F58220",
};

export default function Partners() {
  const { language } = useLanguage();
  const t = useContent<PartnersContent>('partners');
  const { x: mouseX, y: mouseY } = useMouseParallax(7);

  // Fallback for new category label
  const getCategoryTitle = (id: string) => {
    // @ts-ignore
    return t?.categories?.[id] || defaultContent.categories[id as keyof typeof defaultContent.categories];
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO page="partners" />

      {/* Hero Section - Enhanced Network Theme */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-black relative overflow-hidden text-center">
        {/* Animated Gradient Mesh */}
        <div className="hero-gradient-mesh absolute inset-0 z-0" />

        {/* Network Connection Lines */}
        <NetworkLines />

        {/* Blue Network Particles */}
        <FloatingParticles count={15} color="rgba(99, 102, 241, 0.3)" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none z-[5]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-4xl mx-auto">
            {/* Back Link */}
            <div className="flex justify-center mb-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft size={12} className="rtl:rotate-180" />
                {language === "en" ? "Home" : "الرئيسية"}
              </Link>
            </div>

            <h1
              className={cn(
                "font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] text-white",
                "transition-transform duration-200 ease-out"
              )}
              style={{
                transform: `translate(${mouseX}px, ${mouseY}px)`,
                willChange: 'transform'
              }}
            >
              {t.pageTitle}
            </h1>
            <p className="font-body text-lg sm:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              {t.intro}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Partner Ecosystem Grid - White Background */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {categoryOrder.map((categoryId) => {
              const categoryPartners = allPartners.filter(p => p.category === categoryId);

              // Skip empty categories
              if (categoryPartners.length === 0) return null;

              return (
                <div key={categoryId} className="relative">
                  {/* Category Header */}
                  <ScrollReveal className="mb-10 text-center md:text-left border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-wide uppercase">
                        {getCategoryTitle(categoryId)}
                      </h2>
                    </div>
                  </ScrollReveal>

                  {/* Cards Grid */}
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryPartners.map((partner, index) => {
                      const brandColor = brandColors[partner.id] || "#0f172a";

                      return (
                        <StaggerItem key={partner.id} index={index}>
                          <Link // Make the whole card a link if there is a detail view, otherwise div
                            to={`/partners/${partner.id}`}
                            className="group relative block h-full bg-white border border-slate-200 rounded-xl p-8 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{
                              // @ts-ignore
                              "--brand-color": brandColor
                            }}
                          >
                            {/* Hover Brand Accent - Top Line */}
                            <div
                              className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"
                              style={{ backgroundColor: brandColor }}
                            />

                            <div className="relative z-10 flex flex-col h-full">
                              {/* Logo Area */}
                              <div className="h-14 mb-8 flex items-center justify-start">
                                {partner.logo ? (
                                  <img
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    className="h-full w-auto object-contain max-w-[160px] transition-all duration-500 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="text-2xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                                    {partner.name}
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="mt-auto">
                                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-[var(--brand-color)] transition-colors">
                                  {partner.name}
                                </h3>
                                {partner.desc && (
                                  <p className="font-body text-sm text-slate-500 mb-6 leading-relaxed bg-white transition-colors line-clamp-3">
                                    {partner.desc}
                                  </p>
                                )}

                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[var(--brand-color)] transition-colors">
                                  <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Profile'}</span>
                                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </StaggerItem>
                      )
                    })}
                  </StaggerContainer>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
