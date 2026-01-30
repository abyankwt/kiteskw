import { Shield, Award, Users, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrustBadges() {
    const badges = [
        {
            icon: Shield,
            title: 'ISO 9001 Certified',
            description: 'Quality Management',
            color: 'blue'
        },
        {
            icon: Award,
            title: 'Industry Partners',
            description: 'SolidWorks & ANSYS',
            color: 'purple'
        },
        {
            icon: Users,
            title: '500+ Graduates',
            description: '95% Placement Rate',
            color: 'green'
        },
        {
            icon: CheckCircle2,
            title: 'Money-Back Guarantee',
            description: '100% Satisfaction',
            color: 'emerald'
        },
        {
            icon: Lock,
            title: 'Secure Payment',
            description: 'SSL Encrypted',
            color: 'slate'
        }
    ];

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'bg-blue-100 text-blue-600',
            title: 'text-blue-900',
            hover: 'group-hover:border-blue-400 group-hover:bg-blue-50'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            icon: 'bg-purple-100 text-purple-600',
            title: 'text-purple-900',
            hover: 'group-hover:border-purple-400 group-hover:bg-purple-50'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'bg-green-100 text-green-600',
            title: 'text-green-900',
            hover: 'group-hover:border-green-400 group-hover:bg-green-50'
        },
        emerald: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: 'bg-emerald-100 text-emerald-600',
            title: 'text-emerald-900',
            hover: 'group-hover:border-emerald-400 group-hover:bg-emerald-50'
        },
        slate: {
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            icon: 'bg-slate-100 text-slate-600',
            title: 'text-slate-900',
            hover: 'group-hover:border-slate-400 group-hover:bg-slate-50'
        }
    };

    return (
        <div className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Trusted by Professionals Across the GCC
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Industry-recognized certifications and partnerships that guarantee quality training
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {badges.map((badge, index) => {
                        const colors = colorClasses[badge.color as keyof typeof colorClasses];
                        const Icon = badge.icon;

                        return (
                            <motion.div
                                key={badge.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`group relative bg-white rounded-xl p-6 border-2 ${colors.border} ${colors.hover} transition-all duration-300 hover:shadow-lg hover:scale-105`}
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                {/* Title */}
                                <h3 className={`text-sm font-bold ${colors.title} text-center mb-1 leading-tight`}>
                                    {badge.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-slate-600 text-center leading-relaxed">
                                    {badge.description}
                                </p>

                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -translate-x-full pointer-events-none"></div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Additional Partner Logos */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="text-center text-sm font-semibold text-slate-600 mb-6">
                        Proud Training Partners
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
                        {/* Add actual partner logos here */}
                        <div className="px-6 py-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-lg font-bold text-slate-700">SolidWorks</span>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-lg font-bold text-slate-700">ANSYS</span>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-lg font-bold text-slate-700">MATLAB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
