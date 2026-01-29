import { useRef, useEffect } from "react";
import { TrainingRoadmapScene } from "@/components/3d/TrainingRoadmapScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export const TrainingRoadmapSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    progressRef.current = self.progress;
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative h-[300vh] bg-[#0B0F14]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <div className="absolute top-8 left-8 z-10 pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Curriculum Structure</span>
                    <h2 className="text-3xl font-heading font-bold text-white mt-2">Engineering Growth Path</h2>
                </div>

                <div className="w-full h-full">
                    <TrainingRoadmapScene progressRef={progressRef} />
                </div>

                {/* Mobile Overlay / Alternative could go here */}
                {/* For now, just render grid on top or keep it simple */}
            </div>
        </section>
    );
};
