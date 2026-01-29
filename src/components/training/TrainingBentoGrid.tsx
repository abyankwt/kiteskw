import { Award, Briefcase, Cpu, Globe, GraduationCap, MonitorPlay } from "lucide-react";

export function TrainingBentoGrid() {
    return (
        <section className="py-24 bg-[#0B0F14] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">Why Choose KITES</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Engineering Excellence Redefined</h2>
                    <p className="text-slate-400 text-lg">
                        We don't just teach software; we build careers. Our training methodology is designed for rapid skill acquisition and professional impact.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(250px,auto)]">
                    {/* Large Card: 2 Cols */}
                    <div className="md:col-span-2 bg-[#151921] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <MonitorPlay size={200} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">simulation-Driven Learning</h3>
                                <p className="text-slate-400 max-w-md">
                                    Forget theory-heavy lectures. Our courses are 80% hands-on simulation labs using industry-standard tools like ANSYS, Abaqus, and SolidWorks.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tall Card: 1 Col, 2 Rows? No, keep it simple grid */}
                    <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Award size={150} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Certified Instructors</h3>
                            <p className="text-slate-400 text-sm">
                                Learn from certified experts with 10+ years of field experience in oil & gas and construction.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                                <Glode size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Global Recognition</h3>
                            <p className="text-slate-400 text-sm">
                                Our certifications are recognized by major engineering firms across the GCC region.
                            </p>
                        </div>
                    </div>

                    {/* Large Card: 2 Cols (Bottom) */}
                    <div className="md:col-span-2 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6">
                                <Briefcase size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Career Placement Support</h3>
                            <p className="text-blue-100/80">
                                Top performers get direct referrals to our partner network of engineering firms in Kuwait and Saudi Arabia.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10 text-center">
                            <div className="text-3xl font-bold text-white mb-1">92%</div>
                            <div className="text-xs text-blue-200 uppercase tracking-widest">Placement Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Icon wrapper for Globe since lucide might export it differently or I typo'd
function Glode(props: any) {
    return <Globe {...props} />
}
