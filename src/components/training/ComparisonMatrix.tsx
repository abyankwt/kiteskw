import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function ComparisonMatrix() {
    const features = [
        { name: 'Expert Instructor Guidance', selfLearning: false, kites: true },
        { name: 'ISO 9001 Certified Training', selfLearning: false, kites: true },
        { name: 'Hands-on Industry Projects', selfLearning: 'limited', kites: true },
        { name: 'Job Placement Assistance', selfLearning: false, kites: true },
        { name: 'Recognized Certification', selfLearning: false, kites: true },
        { name: 'Lifetime Access to Materials', selfLearning: 'maybe', kites: true },
        { name: '1-on-1 Mentorship', selfLearning: false, kites: true },
        { name: 'Industry Network Access', selfLearning: false, kites: true },
        { name: 'Real-world Case Studies', selfLearning: 'limited', kites: true },
        { name: 'Money-Back Guarantee', selfLearning: false, kites: true },
    ];

    return (
        <div className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
                    >
                        <span className="text-sm font-bold text-white">Why Choose KITES?</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Professional Training vs Self-Learning
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        See what sets our comprehensive professional training apart from trying to learn on your own
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-slate-700/50 border-b border-slate-600">
                        <div className="p-4 border-r border-slate-600">
                            <span className="text-sm font-semibold text-slate-400">Features</span>
                        </div>
                        <div className="p-4 border-r border-slate-600 text-center">
                            <span className="text-sm font-semibold text-slate-400">Self-Learning</span>
                        </div>
                        <div className="p-4 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                            <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                KITES Training
                            </span>
                        </div>
                    </div>

                    {/* Table Rows */}
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`grid grid-cols-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
                                }`}
                        >
                            {/* Feature Name */}
                            <div className="p-4 border-r border-slate-700/50">
                                <span className="text-sm text-slate-200">{feature.name}</span>
                            </div>

                            {/* Self-Learning Column */}
                            <div className="p-4 border-r border-slate-700/50 flex items-center justify-center">
                                {feature.selfLearning === false && (
                                    <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full">
                                        <X className="w-5 h-5 text-red-400" />
                                    </div>
                                )}
                                {feature.selfLearning === 'limited' && (
                                    <span className="text-xs text-yellow-400 font-medium">Limited</span>
                                )}
                                {feature.selfLearning === 'maybe' && (
                                    <span className="text-xs text-slate-400 font-medium">Maybe</span>
                                )}
                            </div>

                            {/* KITES Column */}
                            <div className="p-4 flex items-center justify-center bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                                {feature.kites && (
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
                                        <Check className="w-5 h-5 text-green-400" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <p className="text-slate-300 mb-6">
                        Invest in professional training for guaranteed results
                    </p>
                    <Link
                        to="/services/training"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
                    >
                        <span>Browse Our Courses</span>
                        <Check className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
