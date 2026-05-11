import { Award, Briefcase, Cpu, Globe } from "lucide-react";

interface FeatureItem {
    title: string;
    description: string;
    stat?: string;
    stat_label?: string;
}

interface TrainingBentoGridProps {
    tagline?: string;
    heading?: string;
    subtitle?: string;
    features?: FeatureItem[];
}

const DEFAULT_FEATURES: FeatureItem[] = [
    { title: "Simulation-Driven Learning",  description: "Forget theory-heavy lectures. Our courses are 80% hands-on simulation labs using industry-standard tools like ANSYS, Abaqus, and SolidWorks." },
    { title: "Certified Instructors",        description: "Learn from certified experts with 10+ years of field experience in oil & gas and construction." },
    { title: "Global Recognition",           description: "Our certifications are recognized by major engineering firms across the GCC region." },
    { title: "Career Placement Support",     description: "Top performers get direct referrals to our partner network of engineering firms in Kuwait and Saudi Arabia.", stat: "92%", stat_label: "Placement Rate" },
];

export function TrainingBentoGrid({
    tagline  = 'Why Choose KITES',
    heading  = 'Engineering Excellence Redefined',
    subtitle = "We don't just teach software; we build careers. Our training methodology is designed for rapid skill acquisition and professional impact.",
    features = DEFAULT_FEATURES,
}: TrainingBentoGridProps = {}) {
    const [f0, f1, f2, f3] = [
        features[0] ?? DEFAULT_FEATURES[0],
        features[1] ?? DEFAULT_FEATURES[1],
        features[2] ?? DEFAULT_FEATURES[2],
        features[3] ?? DEFAULT_FEATURES[3],
    ];

    return (
        <section className="py-24 bg-[#0B0F14] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">{tagline}</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">{heading}</h2>
                    <p className="text-slate-400 text-lg">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(250px,auto)]">
                    {/* Large card (2 cols) — Feature 0 */}
                    <div className="md:col-span-2 bg-[#151921] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Cpu size={200} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{f0.title}</h3>
                                <p className="text-slate-400 max-w-md">{f0.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Small card — Feature 1 */}
                    <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Award size={150} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{f1.title}</h3>
                            <p className="text-slate-400 text-sm">{f1.description}</p>
                        </div>
                    </div>

                    {/* Small card — Feature 2 */}
                    <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{f2.title}</h3>
                            <p className="text-slate-400 text-sm">{f2.description}</p>
                        </div>
                    </div>

                    {/* Large card (2 cols) — Feature 3 (Career Placement) */}
                    <div className="md:col-span-2 bg-blue-900/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                <Briefcase size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{f3.title}</h3>
                            <p className="text-blue-100/80">{f3.description}</p>
                        </div>
                        {f3.stat && (
                            <div className="w-full md:w-1/3 bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10 text-center">
                                <div className="text-3xl font-bold text-white mb-1">{f3.stat}</div>
                                <div className="text-xs text-blue-200 uppercase tracking-widest">{f3.stat_label}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
