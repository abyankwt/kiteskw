import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

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
            <ChevronDown
                className="w-6 h-6 text-white/70 group-hover:text-white/90 transition-all animate-bounce"
                strokeWidth={2.5}
            />
        </button>
    );
}
