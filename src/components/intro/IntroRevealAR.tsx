import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import splashLogo from "@/assets/branding/splash_logo.png";
import { LottiePlayer } from "@/components/ui/LottiePlayer";

interface IntroRevealARProps {
    onComplete: () => void;
}

export function IntroRevealAR({ onComplete }: IntroRevealARProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const charsRef = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        // Set body background to site black to prevent white flash
        const originalBackground = document.body.style.background;
        document.body.style.background = "#0B0F14";
        document.body.style.overflow = "hidden";

        const container = containerRef.current;
        const logo = logoRef.current;
        const text = textRef.current;

        if (!container || !logo || !text) return;

        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            gsap.set([logo, text], { opacity: 1, scale: 1, y: 0 });
            setTimeout(() => {
                gsap.to(container, {
                    opacity: 0,
                    duration: 0.1,
                    onComplete: () => {
                        document.body.style.overflow = "";
                        onComplete();
                    }
                });
            }, 1000);
            return;
        }

        // Create timeline
        const tl = gsap.timeline({
            onComplete: () => {
                // Cleanup
                document.body.style.overflow = "";
                // Delay restoring background slightly
                setTimeout(() => {
                    document.body.style.background = originalBackground;
                }, 200);
                onComplete();
            }
        });

        // 1. Logo fades in (scale 0.9 -> 1)
        tl.fromTo(logo,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
        );

        // 2. Arabic name animates in (fade up)
        if (charsRef.current.length > 0) {
            tl.fromTo(charsRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: "power3.out"
                },
                "-=0.6"
            );
        } else {
            // Fallback if char splitting fails
            tl.fromTo(text,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.6"
            );
        }

        // 3. Hold
        tl.to({}, { duration: 0.6 });

        // 4. Fade out entire intro
        tl.to(container, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        });

        return () => {
            tl.kill();
            document.body.style.overflow = "";
            document.body.style.background = originalBackground;
        };

    }, [onComplete]);

    const arabicText = "معهد الكويت للتدريب والمحاكاة الهندسية";
    // Split for animation
    const splitText = arabicText.split("");

    // Subtle particle animation for splash background
    const particlesUrl = "https://lottie.host/3bf5632e-7cd9-4c25-873e-c4cbdbd6c0e2/qPYSdNCk3M.json";

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F14] text-white"
            aria-hidden="true"
        >
            {/* Subtle Background Particles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <LottiePlayer
                    animationData={particlesUrl}
                    loop={true}
                    autoplay={true}
                    speed={0.5}
                    lazyLoad={false}
                    ariaLabel="Background animation"
                />
            </div>

            {/* Logo */}
            <div className="relative mb-8 md:mb-10 z-10">
                <img
                    ref={logoRef}
                    src={splashLogo}
                    alt="KITES"
                    className="w-[120px] md:w-[150px] lg:w-[220px] h-auto object-contain opacity-0"
                />
            </div>

            {/* Arabic Text */}
            <h1
                ref={textRef}
                className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-center px-4 leading-relaxed relative z-10"
                dir="rtl"
            >
                {splitText.map((char, index) => (
                    <span
                        key={index}
                        ref={el => { if (el) charsRef.current[index] = el }}
                        className="inline-block"
                        style={{ minWidth: char === " " ? "0.3em" : "0" }}
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
}
