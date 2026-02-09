import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ExpertiseGrid } from "@/components/expertise/ExpertiseGrid";
import { IndustrySpotlight } from "@/components/services/IndustrySpotlight";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FloatingParticles } from "@/components/hero/FloatingParticles";
import { TechnicalGrid } from "@/components/hero/TechnicalGrid";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { cn } from "@/lib/utils";

// Content Data
const content = {
  en: {
    hero: {
      eyebrow: "Enterprise Simulation Capabilities",
      title: "Our Expertise",
      intro: "Our expertise is built on advanced simulation, engineering knowledge, research, and practical experience, enabling us to solve complex challenges across industries.",
    },
    areasTitle: "Core Expertise Areas",
    areas: [
      {
        icon: "cpu",
        title: "Simulation & CAE",
        description: "De-risk innovation with high-fidelity digital verification before physical prototyping.",
        outcome: "Reduce prototyping costs by up to 40%."
      },
      {
        icon: "chart",
        title: "Engineering Consulting",
        description: "Optimize complex systems through rigorous data validation and physics-based modeling.",
        outcome: "Actionable reliability improvements."
      },
      {
        icon: "leaf",
        title: "Sustainability Analysis",
        description: "Ensure regulatory compliance and minimize environmental footprint with LCA studies.",
        outcome: "Global environmental standard adherence."
      },
      {
        icon: "graduation",
        title: "Training & Knowledge",
        description: "Build internal capability with applied technical mastery in simulation tools.",
        outcome: "Empowered, self-sufficient engineering teams."
      },
    ],
    industries: {
      title: "Industries We Support",
      list: ["Energy & Oil & Gas", "Infrastructure & Construction", "Manufacturing", "Academia & Research", "Government & Public Sector"]
    },
    methodology: {
      title: "Our Approach",
      steps: [
        { title: "Simulation-Led", desc: "Digital verification before physical prototypes." },
        { title: "Data-Driven", desc: "Decisions backed by rigorous computational analysis." },
        { title: "Validation-Focused", desc: "Ensuring real-world accuracy and reliability." },
      ]
    },
    leadershipTitle: "Leadership & Impact",
    leadershipDescription: "Through research-driven methodologies and global partnerships, KITES empowers organizations to innovate confidently and responsibly.",
    metrics: [
      { label: "Regional Experience", value: "15+ Years" },
      { label: "Simulation Projects", value: "100+" },
      { label: "Enterprise Clients", value: "30+" }
    ]
  },
  ar: {
    hero: {
      eyebrow: "قدرات المحاكاة للمؤسسات",
      title: "خبراتنا",
      intro: "تعتمد خبراتنا على المحاكاة المتقدمة، والمعرفة الهندسية، والبحث العلمي، والخبرة العملية، مما يمكننا من معالجة التحديات المعقدة في مختلف القطاعات.",
    },
    areasTitle: "مجالات الخبرة الأساسية",
    areas: [
      {
        icon: "cpu",
        title: "المحاكاة والتحليل الهندسي",
        description: "تقليل مخاطر الابتكار من خلال التحقق الرقمي عالي الدقة قبل النماذج الأولية المادية.",
        outcome: "تقليل تكاليف النماذج الأولية بنسبة تصل إلى 40٪."
      },
      {
        icon: "chart",
        title: "الاستشارات الهندسية",
        description: "تحسين الأنظمة المعقدة من خلال التحقق الدقيق من البيانات والنمذجة القائمة على الفيزياء.",
        outcome: "تحسينات عملية وموثوقة."
      },
      {
        icon: "leaf",
        title: "الاستدامة والتحليل البيئي",
        description: "ضمان الامتثال التنظيمي وتقليل البصمة البيئية من خلال دراسات تقييم دورة الحياة.",
        outcome: "الامتثال للمعايير البيئية العالمية."
      },
      {
        icon: "graduation",
        title: "التدريب ونقل المعرفة",
        description: "بناء القدرات الداخلية من خلال الإتقان التقني التطبيقي في أدوات المحاكاة.",
        outcome: "فرق هندسية متمكنة ومكتفية ذاتياً."
      },
    ],
    industries: {
      title: "الصناعات التي ندعمها",
      list: ["الطاقة والنفط والغاز", "البنية التحتية والإنشاءات", "التصنيع", "الأوساط الأكاديمية والبحثية", "القطاع الحكومي والعام"]
    },
    methodology: {
      title: "نهجنا",
      steps: [
        { title: "قائم على المحاكاة", desc: "التحقق الرقمي قبل النماذج الأولية المادية." },
        { title: "مدفوع بالبيانات", desc: "قرارات مدعومة بتحليل حسابي دقيق." },
        { title: "التركيز على التحقق", desc: "ضمان الدقة والموثوقية في العالم الحقيقي." },
      ]
    },
    leadershipTitle: "الريادة والأثر",
    leadershipDescription: "من خلال منهجيات قائمة على البحث العلمي وشراكات عالمية، يمكّن KITES المؤسسات من الابتكار بثقة ومسؤولية.",
    metrics: [
      { label: "خبرة إقليمية", value: "+15 عاماً" },
      { label: "مشاريع محاكاة", value: "+100" },
      { label: "عملاء مؤسسيين", value: "+30" }
    ]
  },
};

export default function Expertise() {
  const { language, isRTL } = useLanguage();
  const t = content[language];

  // Refs for GSAP animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);

  // Mouse parallax effect
  const { x: mouseX, y: mouseY } = useMouseParallax(8);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow badge
      gsap.from(eyebrowRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power2.out",
      });

      // Title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.1,
        ease: "power2.out",
      });

      // Intro text
      gsap.from(introRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-background">
      <SEO page="expertise" />
      <SkipLink />

      {/* Page Hero - Enhanced with Engineering Theme */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-black relative overflow-hidden text-center">
        {/* Animated Gradient Mesh Background */}
        <div className="hero-gradient-mesh absolute inset-0 z-0" />

        {/* Technical Grid Pattern */}
        <div className="opacity-[0.08]">
          <TechnicalGrid />
        </div>

        {/* Floating Particles - More Visible */}
        <FloatingParticles count={25} color="rgba(168, 85, 247, 0.4)" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none z-[5]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-8 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              {t.hero.eyebrow}
            </div>
            <h1
              ref={titleRef}
              className={cn(
                "font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.1]",
                "transition-transform duration-200 ease-out"
              )}
              style={{
                transform: `translate(${mouseX}px, ${mouseY}px)`,
                willChange: 'transform'
              }}
            >
              {t.hero.title}
            </h1>
            <p
              ref={introRef}
              className="font-body text-lg sm:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed mb-10"
            >
              {t.hero.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Section - "Our Approach" (Moved Here to Match Services Flow) */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">{t.methodology.title}</h2>
                <div className="h-0.5 w-12 bg-logo-alto mx-auto opacity-20" />
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-px bg-slate-200 z-0" />

              {t.methodology.steps.map((step, idx) => (
                <ScrollReveal key={idx} delay={idx * 150} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 mb-6 shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary group-hover:scale-110">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-slate-600 font-body text-sm max-w-[240px] leading-relaxed">{step.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Expertise Grid */}
      <ExpertiseGrid areas={t.areas} />

      {/* Industries Spotlight */}
      <IndustrySpotlight />

      {/* Leadership & Impact */}
      <section className="py-24 lg:py-32 bg-[#0B0F14] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1725] to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
                {t.leadershipTitle}
              </h2>
              <p className="font-body text-lg lg:text-xl text-slate-400/90 font-light mb-16 max-w-3xl mx-auto">
                {t.leadershipDescription}
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-16">
                {t.metrics.map((metric, i) => (
                  <div key={i} className="flex flex-col items-center group">
                    <span className="text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">{metric.value}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/60 transition-colors">{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-16">
                <Link
                  to="/contact"
                  className="inline-flex items-center text-sm font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 group border border-white/10 hover:bg-white/5 hover:border-white/30 px-10 py-5 rounded-sm"
                >
                  <span>{language === 'ar' ? "ابدأ العمل معنا" : "Work With Us"}</span>
                  <ArrowRight size={18} className={`ml-3 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
