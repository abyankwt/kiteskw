import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Star, Users, TrendingUp, Award, Briefcase, Target } from 'lucide-react';

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    color: string;
    delay?: number;
}

const StatCard = ({ icon, value, suffix = '', prefix = '', label, color, delay = 0 }: StatCardProps) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="relative group"
        >
            <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                {/* Background Glow */}
                <div
                    className={`absolute -top-10 -right-10 w-32 h-32 ${color} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
                />

                {/* Icon */}
                <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg relative z-10`}>
                    {icon}
                </div>

                {/* Value with CountUp */}
                <div className="relative z-10">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                        {prefix}
                        {inView && (
                            <CountUp
                                start={0}
                                end={value}
                                duration={2.5}
                                separator=","
                                decimals={suffix === '/5' ? 1 : 0}
                                decimal="."
                            />
                        )}
                        {suffix}
                    </div>
                    <div className="text-slate-600 font-medium">{label}</div>
                </div>

                {/* Decorative Element */}
                <motion.div
                    className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-slate-100 to-transparent rounded-tl-full opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
        </motion.div>
    );
};

export const EnhancedStatsSection = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const stats = [
        {
            icon: <Users className="text-white" size={28} />,
            value: 500,
            suffix: '+',
            label: 'Engineers Trained',
            color: 'bg-blue-600',
        },
        {
            icon: <Star className="text-white" size={28} />,
            value: 4.9,
            suffix: '/5',
            label: 'Average Rating',
            color: 'bg-yellow-500',
        },
        {
            icon: <Award className="text-white" size={28} />,
            value: 98,
            suffix: '%',
            label: 'Satisfaction Rate',
            color: 'bg-emerald-600',
        },
        {
            icon: <Briefcase className="text-white" size={28} />,
            value: 85,
            suffix: '%',
            label: 'Career Advancement',
            color: 'bg-purple-600',
        },
        {
            icon: <Target className="text-white" size={28} />,
            value: 92,
            suffix: '%',
            label: 'Course Completion',
            color: 'bg-orange-600',
        },
        {
            icon: <TrendingUp className="text-white" size={28} />,
            value: 45,
            suffix: '%',
            prefix: '+',
            label: 'Avg Salary Growth',
            color: 'bg-rose-600',
        },
    ];

    return (
        <section ref={ref} className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

            {/* Decorative Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                        Proven Track Record
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
                        Why Engineering Professionals Choose KITES
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Join hundreds of satisfied engineers who have accelerated their careers with our world-class training programs.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} delay={index * 0.1} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-600 text-sm">
                        🏆 Recognized as Kuwait's leading engineering training provider
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
