import { useRef, useLayoutEffect, useState } from "react";
import { Cpu, Cog, GraduationCap, Leaf, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const content = {
    en: {
        pillarsLabel: "Strategic Foundation",
        heading: "The Four Pillars of KITES",
        pillars: [
            {
                id: "simulation",
                title: "Simulation Expertise",
                description: "Leveraging state-of-the-art computational fluid dynamics (CFD) and finite element analysis (FEA) to predict real-world performance with digital precision.",
                icon: Cpu,
                color: "text-blue-500",
                bg: "bg-blue-500",
                gradient: "from-blue-500/20 to-blue-500/5",
            },
            {
                id: "engineering",
                title: "Engineering Consulting",
                description: "Solving complex industrial challenges through advanced engineering methodologies, process optimization, and data-driven technical consultancy.",
                icon: Cog,
                color: "text-slate-600",
                bg: "bg-slate-600",
                gradient: "from-slate-600/20 to-slate-600/5",
            },
            {
                id: "training",
                title: "Training Excellence",
                description: "Empowering the next generation of engineers with world-class capability building, authorized certifications, and hands-on simulation mastery.",
                icon: GraduationCap,
                color: "text-amber-500",
                bg: "bg-amber-500",
                gradient: "from-amber-500/20 to-amber-500/5",
            },
            {
                id: "sustainability",
                title: "Sustainable Solutions",
                description: "Driving environmental stewardship through energy-efficient design, lifecycle assessment (LCA), and green technology integration.",
                icon: Leaf,
                color: "text-emerald-500",
                bg: "bg-emerald-500",
                gradient: "from-emerald-500/20 to-emerald-500/5",
            },
        ],
    },
    ar: {
        pillarsLabel: "الأساس الاستراتيجي",
        heading: "ركائز كايتس الأربعة",
        pillars: [
            {
                id: "simulation",
                title: "الخبرة في المحاكاة",
                description: "الاستفادة من أحدث ديناميكيات الموائع الحسابية (CFD) وتحليل العناصر المحدودة (FEA) للتنبؤ بالأداء الواقعي بدقة رقمية.",
                icon: Cpu,
                color: "text-blue-500",
                bg: "bg-blue-500",
                gradient: "from-blue-500/20 to-blue-500/5",
            },
            {
                id: "engineering",
                title: "الاستشارات الهندسية",
                description: "حل التحديات الصناعية المعقدة من خلال المنهجيات الهندسية المتقدمة، وتحسين العمليات، والاستشارات الفنية القائمة على البيانات.",
                icon: Cog,
                color: "text-slate-600",
                bg: "bg-slate-600",
                gradient: "from-slate-600/20 to-slate-600/5",
            },
            {
                id: "training",
                title: "التميز في التدريب",
                description: "تمكين الجيل القادم من المهندسين من خلال بناء القدرات عالمية المستوى، والشهادات المعتمدة، وإتقان المحاكاة العملية.",
                icon: GraduationCap,
                color: "text-amber-500",
                bg: "bg-amber-500",
                gradient: "from-amber-500/20 to-amber-500/5",
            },
            {
                id: "sustainability",
                title: "الحلول المستدامة",
                description: "قيادة الإشراف البيئي من خلال التصميم الموفر للطاقة، وتقييم دورة الحياة (LCA)، وتكامل التكنولوجيا الخضراء.",
                icon: Leaf,
                color: "text-emerald-500",
                bg: "bg-emerald-500",
                gradient: "from-emerald-500/20 to-emerald-500/5",
            },
        ],
    },
};

export function KeyPillarsSection() {
    const { language, isRTL } = useLanguage();
    const t = content[language];
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useLayoutEffect(() => {
        // Ensure the trigger element exists before creating ScrollTrigger
        if (!triggerRef.current) return;

        let ctx: ReturnType<typeof gsap.context> | null = null;

        // Use requestAnimationFrame to ensure DOM is fully ready and painted
        const rafId = requestAnimationFrame(() => {
            // Double-check the ref still exists after RAF
            if (!triggerRef.current) return;

            ctx = gsap.context(() => {
                try {
                    // ScrollTrigger for pinning and scrubbing
                    ScrollTrigger.create({
                        trigger: triggerRef.current,
                        start: "top top",
                        end: "+=300%", // 300% / 4 slides = ~75% viewport per slide scroll duration
                        pin: true,
                        scrub: 0.5,
                        onUpdate: (self) => {
                            // Calculate active index based on scroll progress (0-1)
                            // We have 4 items, so we split progress into 4 segments
                            // 0.00-0.25 -> 0
                            // 0.25-0.50 -> 1
                            // 0.50-0.75 -> 2
                            // 0.75-1.00 -> 3
                            const idx = Math.min(
                                t.pillars.length - 1,
                                Math.floor(self.progress * t.pillars.length)
                            );
                            setActiveIndex(idx);
                        }
                    });
                } catch (error) {
                    console.error("ScrollTrigger initialization error:", error);
                }
            }, triggerRef);
        });

        // CRITICAL: Clean up BOTH the RAF and the GSAP context
        return () => {
            cancelAnimationFrame(rafId);
            if (ctx) {
                ctx.revert();
            }
        };
    }, [language, t.pillars.length]);

    // Current active pillar data
    const activePillar = t.pillars[activeIndex];

    return (
        // The trigger container (tall height for scrolling room)
        <div ref={triggerRef} className="relative bg-slate-50">

            {/* The Pinned Content (100vh) */}
            <div ref={containerRef} className="h-screen w-full flex flex-col justify-center overflow-hidden relative">

                {/* Background Ambient Gradient - Morphing (Full Width) */}
                <div
                    className={cn(
                        "absolute inset-0 opacity-20 transition-colors duration-700 ease-in-out pointer-events-none",
                        `bg-gradient-to-br ${activePillar.gradient} to-transparent`
                    )}
                />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center justify-center relative z-10">

                    {/* Left Column: Visual Interaction */}
                    <div className={cn(
                        "w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 order-1 md:order-none",
                        isRTL ? "md:order-2" : "md:order-1"
                    )}>
                        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] flex items-center justify-center">

                            {/* Central Orb / Pulse */}
                            <div className={cn(
                                "absolute inset-0 rounded-full opacity-10 transition-colors duration-700",
                                activePillar.bg
                            )} />

                            <div className={cn(
                                "absolute inset-4 rounded-full border opacity-20 transition-colors duration-700",
                                isRTL ? "border-l-4" : "border-r-4",
                                activePillar.color.replace('text-', 'border-')
                            )} style={{
                                animation: "spin-slow 20s linear infinite"
                            }} />

                            <div className={cn(
                                "absolute inset-16 rounded-full border border-dashed opacity-30 transition-colors duration-700",
                                activePillar.color.replace('text-', 'border-')
                            )} style={{
                                animation: "spin-reverse-slow 25s linear infinite"
                            }} />

                            {/* Main Icon Transition */}
                            <div className="relative z-10 transform transition-all duration-500 ease-out scale-100 p-8 bg-white rounded-3xl shadow-xl border border-white/50 ring-1 ring-slate-100">
                                <activePillar.icon
                                    size={80}
                                    strokeWidth={1}
                                    className={cn(
                                        "transition-colors duration-500",
                                        activePillar.color
                                    )}
                                />
                            </div>

                            {/* Decorative Floating Elements */}
                            {t.pillars.map((p, i) => {
                                // Calculate position around circle for background icons
                                const angle = (i * (360 / t.pillars.length)) * (Math.PI / 180);
                                const radius = 160; // Distance from center
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                const isActive = i === activeIndex;

                                return (
                                    <div
                                        key={p.id}
                                        className={cn(
                                            "absolute w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-50 transition-all duration-700",
                                            isActive ? "opacity-0 scale-50" : "opacity-60 scale-90"
                                        )}
                                        style={{
                                            transform: `translate(${x}px, ${y}px)`
                                        }}
                                    >
                                        <p.icon size={20} className="text-gray-400" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>


                    {/* Right Column: Narrative Text */}
                    <div className={cn(
                        "w-full md:w-1/2 flex flex-col justify-center p-4 md:p-12 z-10 order-2 md:order-none",
                        isRTL ? "md:order-1 text-right" : "md:order-2 text-left"
                    )}>
                        <div className="mb-4">
                            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                {t.pillarsLabel}
                            </span>
                            <div className="flex gap-2 mt-2">
                                {t.pillars.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-500",
                                            i === activeIndex
                                                ? `w-8 ${activePillar.bg}`
                                                : "w-2 bg-gray-200"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="min-h-[200px] relative">
                            {t.pillars.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={cn(
                                        "absolute top-0 left-0 w-full transition-all duration-700 ease-out",
                                        i === activeIndex
                                            ? "opacity-100 translate-y-0 relative"
                                            : "opacity-0 translate-y-8 absolute pointer-events-none"
                                    )}
                                >
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                        {p.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                                        {p.description}
                                    </p>

                                    <button
                                        className={cn(
                                            "inline-flex items-center text-sm font-semibold tracking-wide transition-colors duration-300 border-b-2 border-transparent hover:border-current pb-1",
                                            p.color
                                        )}
                                    >
                                        {isRTL ? "تعرف أكثر" : "Learn more"}
                                        <ArrowRight size={16} className={cn("inline-block", isRTL ? "mr-2 rotate-180" : "ml-2")} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">
                        {isRTL ? "اسحب للاستكشاف" : "Scroll to Explore"}
                    </span>
                    <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent" />
                </div>
            </div>

        </div>
    );
}
