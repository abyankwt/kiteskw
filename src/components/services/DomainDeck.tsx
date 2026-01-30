import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DomainItem {
    title: string;
    desc: string;
    icon?: LucideIcon;
    capabilities?: string[];
}

export const DomainDeck = ({ items }: { items: DomainItem[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray(".domain-card");
            const totalWidth = 400 * sections.length; // Approx width

            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (sections.length - 1),
                    end: () => "+=" + (containerRef.current?.scrollWidth || 3000)
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-12">
                <h2 className="font-heading text-3xl font-bold text-slate-900">Fields of Expertise</h2>
                <p className="text-slate-500">Horizontal expertise across 10 critical domains.</p>
            </div>

            <div ref={containerRef} className="flex px-4 md:px-8 gap-8 w-[400%] md:w-auto">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={i}
                            className="domain-card flex-shrink-0 w-[85vw] md:w-[400px] h-[500px] bg-white rounded-3xl border border-slate-200 p-8 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-8 text-slate-900">
                                {Icon && <Icon size={32} strokeWidth={1.5} />}
                            </div>

                            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                            <p className="font-body text-slate-500 mb-8 flex-1">{item.desc}</p>

                            {item.capabilities && (
                                <div className="space-y-2 border-t border-slate-100 pt-6">
                                    {item.capabilities.slice(0, 4).map((cap, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {cap}
                                        </div>
                                    ))}
                                    {item.capabilities.length > 4 && (
                                        <p className="text-xs text-slate-400 mt-2">+{item.capabilities.length - 4} more capabilities</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
