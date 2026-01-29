import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ProcessStep {
    title: string;
    desc: string;
}

export const ConsultingProcess = ({ steps }: { steps: ProcessStep[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pin the left content while scrolling through steps
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: ".process-left",
                scrub: true
            });

            // Animate progress bar
            gsap.fromTo(progressBarRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 0.5
                    }
                }
            );

            // Animate steps appearing
            gsap.utils.toArray(".process-step").forEach((step: any, i) => {
                gsap.fromTo(step,
                    { opacity: 0.2, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: step,
                            start: "top center",
                            end: "bottom center",
                            toggleActions: "play reverse play reverse",
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-24 bg-slate-950 text-white overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-900 to-transparent opacity-50" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">

                    {/* Left Panel: Sticky Title */}
                    <div className="process-left md:w-1/3 md:h-screen flex flex-col justify-center py-12">
                        <h2 className="font-heading text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            Engineering <br />
                            <span className="text-slate-500">Methodology</span>
                        </h2>
                        <p className="font-body text-lg text-slate-400 max-w-sm">
                            A rigorous, physics-first approach to solving complex industrial challenges.
                        </p>
                        <div className="mt-12 hidden md:block w-px h-64 bg-slate-800 relative">
                            <div ref={progressBarRef} className="w-full bg-emerald-500 absolute top-0 left-0" />
                        </div>
                    </div>

                    {/* Right Panel: Scrollable Steps */}
                    <div className="md:w-2/3 py-24 space-y-32">
                        {steps.map((step, i) => (
                            <div key={i} className="process-step flex gap-8 group">
                                <div className="hidden md:flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center font-heading font-bold text-xl group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors duration-500">
                                        {i + 1}
                                    </div>
                                    <div className="w-px h-full bg-slate-800 my-4 group-last:hidden" />
                                </div>

                                <div className="flex-1 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors duration-500">
                                    <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-4 text-emerald-400">
                                        {step.title}
                                    </h3>
                                    <p className="font-body text-lg text-slate-300 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};
