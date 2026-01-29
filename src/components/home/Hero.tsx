import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { HeroKPI } from "@/components/home/HeroKPI";
import { FlowFieldCanvas } from "@/components/home/FlowFieldCanvas";
import { EcosystemNav } from "@/components/home/EcosystemNav";
import { gsap } from "@/lib/gsap";

export function Hero() {
    const { language, isRTL } = useLanguage();
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    // CTA Refs
    const primaryBtnRef = useRef<HTMLButtonElement>(null);
    const primaryArrowRef = useRef<SVGSVGElement>(null);
    const secondaryLinkRef = useRef<HTMLAnchorElement>(null);
    const secondaryTextRef = useRef<HTMLSpanElement>(null);
    const secondaryLineRef = useRef<HTMLSpanElement>(null);

    // Initial Load Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
            });

            // Set initial state to avoid FOUC
            // Constraint: Animate from y: 12px → y: 0
            gsap.set(".hero-element", { autoAlpha: 0, y: 12 });

            tl.to(".hero-element",
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.1, // Constraint: 100ms stagger
                }
            );

            // Secondary CTA: Fade in after primary with delay (Mobile hierarchy)
            if (secondaryLinkRef.current) {
                gsap.fromTo(secondaryLinkRef.current,
                    { autoAlpha: 0, y: 8 },
                    { autoAlpha: 1, y: 0, duration: 0.7, delay: 1.2, ease: "cubic-bezier(0.4, 0, 0.2, 1)" }
                );
            }

            // Flow field fade in separately
            gsap.fromTo(".flow-field-bg",
                { opacity: 0 },
                { opacity: 0.2, duration: 1.5, ease: "power2.out", delay: 0.2 }
            );

        }, heroRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setScrollY(window.scrollY);
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const content = {
        en: {
            headline: "SIMULATE EVERYTHING",
            description: "Advanced simulation, training, and sustainability solutions trusted by engineering leaders across the GCC.",
            ctaPrimary: "Talk to Our Experts",
            ctaSecondary: "Explore Capabilities",
        },
        ar: {
            headline: "حاكي كل شيء",
            description: "حلول محاكاة وتدريب واستدامة متطورة موثوقة من قادة الهندسة في دول مجلس التعاون الخليجي.",
            ctaPrimary: "تحدث إلى خبرائنا",
            ctaSecondary: "استكشف القدرات",
        },
    }[language];

    return (
        <section
            ref={heroRef}
            className="relative min-h-[100dvh] pt-[calc(var(--header-height)+40px)] bg-gradient-to-b from-[#0B0F14] via-[#0E141B] to-[#0B0F14] overflow-hidden flex flex-col justify-center z-10"
        >

            {/* 0. LAYER: Background Video - Z-0 (Responsive) */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/website_final_video.webm" type="video/webm" />
            </video>

            {/* 0.5 LAYER: Mobile Video Overlay - Z-1 (Readability) */}
            <div className="absolute inset-0 z-1 bg-black/40 md:bg-transparent pointer-events-none" />

            {/* 1. LAYER: Background Noise - Z-2 */}
            <div className="absolute inset-0 pointer-events-none z-2 opacity-[0.03]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* 2. LAYER: Flow Field Visual - Z-10 */}
            <div
                className="flow-field-bg absolute inset-0 z-10 opacity-0 transition-transform duration-75 ease-out will-change-transform"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            >
                <FlowFieldCanvas />
            </div>

            {/* 2.5 LAYER: Enhanced Contrast Gradient - Z-15 */}
            <div className="absolute inset-0 z-15 bg-gradient-to-r from-[#0B1015] via-[#0B1015]/80 to-transparent pointer-events-none" />


            {/* 3. LAYER: Content - Z-20 */}
            <div
                className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-center h-full min-h-[inherit]"
            // Constraint: No parallax transform on parent container
            >

                <div className={cn(
                    "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center",
                    isRTL ? "text-right" : "text-left"
                )}>

                    {/* Main Content Column - Full viewport on mobile */}
                    <div className={cn(
                        "lg:col-span-8 flex flex-col justify-center relative z-20",
                        "min-h-[calc(100vh-var(--header-height))] md:min-h-0", // Full viewport on mobile only
                        "mt-14 md:mt-0", // Increased breathing room for mobile
                        "max-lg:text-center max-lg:items-center"
                    )}>

                        {/* Headline Block */}
                        <div className="mb-6 lg:mb-8">
                            {/* Primary Headline */}
                            <h1 className="hero-element font-heading font-extrabold text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.0] sm:leading-[0.9] tracking-tighter text-white mb-4 lg:mb-6 uppercase"
                                style={{
                                    textRendering: 'geometricPrecision',
                                    WebkitFontSmoothing: 'antialiased',
                                }}>
                                {content.headline}
                            </h1>

                            {/* Description */}
                            <p className="hero-element font-body text-base sm:text-lg lg:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mb-10">
                                {content.description}
                            </p>

                            {/* CTAs */}
                            <div className="hero-element flex flex-col sm:flex-row items-center gap-7 sm:gap-6 w-full sm:w-auto">
                                {/* Primary CTA */}
                                <Link to="/contact" className="w-full sm:w-auto">
                                    <button
                                        ref={primaryBtnRef}
                                        onMouseEnter={() => {
                                            gsap.to(primaryBtnRef.current, { y: -2, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                            gsap.to(primaryArrowRef.current, { x: 5, duration: 0.18, delay: 0.04, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                        }}
                                        onMouseLeave={() => {
                                            gsap.to(primaryBtnRef.current, { y: 0, scale: 1, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                            gsap.to(primaryArrowRef.current, { x: 0, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                        }}
                                        onMouseDown={() => gsap.to(primaryBtnRef.current, { y: 0, scale: 0.98, duration: 0.12, ease: "cubic-bezier(0.4, 0, 0.2, 1)" })}
                                        onMouseUp={() => gsap.to(primaryBtnRef.current, { scale: 1, duration: 0.14, ease: "cubic-bezier(0.4, 0, 0.2, 1)" })}
                                        onTouchStart={() => {
                                            // Mobile: Tap feedback
                                            gsap.to(primaryBtnRef.current, { scale: 0.98, duration: 0.12, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                            gsap.to(primaryArrowRef.current, { x: 6, duration: 0.15, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                        }}
                                        onTouchEnd={() => {
                                            gsap.to(primaryBtnRef.current, { scale: 1, duration: 0.16, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                            gsap.to(primaryArrowRef.current, { x: 0, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                        }}
                                        className="relative w-full sm:w-auto sm:min-w-[180px] h-[56px] sm:h-12 px-8 bg-white text-slate-950 hover:bg-slate-100 transition-colors duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center rounded-sm text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white"
                                    >
                                        <span>{content.ctaPrimary}</span>
                                        <ArrowRight
                                            ref={primaryArrowRef}
                                            className={cn("w-4 h-4 transition-none",
                                                isRTL ? "mr-2 rotate-180" : "ml-2"
                                            )}
                                        />
                                    </button>
                                </Link>

                                {/* Secondary CTA */}
                                <Link
                                    ref={secondaryLinkRef}
                                    to="/services"
                                    onMouseEnter={() => {
                                        gsap.to(secondaryTextRef.current, { x: 4, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                        gsap.to(secondaryLineRef.current, { scaleX: 1, duration: 0.22, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onMouseLeave={() => {
                                        gsap.to(secondaryTextRef.current, { x: 0, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                        gsap.to(secondaryLineRef.current, { scaleX: 0, duration: 0.22, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onTouchStart={() => {
                                        // Mobile Tap Feedback: Underline expands
                                        gsap.to(secondaryLineRef.current, { scaleX: 1, duration: 0.18, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    onTouchEnd={() => {
                                        gsap.to(secondaryLineRef.current, { scaleX: 0, delay: 0.15, duration: 0.22, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
                                    }}
                                    className="group/secondary relative inline-flex items-center justify-center w-full sm:w-auto text-xs sm:text-sm font-light text-white/50 hover:text-white transition-colors duration-300 min-h-[44px]"
                                >
                                    <span ref={secondaryTextRef} className="inline-block relative">
                                        {content.ctaSecondary}
                                        {/* Mobile: Subtle default underline for affordance */}
                                        <span className="md:hidden absolute bottom-[-2px] left-0 w-full h-px bg-white/20" />
                                    </span>
                                    <span
                                        ref={secondaryLineRef}
                                        className="absolute bottom-[-2px] left-0 w-full h-px bg-white/60 origin-left scale-x-0" // GSAP controls scale
                                    />
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Ecosystem Navigation Column - Desktop position */}
                    <div className="hidden lg:flex lg:col-span-4 lg:col-start-9 justify-center items-center h-full min-h-[400px] animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <EcosystemNav />
                    </div>
                </div>

                {/* Mobile Ecosystem Navigation - Separate section below hero */}
                <div className="lg:hidden relative z-20 mt-20 pt-12 w-full">
                    {/* Subtle fade separator */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <EcosystemNav />
                </div>

                {/* KPI Strip */}
                {/* Constraint: Stats container independent from hero text animations (removed hero-element class) */}
                <div className="relative z-20 mt-8 lg:mt-12 pt-4 lg:pt-8 w-full">
                    <HeroKPI startDelay={100} />
                </div>

            </div>


        </section >
    );
}
