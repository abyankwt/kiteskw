import { useRef, useLayoutEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { gsap } from "@/lib/gsap";
import { CustomEase } from "gsap/all";
import { LottiePlayer } from "@/components/ui/LottiePlayer";
import { celebrationAnimations } from "@/lib/lottieAnimations";

// Register CustomEase if not already registered globally, or just use the cubic-bezier string directly in ease
gsap.registerPlugin(CustomEase);

interface KPI {
    id: string;
    value: number;
    suffix: string;
    label: {
        en: string;
        ar: string;
    };
}

const kpiData: KPI[] = [
    {
        id: "engineers",
        value: 80,
        suffix: "+",
        label: { en: "ENGINEERS TRAINED", ar: "مهندس تم تدريبهم" },
    },
    {
        id: "clients",
        value: 30,
        suffix: "+",
        label: { en: "ENTERPRISE CLIENTS", ar: "عميل مؤسسي" },
    },
    {
        id: "partners",
        value: 10,
        suffix: "+",
        label: { en: "GLOBAL PARTNERS", ar: "شريك عالمي" },
    },
    {
        id: "countries",
        value: 7,
        suffix: "",
        label: { en: "COUNTRIES SERVED", ar: "دول نخدمها" },
    },
];

interface HeroKPIProps {
    startDelay?: number;
}

export function HeroKPI({ startDelay = 0 }: HeroKPIProps) {
    const { language } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const completedCountRef = useRef(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Container Entrance & Positioning (Shift up -24px)
            gsap.fromTo(containerRef.current,
                { y: 16, opacity: 0 },
                {
                    y: -24,
                    opacity: 1,
                    duration: 0.8,
                    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
                    delay: startDelay / 1000
                }
            );

            if (itemsRef.current.length) {
                itemsRef.current.forEach((item, index) => {
                    if (!item) return;

                    const valueElement = item.querySelector('.kpi-value');
                    const accentElement = item.querySelector('.kpi-accent');
                    const dataValue = kpiData[index].value;

                    // Animate the counter value only
                    const counter = { val: 0 };
                    const tl = gsap.timeline({
                        delay: startDelay / 1000 + (index * 0.1),
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 85%",
                            once: true,
                        },
                    });

                    // 1. Accent In
                    tl.to(accentElement, {
                        scaleX: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    }, 0);

                    // 2. Count Up
                    tl.to(counter, {
                        val: dataValue,
                        duration: 1.4,
                        ease: CustomEase.create("custom", "0.4, 0, 0.2, 1"),
                        onUpdate: () => {
                            if (valueElement) {
                                valueElement.textContent = Math.floor(counter.val).toString();
                            }
                        },
                        onComplete: () => {
                            // Enhancement #4: Glow effect on completion
                            const glowElement = item.querySelector('.kpi-glow');
                            if (glowElement) {
                                gsap.set(glowElement, { opacity: 0 });
                                gsap.to(glowElement, {
                                    opacity: 0.6,
                                    duration: 0.4,
                                    ease: "power2.out",
                                    onComplete: () => {
                                        gsap.to(glowElement, {
                                            opacity: 0,
                                            duration: 0.8,
                                            ease: "power2.in"
                                        });
                                    }
                                });
                            }

                            // Trigger celebration when all KPIs complete
                            completedCountRef.current += 1;
                            if (completedCountRef.current === kpiData.length) {
                                setShowCelebration(true);
                                setTimeout(() => setShowCelebration(false), 2500);
                            }
                        }
                    }, 0);

                    // 3. Accent Out (Fade)
                    tl.to(accentElement, {
                        opacity: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    }, ">-0.4");
                });
            }

        }, containerRef);

        return () => ctx.revert();
    }, [startDelay]);

    return (
        <div
            ref={containerRef}
            className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-24 pointer-events-auto relative"
        >
            {/* Celebration Lottie Overlay */}
            {showCelebration && (
                <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64">
                        <LottiePlayer
                            animationData={celebrationAnimations.confetti}
                            loop={false}
                            autoplay={true}
                            ariaLabel="Celebration animation"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            )}

            <div className="w-full p-6 lg:p-10 border border-[rgba(255,255,255,0.22)] rounded-[10px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 relative z-20">
                    {kpiData.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => (itemsRef.current[index] = el)}
                            className="flex flex-col items-center sm:items-start text-center sm:text-left"
                        >
                            <span className="font-heading font-bold text-4xl lg:text-5xl text-white mb-2 tabular-nums relative block">
                                <span className="kpi-value">0</span>{item.suffix}
                                <span className="kpi-accent absolute -bottom-1 left-0 w-full h-[2px] bg-white/30 origin-left scale-x-0 opacity-0" />
                                {/* Glow effect - Enhancement #4 */}
                                <span className="kpi-glow absolute inset-0 bg-blue-400/20 blur-xl opacity-0 pointer-events-none" />
                            </span>
                            <span className="kpi-label font-body font-medium text-sm tracking-widest text-white/60 uppercase">
                                {language === "ar" ? item.label.ar : item.label.en}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
