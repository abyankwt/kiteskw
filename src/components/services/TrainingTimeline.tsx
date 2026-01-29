import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";

interface TimelineItemProps {
    title: string;
    duration: string;
    description: string;
    outline: string[];
    index: number;
    isLast: boolean;
}

const TimelineItem = ({ title, duration, description, outline, index, isLast }: TimelineItemProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const isEven = index % 2 === 0;

    return (
        <div ref={itemRef} className={cn(
            "timeline-item relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full mb-24 md:mb-32 opacity-0",
            isEven ? "md:text-right" : "md:text-left"
        )}>
            {/* Center Line Dot */}
            <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 -translate-x-1/2 z-20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-500 timeline-dot transition-all duration-500" />
            </div>

            {/* Content Side */}
            <div className={cn(
                "col-span-1 pl-12 md:pl-0",
                isEven ? "md:order-1 md:pr-16" : "md:order-2 md:pl-16"
            )}>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-3">{title}</h3>
                <div className={cn(
                    "flex items-center gap-2 mb-4 text-emerald-600 font-medium text-sm uppercase tracking-wider",
                    isEven ? "md:justify-end" : "md:justify-start"
                )}>
                    <Clock size={16} />
                    <span>{duration}</span>
                </div>
                <p className="font-body text-slate-500 leading-relaxed mb-6 text-lg">{description}</p>

                {/* Outline Preview */}
                <div className={cn(
                    "flex flex-wrap gap-2",
                    isEven ? "md:justify-end" : "md:justify-start"
                )}>
                    {outline.slice(0, 3).map((topic, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                            {topic}
                        </span>
                    ))}
                    {outline.length > 3 && (
                        <span className="px-3 py-1 bg-white text-slate-400 rounded-full text-xs font-medium border border-slate-100">
                            +{outline.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Visual Side (Placeholder for now, could be an image or icon later) */}
            <div className={cn(
                "hidden md:flex flex-col justify-center",
                isEven ? "md:order-2 md:pl-16 md:items-start" : "md:order-1 md:pr-16 md:items-end"
            )}>
                <div className="w-full max-w-sm h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border border-slate-100 flex items-center justify-center group hover:scale-[1.02] transition-transform duration-500 shadow-sm">
                    <BookOpen size={48} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export const TrainingTimeline = ({ courses }: { courses: any[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Line
            gsap.fromTo(lineRef.current,
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1
                    }
                }
            );

            // Animate Items
            const items = gsap.utils.toArray(".timeline-item");
            items.forEach((item: any) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-centermax-w-3xl mx-auto mb-20 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">Curriculum Journey</h2>
                    <p className="font-body text-xl text-slate-500 max-w-2xl mx-auto">
                        A structured path designed to take your team from fundamentals to advanced mastery.
                    </p>
                </div>

                <div ref={containerRef} className="relative max-w-5xl mx-auto">
                    {/* The Center Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2">
                        <div ref={lineRef} className="w-full bg-slate-900 origin-top" />
                    </div>

                    {courses.map((course, index) => (
                        <TimelineItem
                            key={index}
                            {...course}
                            index={index}
                            isLast={index === courses.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
