import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getIconByName } from "@/lib/iconUtils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceItem {
    id: string;
    icon: string;
    category: string;
    title: string;
    solves: string;
    how: string[];
    outcomes: string[];
}

interface ServicesBentoGridProps {
    services: ServiceItem[];
}

export const ServicesBentoGrid = ({ services }: ServicesBentoGridProps) => {
    const { isRTL } = useLanguage();

    return (
        <section className="py-20 lg:py-32 bg-[#0B0F14] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
                    {services.map((service, index) => {
                        const Icon = getIconByName(service.icon);

                        // Layout Logic:
                        // 1st item (Prototype) -> Large (2 cols on desktop)
                        // 2nd item (Consultation) -> Tall (Row span 2)? No, let's keep it simple first
                        // Let's make the first item span 2 cols to create a "Hero Service" feel, or alternate.
                        // Actually, Software Distribution (technology) might deserve a unique spot.

                        // Simple robust layout:
                        // Item 0 (Prototype): col-span-2
                        // Item 1 (Consultation): col-span-1
                        // Item 2 (Training): col-span-1
                        // Item 3 (Software): col-span-2

                        const isWide = index === 0 || index === 3;

                        return (
                            <ScrollReveal
                                key={service.id}
                                className={`group relative rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${isWide ? 'md:col-span-2' : ''}`}
                            >
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="p-8 lg:p-10 flex flex-col h-full relative z-10">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                            {Icon ? <Icon size={28} strokeWidth={1.5} /> : <div className="w-7 h-7 bg-gray-500/20 rounded-full" />}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                                            {service.category}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-auto">
                                        <h3 className="font-heading text-2xl lg:text-3xl font-bold !text-white mb-4 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="font-body text-base !text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
                                            {service.solves}
                                        </p>
                                    </div>

                                    {/* Features Preview (Mini Tags) */}
                                    <div className="mt-8 mb-8 flex flex-wrap gap-2">
                                        {service.outcomes.slice(0, 3).map((outcome, i) => (
                                            <span key={i} className="text-[10px] font-bold uppercase tracking-wide text-white/30 px-2 py-1 bg-white/5 rounded-sm">
                                                {outcome}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action */}
                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <Link
                                            to={`/services/${service.id}`}
                                            className="absolute inset-0 z-20 focus:outline-none"
                                            aria-label={`Learn more about ${service.title}`}
                                        />
                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                            {isRTL ? "عرض التفاصيل" : "Explore Service"}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:translate-x-1 transition-all">
                                            <ArrowRight size={14} className={`text-white ${isRTL ? 'rotate-180' : ''}`} />
                                        </div>
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
