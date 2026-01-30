import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";

import { useRef, useEffect } from "react";
import { ArrowRight, CheckCircle2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { getIconByName } from "@/lib/iconUtils";
import { cn } from "@/lib/utils";
import { ServicesBentoGrid } from "@/components/services/ServicesBentoGrid";

const content = {
  en: {
    hero: {
      title: "Engineering Services",
      intro: "Integrated simulation, training, and consulting solutions designed to build lasting organizational capability.",
    },
    approach: {
      label: "Our Approach",
      steps: [
        { label: "Assess", icon: "Target", desc: "Understand requirements and organizational readiness." },
        { label: "Train", icon: "BookOpen", desc: "Build foundational and advanced competencies." },
        { label: "Implement", icon: "Settings", desc: "Deploy solutions with hands-on support." },
        { label: "Support", icon: "HeartHandshake", desc: "Ensure long-term adoption and success." },
      ]
    },
    services: [
      {
        id: "prototype-development",
        icon: "Cpu",
        category: "Engineering",
        title: "Prototype Development",
        solves: "Validate technical concepts before production through simulation-driven prototyping—reducing risk and supporting engineering innovation.",
        how: [
          "Technical feasibility and concept validation",
          "High-fidelity digital twin development",
          "Iterative simulation-driven refinement"
        ],
        outcomes: ["Reduced Uncertainty", "Workflow Optimization", "Design Reliability"]
      },
      {
        id: "consultation",
        icon: "LineChart",
        category: "Consulting",
        title: "Engineering Consultation",
        solves: "Expert advisory to help organizations navigate technical complexity and make evidence-based engineering decisions.",
        how: [
          "Institutional process assessment",
          "Simulation technology strategy",
          "Workflow integration and optimization"
        ],
        outcomes: ["Process Excellence", "Strategic Clarity", "Technical Readiness"]
      },
      {
        id: "training",
        icon: "GraduationCap",
        category: "Capability Building",
        title: "Professional Training",
        solves: "Establish and scale simulation competency—from foundational engineering skills to advanced system mastery.",
        how: [
          "Industry-certified curriculum delivery",
          "Custom organizational capability mapping",
          "Ongoing technical competency development"
        ],
        outcomes: ["Sustainable Adoption", "Institutional Knowledge", "Operational Capacity"]
      },
      {
        id: "software-distribution",
        icon: "Leaf",
        category: "Technology",
        title: "Simulation Technology",
        solves: "Access proven engineering platforms selected based on objective requirements rather than vendor preference.",
        how: [
          "Requirements-led platform selection",
          "Multi-vendor technology integration",
          "Deployment and technical support"
        ],
        outcomes: ["Right-Fit Technology", "Integrated Workflow", "Long-Term Capability"]
      }
    ],
    cta: {
      bridge: {
        text: "Our engineering team provides comprehensive assessments to determine organizational simulation requirements.",
        btn: "Request a Technical Assessment"
      },
      final: {
        trust: "Established partner to academic, government, and industrial entities across the GCC region",
        title: "Ready to establish advanced engineering capability?",
        btn: "Contact KITES"
      }
    }
  },
  ar: {
    hero: {
      title: "الخدمات الهندسية",
      intro: "حلول متكاملة للمحاكاة والتدريب والاستشارات مصممة لبناء قدرات مؤسسية دائمة.",
    },
    approach: {
      label: "منهجيتنا",
      steps: [
        { label: "تقييم", icon: "Target", desc: "فهم المتطلبات والجاهزية المؤسسية." },
        { label: "تدريب", icon: "BookOpen", desc: "بناء الكفاءات الأساسية والمتقدمة." },
        { label: "تنفيذ", icon: "Settings", desc: "نشر الحلول مع دعم عملي." },
        { label: "دعم", icon: "HeartHandshake", desc: "ضمان التبني والنجاح طويل المدى." },
      ]
    },
    services: [
      {
        id: "prototype-development",
        icon: "Cpu",
        category: "هندسة",
        title: "تطوير النماذج الأولية",
        solves: "التحقق من المفاهيم التقنية قبل الإنتاج من خلال النمذجة القائمة على المحاكاة — لتقليل المخاطر ودعم الابتكار الهندسي.",
        how: [
          "الجدوى التقنية والتحقق من المفاهيم",
          "تطوير التوائم الرقمية عالية الدقة",
          "التحسين الفني التكراري القائم على المحاكاة"
        ],
        outcomes: ["تقليل عدم اليقين", "تحسين سير العمل", "وثوقية التصميم"]
      },
      {
        id: "consultation",
        icon: "LineChart",
        category: "استشارات",
        title: "الاستشارات الهندسية",
        solves: "توجيه استشاري متخصص لمساعدة المؤسسات على التنقل في التعقيدات التقنية واتخاذ قرارات هندسية قائمة على الأدلة.",
        how: [
          "تقييم العمليات المؤسسية",
          "استراتيجية تقنيات المحاكاة",
          "تكامل وتحسين سير العمل"
        ],
        outcomes: ["تميز العمليات", "وضوح استراتيجي", "الجاهزية التقنية"]
      },
      {
        id: "training",
        icon: "GraduationCap",
        category: "بناء القدرات",
        title: "التدريب المهني",
        solves: "تأسيس وتوسيع كفاءات المحاكاة — من المهارات الهندسية الأساسية إلى الإتقان المتقدم للأنظمة.",
        how: [
          "تقديم مناهج معتمدة صناعياً",
          "رسم خرائط القدرات المؤسسية المخصصة",
          "تطوير الكفاءات التقنية المستمر"
        ],
        outcomes: ["تبني مستدام", "معرفة مؤسسية", "القدرة التشغيلية"]
      },
      {
        id: "software-distribution",
        icon: "Leaf",
        category: "تقنية",
        title: "تقنية المحاكاة",
        solves: "الوصول إلى منصات هندسية مثبتة مختارة بناءً على متطلبات موضوعية بدلاً من تفضيل البائع.",
        how: [
          "اختيار المنصات بناءً على المتطلبات",
          "تكامل التقنيات متعددة البائعين",
          "النشر والدعم الفني"
        ],
        outcomes: ["التقنية المناسبة", "سير عمل متكامل", "قدرات طويلة المدى"]
      }
    ],
    cta: {
      bridge: {
        text: "يوفر فريقنا الهندسي تقييمات شاملة لتحديد متطلبات المحاكاة المؤسسية.",
        btn: "اطلب تقييماً فنياً"
      },
      final: {
        trust: "شريك مؤسس للكيانات الأكاديمية والحكومية والصناعية في منطقة الخليج",
        title: "مستعد لبناء القدرات الهندسية المتقدمة؟",
        btn: "تواصل مع كايتس"
      }
    }
  },
};



const Services = () => {
  const { language, isRTL } = useLanguage();
  const t = content[language];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep existing animations if they are still relevant, or simplified.
    // The Bento Grid handles its own scroll reveal.
    // We only need the methodology line animation if we keep that section.
    const ctx = gsap.context(() => {
      gsap.fromTo(".methodology-line",
        { scaleX: 0, transformOrigin: isRTL ? "right center" : "left center" },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".methodology-section",
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [isRTL]);

  return (
    <div ref={containerRef} className="bg-background">
      <SEO page="services" />
      <SkipLink />

      {/* Dark Premium Hero */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-24 bg-black relative overflow-hidden">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-8 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {t.hero.title}
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.1] max-w-4xl mx-auto">
              Engineering Excellence, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Delivered.</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              {t.hero.intro}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-100 font-bold tracking-wide"
                onClick={() => document.getElementById('offerings')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {language === 'ar' ? "استكشف خدماتنا" : "Explore Services"}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Methodology Section (Retained as "Our Philosophy" Bridge) */}
      <section className="methodology-section py-20 lg:py-28 bg-white border-b border-gray-100 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">{t.approach.label}</h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </ScrollReveal>

          <StaggerContainer className="relative max-w-5xl mx-auto" staggerDelay={100}>
            {/* Connector Line */}
            <div className="methodology-line hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gray-100 z-0 origin-left" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {t.approach.steps.map((step, index) => (
                <StaggerItem key={index} index={index}>
                  <div className="relative z-10 flex flex-col items-center text-center group">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                      <div className="text-slate-400 group-hover:text-primary transition-colors">
                        {(() => {
                          const StepIcon = getIconByName(step.icon);
                          return <StepIcon size={28} strokeWidth={1.2} />;
                        })()}
                      </div>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">{step.label}</h3>
                    <p className="font-body text-xs text-slate-500 max-w-[140px] mx-auto">{step.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Main Services Bento Grid */}
      <div id="offerings">
        <ServicesBentoGrid services={t.services} />
      </div>

      {/* CTA Section (Retained Dark Theme) */}
      <section className="py-32 lg:py-48 bg-[#0B0F14] text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 mb-10">
              {t.cta.final.trust}
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-14 tracking-tighter leading-[1.1]">
              {t.cta.final.title}
            </h2>
            <Link
              to="/contact"
              className="inline-flex items-center text-sm font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 group border border-white/10 hover:bg-white/5 hover:border-white/30 px-10 py-5 rounded-sm"
            >
              <span>{t.cta.final.btn}</span>
              <ArrowRight size={18} className={`ml-3 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default Services;
