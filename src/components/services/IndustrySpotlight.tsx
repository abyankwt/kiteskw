import { useRef, useState, useEffect } from "react";
import { LucideIcon, Factory, Landmark, GraduationCap, Building2, Fuel, Cpu, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustryItem {
    name: string;
    icon: LucideIcon;
}

const DEFAULT_INDUSTRIES: IndustryItem[] = [
    { name: "Oil & Gas", icon: Fuel },
    { name: "Infrastructure", icon: Building2 },
    { name: "Manufacturing", icon: Factory },
    { name: "Academia", icon: GraduationCap },
    { name: "Public Sector", icon: Landmark },
    { name: "Technology", icon: Cpu },
    { name: "Defense", icon: Globe },
];

const SpotlightCard = ({ name, icon: Icon, index }: { name: string; icon: LucideIcon; index: number }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 px-4 py-8 shadow-2xl transition-transform hover:scale-[1.02]"
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 shadow-inner group-hover:text-white transition-colors duration-500">
                    <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-300">
                    {name}
                </h3>
            </div>

            {/* Subtle Grid Background */}
            <div
                className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
                style={{ opacity: 0.05 }}
            />
        </div>
    );
};

export const IndustrySpotlight = ({ items = DEFAULT_INDUSTRIES }: { items?: IndustryItem[] }) => {
    return (
        <section className="py-24 lg:py-32 bg-[#0B0F14] relative overflow-hidden">
            {/* Section Header */}
            <div className="container mx-auto px-4 mb-16 text-center relative z-10">
                <h2 className="font-heading text-3xl font-bold text-white mb-4">
                    Industries We Empower
                </h2>
                <div className="h-1 w-12 bg-white/20 rounded-full mx-auto" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Responsive Grid: 2 cols mobile, 3 tablet, 7 desktop (for single row) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    {items.map((item, i) => (
                        <SpotlightCard key={i} {...item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};
