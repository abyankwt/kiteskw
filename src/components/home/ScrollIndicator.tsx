import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LottiePlayer } from "@/components/ui/LottiePlayer";

export function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(true);
    const { language } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    };

    // Animated scroll down indicator
    const scrollAnimationUrl = "https://lottie.host/0eb5b0a7-dbfc-4b95-bfb3-3c8cf4c50bf5/aXy0iJdGAf.json";

    return (
        <button
            onClick={handleClick}
            className={cn(
                "absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer group transition-opacity duration-500",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <span className="text-xs lg:text-sm uppercase tracking-widest text-white/70 group-hover:text-white/90 transition-colors font-semibold">
                {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll to Explore'}
            </span>
            <div className="w-8 h-8">
                <LottiePlayer
                    animationData={scrollAnimationUrl}
                    loop={true}
                    autoplay={true}
                    speed={0.8}
                    ariaLabel="Scroll down indicator"
                    className="w-full h-full opacity-70 group-hover:opacity-90 transition-opacity"
                />
            </div>
        </button>
    );
}
