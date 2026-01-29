import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CheckCircle2, Cpu, LineChart, Leaf, GraduationCap, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExpertiseArea {
    icon: string;
    title: string;
    description: string;
    outcome: string;
}

const iconMap: Record<string, LucideIcon> = {
    cpu: Cpu,
    chart: LineChart,
    leaf: Leaf,
    graduation: GraduationCap,
};

interface ExpertiseGridProps {
    areas: ExpertiseArea[];
}

export const ExpertiseGrid = ({ areas }: ExpertiseGridProps) => {
    const { isRTL } = useLanguage();

    return (
        <section className="py-20 lg:py-32 bg-[#0B1015] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none opacity-40" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
                    {areas.map((area, index) => {
                        const Icon = iconMap[area.icon] || Cpu;

                        return (
                            <ScrollReveal
                                key={index}
                                delay={index * 100}
                                className="group relative h-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 lg:p-10 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl flex flex-col"
                            >
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Top Accent Line */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

                                <div className="flex flex-col h-full relative z-10">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-inner">
                                            <Icon size={32} strokeWidth={1.5} />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs font-bold text-white/30 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                                            0{index + 1}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-heading text-2xl lg:text-3xl font-bold !text-white mb-4 group-hover:text-primary transition-colors">
                                        {area.title}
                                    </h3>
                                    <p className="font-body text-base !text-slate-400 leading-relaxed mb-8 flex-grow group-hover:text-slate-300 transition-colors">
                                        {area.description}
                                    </p>

                                    {/* Key Outcome */}
                                    <div className="mt-auto pt-6 border-t border-white/10">
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                                            <CheckCircle2 size={16} strokeWidth={2.5} />
                                            <span>{area.outcome}</span>
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
