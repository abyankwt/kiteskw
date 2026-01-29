import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const content = {
    en: {
        hero: {
            title: "Professional Engineering Training Programs",
            subtitle: "Industry-aligned, simulation-driven training programs designed to upskill engineers, students, and organizations across the GCC.",
            primaryCTA: "Talk to Training Experts",
            secondaryCTA: "View Training Programs"
        },
        whyKites: {
            eyebrow: "What differentiates our training approach",
            title: "Why Train with KITES",
            points: [
                "Simulation-based, hands-on learning",
                "Industry-aligned curriculum",
                "Expert-led instruction",
                "Academic and industrial relevance",
                "Practical, real-world problem solving"
            ]
        },
        trainingPath: {
            title: "Help me find the right training",
            options: {
                engineer: "I am an Engineer",
                organization: "I represent an Organization",
                student: "I am a Student / Academic"
            }
        },
        programs: {
            title: "Our Training Programs",
            cta: "Explore Program",
            idealFor: "Ideal for:",
            categories: [
                {
                    id: "simulation",
                    title: "Engineering Simulation Training",
                    description: "Advanced simulation-driven training covering real-world engineering scenarios.",
                    idealFor: ["Engineers", "Students", "Academics"]
                },
                {
                    id: "software",
                    title: "Software & CAE Training",
                    description: "Specialized training on engineering software and CAE tools.",
                    idealFor: ["Engineers", "Organizations"]
                },
                {
                    id: "certification",
                    title: "Professional Certification Programs",
                    description: "Structured programs designed to enhance professional competency.",
                    idealFor: ["Engineers", "Organizations"]
                },
                {
                    id: "corporate",
                    title: "Custom Corporate Training",
                    description: "Tailored training solutions for organizations and teams.",
                    idealFor: ["Organizations"]
                },
                {
                    id: "academic",
                    title: "Academic Training Programs",
                    description: "Training programs designed for universities and academic institutions.",
                    idealFor: ["Students", "Academics"]
                }
            ]
        },
        audience: {
            title: "This training is designed for:",
            groups: [
                "Engineers",
                "Engineering students",
                "Government entities",
                "Industrial organizations",
                "Academic institutions"
            ]
        },
        finalCTA: {
            title: "Ready to upgrade skills and capabilities?",
            button: "Contact Training Team",
            confidence: "Our team will guide you to the most relevant program — no obligation."
        }
    },
    ar: {
        hero: {
            title: "برامج التدريب الهندسي الاحترافي",
            subtitle: "برامج تدريب قائمة على المحاكاة ومصممة لتمكين المهندسين والطلاب والمؤسسات في منطقة الخليج.",
            primaryCTA: "تحدث مع خبراء التدريب",
            secondaryCTA: "استعرض البرامج التدريبية"
        },
        whyKites: {
            eyebrow: "ما الذي يميز نهجنا التدريبي",
            title: "لماذا التدريب مع كايتس",
            points: [
                "تدريب قائم على المحاكاة والتطبيق العملي",
                "مناهج متوافقة مع احتياجات الصناعة",
                "تدريب بقيادة خبراء متخصصين",
                "ربط المعرفة الأكاديمية بالتطبيق الصناعي",
                "التركيز على حل التحديات الواقعية"
            ]
        },
        trainingPath: {
            title: "ساعدني في اختيار البرنامج المناسب",
            options: {
                engineer: "أنا مهندس",
                organization: "أمثل مؤسسة",
                student: "أنا طالب / أكاديمي"
            }
        },
        programs: {
            title: "برامجنا التدريبية",
            cta: "استكشف البرنامج",
            idealFor: "مناسب لـ:",
            categories: [
                {
                    id: "simulation",
                    title: "تدريب المحاكاة الهندسية",
                    description: "برامج تدريب متقدمة قائمة على المحاكاة لمعالجة تحديات هندسية واقعية.",
                    idealFor: ["المهندسين", "الطلاب", "الأكاديميين"]
                },
                {
                    id: "software",
                    title: "تدريب البرمجيات وأدوات CAE",
                    description: "تدريب متخصص على البرمجيات الهندسية وأدوات التحليل.",
                    idealFor: ["المهندسين", "المؤسسات"]
                },
                {
                    id: "certification",
                    title: "برامج الشهادات المهنية",
                    description: "برامج منظمة تهدف إلى تطوير الكفاءات المهنية.",
                    idealFor: ["المهندسين", "المؤسسات"]
                },
                {
                    id: "corporate",
                    title: "التدريب المؤسسي المخصص",
                    description: "حلول تدريب مصممة خصيصًا لتلبية احتياجات المؤسسات.",
                    idealFor: ["المؤسسات"]
                },
                {
                    id: "academic",
                    title: "البرامج التدريبية الأكاديمية",
                    description: "برامج تدريب موجهة للجامعات والمؤسسات الأكاديمية.",
                    idealFor: ["الطلاب", "الأكاديميين"]
                }
            ]
        },
        audience: {
            title: "تم تصميم هذه البرامج التدريبية من أجل:",
            groups: [
                "المهندسين",
                "طلاب الهندسة",
                "الجهات الحكومية",
                "المؤسسات الصناعية",
                "المؤسسات الأكاديمية"
            ]
        },
        finalCTA: {
            title: "هل أنت مستعد لتطوير المهارات والقدرات؟",
            button: "تواصل مع فريق التدريب",
            confidence: "سيساعدك فريقنا في اختيار البرنامج الأنسب دون أي التزام."
        }
    }
};

// Mapping for training path selector
const audienceMapping = {
    engineer: ["simulation", "software"],
    organization: ["corporate", "certification"],
    student: ["academic", "simulation"]
};

const Training = () => {
    const { language, isRTL } = useLanguage();
    const t = content[language];

    // Refs
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const primaryCTARef = useRef<HTMLAnchorElement>(null);
    const secondaryCTARef = useRef<HTMLAnchorElement>(null);
    const programsSectionRef = useRef<HTMLElement>(null);

    // State for training path selector
    const [selectedAudience, setSelectedAudience] = useState<string | null>(null);

    // Hero GSAP animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
            });

            // Set initial states
            gsap.set(titleRef.current, { autoAlpha: 0, y: 20 });
            gsap.set(subtitleRef.current, { autoAlpha: 0, y: 12 });
            gsap.set([primaryCTARef.current, secondaryCTARef.current], { autoAlpha: 0, y: 8 });

            // Animate sequence
            tl.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.8 })
                .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.6")
                .to(primaryCTARef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4")
                .to(secondaryCTARef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.5");

        }, heroRef);

        return () => ctx.revert();
    }, []);

    // Smooth scroll handler for secondary CTA
    const handleScrollToPrograms = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        programsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Check if card should be highlighted based on selected audience
    const isCardRelevant = (categoryId: string) => {
        if (!selectedAudience) return true;
        return audienceMapping[selectedAudience as keyof typeof audienceMapping]?.includes(categoryId);
    };

    return (
        <>
            <SEO page="training" />
            <SkipLink />
            <Layout>
                {/* SECTION 1 — Hero Section */}
                <section
                    ref={heroRef}
                    className="relative pt-32 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-[#0B0F14]"
                    id="main-content"
                >
                    {/* Deep Navy Gradient */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0B0F14] to-[#101826]" />
                    {/* Subtle Noise */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none z-0" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={cn("max-w-4xl mx-auto text-center", isRTL && "text-right")}>
                            <h1
                                ref={titleRef}
                                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-[1.05] tracking-tight"
                            >
                                {t.hero.title}
                            </h1>
                            <p
                                ref={subtitleRef}
                                className="font-body text-base sm:text-lg lg:text-xl text-slate-400/90 max-w-3xl mx-auto font-light px-2 sm:px-0 mb-10 lg:mb-12"
                            >
                                {t.hero.subtitle}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                                <Link
                                    ref={primaryCTARef}
                                    to="/contact?service=training"
                                    onMouseEnter={(e) => {
                                        gsap.to(e.currentTarget, { y: -2, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onMouseLeave={(e) => {
                                        gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    className="inline-flex items-center px-8 py-4 bg-white text-[#0B0F14] font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-white/90 transition-all duration-300 group shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                                >
                                    <span>{t.hero.primaryCTA}</span>
                                    <ArrowRight
                                        size={16}
                                        className={cn(
                                            "transition-transform duration-300",
                                            isRTL ? "mr-3 rotate-180 group-hover:-translate-x-1" : "ml-3 group-hover:translate-x-1"
                                        )}
                                    />
                                </Link>
                                <a
                                    ref={secondaryCTARef}
                                    href="#programs"
                                    onClick={handleScrollToPrograms}
                                    className="inline-flex items-center text-sm font-semibold text-white/90 hover:text-white transition-colors duration-300 group underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                                >
                                    <span>{t.hero.secondaryCTA}</span>
                                    <ArrowRight
                                        size={14}
                                        className={cn(
                                            "transition-transform duration-300",
                                            isRTL ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2 group-hover:translate-x-1"
                                        )}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>



                {/* SECTION 2 — Why Training at KITES */}
                <section className="py-16 sm:py-20 lg:py-28 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal className={cn("max-w-4xl mx-auto", isRTL && "text-right")}>
                            {/* Eyebrow */}
                            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 text-center">
                                {t.whyKites.eyebrow}
                            </p>
                            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-10 lg:mb-12 text-center">
                                {t.whyKites.title}
                            </h2>
                            <StaggerContainer className="grid sm:grid-cols-2 gap-6 lg:gap-8" staggerDelay={100}>
                                {t.whyKites.points.map((point, index) => (
                                    <StaggerItem
                                        key={index}
                                        index={index}
                                        className="group flex items-start gap-4 cursor-default"
                                    >
                                        <div className="shrink-0 mt-1">
                                            <CheckCircle2 className="w-5 h-5 text-logo-codgray transition-opacity duration-200 group-hover:opacity-100 opacity-80" strokeWidth={2} />
                                        </div>
                                        <p className="font-body text-base lg:text-lg text-slate-700 relative">
                                            {point}
                                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-logo-alto transition-all duration-200 group-hover:w-full" />
                                        </p>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </ScrollReveal>
                    </div>
                </section>

                {/* SECTION 3 — Training Programs with Selector */}
                <section
                    ref={programsSectionRef}
                    id="programs"
                    className="py-20 sm:py-24 lg:py-32 bg-slate-50 border-t border-slate-200/50"
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal className={cn("text-center mb-12", isRTL && "text-right")}>
                            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                {t.programs.title}
                            </h2>
                            <div className="h-px w-16 bg-logo-alto mx-auto" />
                        </ScrollReveal>

                        {/* NEW: Training Path Selector */}
                        <ScrollReveal className="max-w-3xl mx-auto mb-16">
                            <h3 className={cn(
                                "text-lg sm:text-xl font-semibold text-slate-800 mb-6 text-center",
                                isRTL && "text-right"
                            )}>
                                {t.trainingPath.title}
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {Object.entries(t.trainingPath.options).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedAudience(selectedAudience === key ? null : key)}
                                        className={cn(
                                            "flex-1 px-6 py-4 rounded-lg border-2 font-medium text-sm sm:text-base transition-all duration-300",
                                            "hover:border-logo-alto hover:shadow-md active:scale-[0.98]",
                                            selectedAudience === key
                                                ? "border-logo-alto bg-gray-50 text-logo-codgray shadow-md"
                                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </ScrollReveal>

                        {/* Training Cards */}
                        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto" staggerDelay={100}>
                            {t.programs.categories.map((category, index) => {
                                const isRelevant = isCardRelevant(category.id);

                                return (
                                    <StaggerItem key={index} index={index}>
                                        <Link
                                            to="/services/training"
                                            className={cn(
                                                "block h-full p-8 bg-white rounded-lg border border-slate-200 transition-all duration-300 group relative overflow-hidden",
                                                isRTL && "text-right",
                                                isRelevant
                                                    ? "hover:border-gray-300 hover:shadow-lg hover:scale-[1.02] opacity-100"
                                                    : "opacity-40"
                                            )}
                                        >
                                            <h3 className="font-heading text-xl font-bold text-slate-900 mb-4 group-hover:font-extrabold transition-all">
                                                {category.title}
                                            </h3>
                                            <p className="font-body text-slate-600 mb-6">
                                                {category.description}
                                            </p>

                                            {/* Ideal For - Shows on hover */}
                                            <div className={cn(
                                                "mb-4 opacity-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-hover:max-h-20",
                                                isRelevant && "group-hover:opacity-100"
                                            )}>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                                    {t.programs.idealFor}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {category.idealFor.map((item, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-logo-codgray border border-logo-alto rounded">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center text-sm font-semibold text-logo-codgray transition-colors mt-auto">
                                                <span>{t.programs.cta}</span>
                                                <ArrowRight
                                                    size={14}
                                                    className={cn(
                                                        "transition-transform duration-300",
                                                        isRTL ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2 group-hover:translate-x-1"
                                                    )}
                                                />
                                            </div>
                                        </Link>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>
                    </div>
                </section>

                {/* SECTION 4 — Who This Training Is For */}
                <section className="py-20 sm:py-24 lg:py-32 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal className={cn("max-w-3xl mx-auto", isRTL && "text-right")}>
                            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-10 lg:mb-12 text-center">
                                {t.audience.title}
                            </h2>
                            <StaggerContainer className="grid sm:grid-cols-2 gap-5 lg:gap-6" staggerDelay={80}>
                                {t.audience.groups.map((group, index) => (
                                    <StaggerItem
                                        key={index}
                                        index={index}
                                        className="group flex items-center gap-4 p-5 bg-slate-50 rounded-lg border border-slate-100 hover:translate-y-[-4px] transition-all duration-250 cursor-default hover:shadow-md peer"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-logo-codgray shrink-0 group-hover:scale-125 transition-transform duration-250" />
                                        <p className="font-body text-base lg:text-lg text-slate-800 font-medium">
                                            {group}
                                        </p>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </ScrollReveal>
                    </div>
                </section>

                {/* SECTION 5 — Final Call to Action */}
                <section className="py-28 lg:py-40 bg-[#0B0F14] text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1725] to-transparent/50 opacity-80" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <ScrollReveal>
                            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 lg:mb-12 tracking-tight leading-[1.1] max-w-3xl mx-auto">
                                {t.finalCTA.title}
                            </h2>
                            <Link
                                to="/contact?service=training"
                                className="inline-flex items-center text-sm font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 group border border-white/10 hover:bg-white/5 hover:border-white/30 px-10 py-5 rounded-sm"
                            >
                                <span>{t.finalCTA.button}</span>
                                <ArrowRight
                                    size={18}
                                    className={cn(
                                        "transition-transform duration-300",
                                        isRTL ? "mr-3 rotate-180 group-hover:-translate-x-1.5" : "ml-3 group-hover:translate-x-1.5"
                                    )}
                                />
                            </Link>

                            {/* Confidence Line */}
                            <p className="mt-8 text-sm text-white/60 max-w-2xl mx-auto">
                                {t.finalCTA.confidence}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default Training;
