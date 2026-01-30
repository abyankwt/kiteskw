import { useEffect, useRef, useState, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, CheckCircle2, Search, X, Filter, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Re-export the enhanced version
export { TrainingTimelineEnhanced } from "./TrainingTimelineEnhanced";

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
    const { language } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Extract unique categories from the courses
    const categories = useMemo(() => {
        const categorySet = new Set<string>();
        courses.forEach((course) => {
            // Extract category from title or description
            // For now, using a simple categorization based on keywords
            const text = `${course.title} ${course.description}`.toLowerCase();
            if (text.includes('solidworks') || text.includes('cad') || text.includes('modeling')) categorySet.add('CAD Design');
            if (text.includes('cfd') || text.includes('fluid') || text.includes('dynamics')) categorySet.add('Fluid Dynamics');
            if (text.includes('fea') || text.includes('finite') || text.includes('structural')) categorySet.add('Simulation');
            if (text.includes('hvac') || text.includes('thermal') || text.includes('mep')) categorySet.add('MEP Systems');
            if (text.includes('environmental') || text.includes('sustainability') || text.includes('lca')) categorySet.add('Sustainability');
            if (text.includes('matlab') || text.includes('minitab') || text.includes('programming')) categorySet.add('Programming');
            if (text.includes('electric') || text.includes('electrical') || text.includes('wiring')) categorySet.add('Electrical');
            if (text.includes('geotechnical')) categorySet.add('Civil Engineering');
            if (!Array.from(categorySet).some(cat => text.includes(cat.toLowerCase()))) categorySet.add('Other');
        });
        return Array.from(categorySet).sort();
    }, [courses]);

    // Filter courses based on search and category
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchQuery === "" ||
                course.title.toLowerCase().includes(searchLower) ||
                course.description.toLowerCase().includes(searchLower) ||
                course.outline.some((item: string) => item.toLowerCase().includes(searchLower));

            // Category filter
            const matchesCategory = selectedCategory === "all" || (() => {
                const text = `${course.title} ${course.description}`.toLowerCase();
                const catLower = selectedCategory.toLowerCase();
                return text.includes(catLower.split(' ')[0].toLowerCase());
            })();

            return matchesSearch && matchesCategory;
        });
    }, [courses, searchQuery, selectedCategory]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Line
            if (lineRef.current && filteredCourses.length > 0) {
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
            }

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
    }, [filteredCourses]);

    return (
        <section className="py-24 bg-white overflow-hidden" id="curriculum">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto mb-12 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        {language === 'en' ? 'Training Curriculum' : 'المناهج التدريبية'}
                    </h2>
                    <p className="font-body text-xl text-slate-500 max-w-2xl mx-auto">
                        {language === 'en'
                            ? 'A structured path designed to take your team from fundamentals to advanced mastery.'
                            : 'مسار منظم مصمم لنقل فريقك من الأساسيات إلى الإتقان المتقدم.'}
                    </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="max-w-4xl mx-auto mb-16 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={language === 'en' ? 'Search courses...' : 'البحث عن الدورات...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl font-body text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory === "all"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {language === 'en' ? 'All Courses' : 'جميع الدورات'} ({courses.length})
                        </button>
                        {categories.map((category) => {
                            const count = courses.filter(c => {
                                const text = `${c.title} ${c.description}`.toLowerCase();
                                return text.includes(category.toLowerCase().split(' ')[0].toLowerCase());
                            }).length;

                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        selectedCategory === category
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    {category} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Results Counter */}
                    <div className="text-center text-sm text-slate-500 font-medium">
                        {language === 'en'
                            ? `Showing ${filteredCourses.length} of ${courses.length} courses`
                            : `عرض ${filteredCourses.length} من ${courses.length} دورة`}
                    </div>
                </div>

                {/* Timeline */}
                {filteredCourses.length > 0 ? (
                    <div ref={containerRef} className="relative max-w-5xl mx-auto">
                        {/* The Center Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2">
                            <div ref={lineRef} className="w-full bg-slate-900 origin-top" />
                        </div>

                        {filteredCourses.map((course, index) => (
                            <TimelineItem
                                key={index}
                                {...course}
                                index={index}
                                isLast={index === filteredCourses.length - 1}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-slate-400" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                            {language === 'en' ? 'No courses found' : 'لم يتم العثور على دورات'}
                        </h3>
                        <p className="text-slate-500">
                            {language === 'en'
                                ? 'Try adjusting your search or filters'
                                : 'حاول تعديل البحث أو الفلاتر'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
