import { useRef } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowUpRight } from "lucide-react";

interface PartnerItem {
    name: string;
    desc: string;
    logo: string;
    color: string;
}

interface SoftwarePartnersProps {
    data: {
        title: string;
        items: PartnerItem[];
    };
}

export const SoftwarePartners = ({ data }: SoftwarePartnersProps) => {
    return (
        <section className="py-20 lg:py-32 bg-[#0B0F14] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-20" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-20" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16 lg:mb-24">
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                        {data.title}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-80" />
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.items.map((partner, index) => (
                        <PartnerCard key={index} partner={partner} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const PartnerCard = ({ partner, index }: { partner: PartnerItem; index: number }) => {
    return (
        <div
            className="group relative h-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl"
            style={{
                // @ts-ignore
                "--brand-color": partner.color
            }}
        >
            {/* Hover Glow Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, ${partner.color}, transparent 70%)`
                }}
            />

            {/* Top Border Accent */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: partner.color }}
            />

            <div className="relative z-10 flex flex-col h-full">
                {/* Logo Area (Fallback to Text if Image Fails/Missing) */}
                <div className="h-12 mb-8 flex items-center justify-start">
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-full w-auto object-contain max-w-[160px]"
                    />
                </div>

                <div className="mt-auto">
                    <p className="font-body text-sm text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {partner.desc}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: partner.color }}>
                        <span>Partner</span>
                        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                </div>
            </div>
        </div>
    );
};
