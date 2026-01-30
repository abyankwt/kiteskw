import { Shield, Award, Globe, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function TrustBadges() {
    const { language } = useLanguage();

    const badges = {
        en: [
            { icon: Shield, text: "ISO Certified Partner" },
            { icon: Award, text: "500+ Engineers Trained" },
            { icon: Globe, text: "GCC Regional Leader" },
            { icon: CheckCircle, text: "Trusted by 30+ Enterprises" }
        ],
        ar: [
            { icon: Shield, text: "شريك معتمد ISO" },
            { icon: Award, text: "تدريب +500 مهندس" },
            { icon: Globe, text: "رائد في منطقة الخليج" },
            { icon: CheckCircle, text: "موثوق من +30 مؤسسة" }
        ]
    };

    const currentBadges = badges[language];

    return (
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 mt-8 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            {currentBadges.map((badge, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                    <badge.icon className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" strokeWidth={2} />
                    <span className="text-[10px] lg:text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors uppercase tracking-wide">
                        {badge.text}
                    </span>
                </div>
            ))}
        </div>
    );
}
