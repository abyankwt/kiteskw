import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { CheckCircle2, Award, Zap, Target } from "lucide-react";

export const SkillBentoGrid = ({ items }: { items: string[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".bento-card",
                { opacity: 0, scale: 0.9, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "cubic-bezier(0.2, 0, 0.2, 1)",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Helper to pick an icon based on index (cycling through a set)
    const getIcon = (i: number) => {
        const icons = [CheckCircle2, Award, Zap, Target];
        const Icon = icons[i % icons.length];
        return <Icon className="w-8 h-8 text-white mb-4 opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />;
    };

    // Helper for varying cell sizes to create "Bento" look
    const getSpanClass = (i: number) => {
        // Pattern: Big, Small, Small, Big...
        const pattern = [
            "md:col-span-2 md:row-span-2", // Big
            "md:col-span-1 md:row-span-1",
            "md:col-span-1 md:row-span-1",
            "md:col-span-2 md:row-span-1", // Wide
            "md:col-span-1 md:row-span-2", // Tall
            "md:col-span-1 md:row-span-1",
        ];
        return pattern[i % pattern.length];
    };

    // Helper for varying background gradients
    const getBgClass = (i: number) => {
        const bgs = [
            "bg-gradient-to-br from-slate-900 to-slate-800",
            "bg-gradient-to-br from-slate-800 to-slate-700",
            "bg-gradient-to-br from-neutral-900 to-neutral-800",
        ];
        return bgs[i % bgs.length];
    };

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">What You'll Achieve</h2>
                    <p className="font-body text-slate-500 max-w-2xl mx-auto">
                        Tangible skills and outcomes your team will take away.
                    </p>
                </div>

                <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto auto-rows-[200px]">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={cn(
                                "bento-card group relative p-8 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-default",
                                getSpanClass(i),
                                getBgClass(i)
                            )}
                        >
                            {/* Hover Reveal Effect */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    {getIcon(i)}
                                    <h3 className="font-heading text-xl font-bold text-white leading-tight">
                                        {item}
                                    </h3>
                                </div>
                                <div className="w-8 h-1 bg-white/20 rounded-full group-hover:w-full transition-all duration-500 delay-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
