import { Boxes, MessageSquare, GraduationCap, Package, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { ConsultingVisual, SoftwareVisual, PrototypingVisual, TrainingVisual } from "./ServiceVisuals";

// Service-specific color themes
const serviceThemes = {
  consultation: {
    gradient: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
    hoverBorder: 'hover:border-blue-500/40',
    spotlightColor: 'rgba(59, 130, 246, 0.08)',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    accent: 'text-blue-600',
  },
  'software-distribution': {
    gradient: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-50',
    iconBorder: 'border-purple-100',
    hoverBorder: 'hover:border-purple-500/40',
    spotlightColor: 'rgba(168, 85, 247, 0.08)',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    accent: 'text-purple-600',
  },
  'prototype-development': {
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-50',
    iconBorder: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-500/40',
    spotlightColor: 'rgba(16, 185, 129, 0.08)',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    accent: 'text-emerald-600',
  },
  training: {
    gradient: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-50',
    iconBorder: 'border-orange-100',
    hoverBorder: 'hover:border-orange-500/40',
    spotlightColor: 'rgba(249, 115, 22, 0.08)',
    glowColor: 'rgba(249, 115, 22, 0.25)',
    accent: 'text-orange-600',
  },
} as const;

const content = {
  en: {
    eyebrow: "WHAT WE DO",
    label: "Our Services",
    subtitle: "Integrated engineering services supporting analysis, validation, training, and long-term capability development.",
    coreLabel: "Core Service",
    trustText: "Trusted by engineering teams across energy, manufacturing, infrastructure, and academia.",
    sectionCta: {
      prompt: "Not sure which service fits your challenge?",
      button: "Request an Engineering Assessment",
    },
    services: [
      {
        id: "consultation",
        title: "Engineering & Sustainability Consulting",
        challenge: "Typical Challenge: Complex engineering or environmental decisions with high uncertainty",
        description: "Address complex engineering and environmental challenges through simulation-led analysis, expert assessment, and strategic guidance.",
        cta: "Explore consulting approach",
        icon: MessageSquare,
      },
      {
        id: "software-distribution",
        title: "Simulation Software & Platforms",
        challenge: "Typical Challenge: Selecting and adopting the right simulation platforms",
        description: "Enable effective use of world-leading engineering and simulation platforms through guided selection, onboarding, and long-term support.",
        cta: "View supported platforms",
        icon: Package,
      },
      {
        id: "prototype-development",
        title: "Simulation-Driven Prototyping",
        challenge: "Typical Challenge: Validating designs before physical investment",
        description: "Transform early concepts into validated, simulation-backed engineering solutions ready for real-world application.",
        cta: "See validation workflow",
        icon: Boxes,
      },
      {
        id: "training",
        title: "Professional Engineering Training",
        challenge: "Typical Challenge: Building internal engineering capability and software proficiency",
        description: "Build internal engineering capability through structured professional and academic training aligned with real project needs.",
        cta: "View training programs",
        icon: GraduationCap,
      },
    ],
  },
  ar: {
    eyebrow: "ماذا نقدم",
    label: "خدماتنا",
    subtitle: "خدمات هندسية متكاملة تدعم التحليل والتحقق والتدريب وتطوير القدرات طويلة المدى.",
    coreLabel: "الخدمة الأساسية",
    trustText: "موثوق به من قبل الفرق الهندسية في قطاعات الطاقة والتصنيع والبنية التحتية والأوساط الأكاديمية.",
    sectionCta: {
      prompt: "غير متأكد أي خدمة تناسب تحديك؟",
      button: "اطلب تقييماً هندسياً",
    },
    services: [
      {
        id: "consultation",
        title: "استشارات الهندسة والاستدامة",
        challenge: "التحدي النموذجي: قرارات هندسية أو بيئية معقدة مع عدم يقين عالٍ",
        description: "معالجة التحديات الهندسية والبيئية المعقدة من خلال التحليل القائم على المحاكاة والتقييم المتخصص والتوجيه الاستراتيجي.",
        cta: "استكشف نهج الاستشارات",
        icon: MessageSquare,
      },
      {
        id: "software-distribution",
        title: "برمجيات ومنصات المحاكاة",
        challenge: "التحدي النموذجي: اختيار واعتماد منصات المحاكاة المناسبة",
        description: "تمكين الاستخدام الفعال لمنصات الهندسة والمحاكاة الرائدة عالمياً من خلال الاختيار الموجه والإعداد والدعم طويل المدى.",
        cta: "عرض المنصات المدعومة",
        icon: Package,
      },
      {
        id: "prototype-development",
        title: "النمذجة القائمة على المحاكاة",
        challenge: "التحدي النموذجي: التحقق من التصاميم قبل الاستثمار المادي",
        description: "تحويل المفاهيم المبكرة إلى حلول هندسية معتمدة على المحاكاة وجاهزة للتطبيق الفعلي.",
        cta: "شاهد سير عمل التحقق",
        icon: Boxes,
      },
      {
        id: "training",
        title: "التدريب الهندسي المهني",
        challenge: "التحدي النموذجي: بناء القدرات الهندسية الداخلية وإتقان البرمجيات",
        description: "بناء القدرات الهندسية الداخلية من خلال تدريب مهني وأكاديمي منظم يتماشى مع احتياجات المشاريع الحقيقية.",
        cta: "عرض برامج التدريب",
        icon: GraduationCap,
      },
    ],
  },
};

// --- Enhanced Interactive Card Component with Theming ---
const SpotlightCard = ({
  children,
  to,
  className,
  theme,
  serviceTitle
}: {
  children: React.ReactNode;
  to: string;
  className?: string;
  theme: typeof serviceThemes[keyof typeof serviceThemes];
  serviceTitle: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    // Enhanced Tilt Effect
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3; // Increased from 2 to 3deg
    const rotateY = ((x - centerX) / centerX) * 3;

    gsap.to(divRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    // Reset rotation
    gsap.to(divRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  return (
    <div ref={divRef} style={{ perspective: '1200px' }} className="h-full">
      <Link
        to={to}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Learn more about ${serviceTitle}`}
        className={cn(
          "relative block h-full overflow-hidden rounded-sm border bg-white hover:shadow-2xl transition-all duration-300 group",
          theme.border,
          theme.hoverBorder,
          className
        )}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Colored Spotlight Gradient Overlay */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            opacity: opacity * 0.6,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${theme.spotlightColor}, transparent 40%)`,
          }}
        />

        {/* Colored Border Glow */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            opacity: opacity * 0.8,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${theme.glowColor}, transparent 40%)`,
            maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
            WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '2px', // Border width
          }}
        />

        {/* Top accent gradient bar */}
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300", theme.gradient)} />

        <div className="relative h-full p-8 lg:p-10">{children}</div>
      </Link>
    </div>
  );
};


export function ServicesSection() {
  const { language } = useLanguage();
  const t = content[language];
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(".services-header",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Services Stagger
      gsap.fromTo(".service-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Bottom CTA
      gsap.fromTo(".services-cta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".services-cta",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-24 lg:py-36 bg-[#2A2C2B] relative overflow-hidden">
      {/* Enhanced Background with Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Enhanced Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-900/8 via-purple-900/5 to-transparent -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-slate-900/20 to-transparent -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="services-header text-center mb-16 opacity-0">
          <div className="accent-line mx-auto mb-8 bg-white/30" style={{ width: '3rem', height: '1px' }} />
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-[0.25em] mb-4">
            {t.eyebrow}
          </span>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-6">
            {t.label}
          </h2>
          <p className="font-body text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Services Grid - 4 Cards */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {t.services.map((service, index) => {
            const theme = serviceThemes[service.id as keyof typeof serviceThemes];
            return (
              <div
                key={service.id}
                className="service-card opacity-0 h-full"
              >
                <SpotlightCard
                  to={`/services/${service.id}`}
                  theme={theme}
                  serviceTitle={service.title}
                >
                  <div className="flex flex-col h-full items-start text-left transition-all duration-300 ease-executive">
                    {/* Icon / Micro-Visual - Enhanced Size */}
                    <div className={cn(
                      "w-20 h-20 border rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 ease-executive relative z-10 shadow-sm",
                      theme.iconBg,
                      theme.iconBorder
                    )}>
                      {service.id === 'consultation' && <ConsultingVisual />}
                      {service.id === 'software-distribution' && <SoftwareVisual />}
                      {service.id === 'prototype-development' && <PrototypingVisual />}
                      {service.id === 'training' && <TrainingVisual />}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-lg lg:text-xl font-semibold text-gray-900 mb-3 group-hover:font-bold transition-all duration-300 leading-tight">
                      {service.title}
                    </h3>

                    {/* Description - Improved contrast */}
                    <p className="font-body text-sm text-slate-700 leading-relaxed mb-6 line-clamp-4">
                      {service.description}
                    </p>

                    {/* Service-Specific CTA - Enhanced visibility */}
                    <div className="mt-auto w-full pt-6 border-t border-gray-100 flex items-center justify-between group-hover/card transition-colors">
                      <span className={cn(
                        "text-sm font-bold uppercase tracking-wider transition-colors",
                        "text-gray-500 group-hover:opacity-100",
                        theme.accent
                      )}>
                        {service.cta}
                      </span>
                      <div className={cn(
                        "w-9 h-9 rounded-md flex items-center justify-center transition-all duration-300",
                        "bg-gray-100 text-gray-500 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110"
                      )}>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 text-center opacity-90">
          <p className="font-body text-sm text-slate-500 italic">
            {t.trustText}
          </p>
        </div>

        {/* Section-Level CTA */}
        <div className="services-cta text-center mt-24 pt-12 border-t border-white/5 opacity-0">
          <p className="font-body text-base text-slate-400 mb-4">
            {t.sectionCta.prompt}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-sm text-sm font-bold transition-all duration-300 ease-executive group border border-transparent bg-white text-slate-950 hover:bg-slate-200"
          >
            <span>{t.sectionCta.button}</span>
            <ArrowRight
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:mr-2 rtl:ml-0 rtl:group-hover:-translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
