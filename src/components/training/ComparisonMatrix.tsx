import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FeatureRow {
    name: string;
    self_learning: 'yes' | 'no' | 'limited' | 'maybe' | boolean;
    kites: 'yes' | 'no' | boolean;
}

interface ComparisonMatrixProps {
    badgeText?: string;
    heading?: string;
    subtitle?: string;
    ctaText?: string;
    ctaNote?: string;
    features?: FeatureRow[];
}

const DEFAULT_FEATURES: FeatureRow[] = [
    { name: 'Expert Instructor Guidance',   self_learning: 'no',      kites: 'yes' },
    { name: 'ISO 9001 Certified Training',  self_learning: 'no',      kites: 'yes' },
    { name: 'Hands-on Industry Projects',   self_learning: 'limited', kites: 'yes' },
    { name: 'Job Placement Assistance',     self_learning: 'no',      kites: 'yes' },
    { name: 'Recognized Certification',     self_learning: 'no',      kites: 'yes' },
    { name: 'Lifetime Access to Materials', self_learning: 'maybe',   kites: 'yes' },
    { name: '1-on-1 Mentorship',            self_learning: 'no',      kites: 'yes' },
    { name: 'Industry Network Access',      self_learning: 'no',      kites: 'yes' },
    { name: 'Real-world Case Studies',      self_learning: 'limited', kites: 'yes' },
    { name: 'Money-Back Guarantee',         self_learning: 'no',      kites: 'yes' },
];

function selfLearningCell(val: FeatureRow['self_learning']) {
    const v = val === false ? 'no' : val === true ? 'yes' : val;
    if (v === 'no')      return <div className="flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full"><X className="w-5 h-5 text-red-400" /></div>;
    if (v === 'limited') return <span className="text-xs text-yellow-400 font-medium">Limited</span>;
    if (v === 'maybe')   return <span className="text-xs text-slate-400 font-medium">Maybe</span>;
    return <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full"><Check className="w-5 h-5 text-green-400" strokeWidth={3} /></div>;
}

export function ComparisonMatrix({
    badgeText = 'Why Choose KITES?',
    heading   = 'Professional Training vs Self-Learning',
    subtitle  = 'See what sets our comprehensive professional training apart from trying to learn on your own',
    ctaText   = 'Browse Our Courses',
    ctaNote   = 'Invest in professional training for guaranteed results',
    features  = DEFAULT_FEATURES,
}: ComparisonMatrixProps = {}) {
    return (
        <div className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full mb-4"
                    >
                        <span className="text-sm font-bold text-white">{badgeText}</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
                </div>

                <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-3 bg-slate-700/50 border-b border-slate-600">
                        <div className="p-4 border-r border-slate-600">
                            <span className="text-sm font-semibold text-slate-400">Features</span>
                        </div>
                        <div className="p-4 border-r border-slate-600 text-center">
                            <span className="text-sm font-semibold text-slate-400">Self-Learning</span>
                        </div>
                        <div className="p-4 text-center bg-blue-600/20">
                            <span className="text-sm font-bold text-blue-400">KITES Training</span>
                        </div>
                    </div>

                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`grid grid-cols-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'}`}
                        >
                            <div className="p-4 border-r border-slate-700/50">
                                <span className="text-sm text-slate-200">{feature.name}</span>
                            </div>
                            <div className="p-4 border-r border-slate-700/50 flex items-center justify-center">
                                {selfLearningCell(feature.self_learning)}
                            </div>
                            <div className="p-4 flex items-center justify-center bg-blue-600/5">
                                {(feature.kites === 'yes' || feature.kites === true) && (
                                    <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
                                        <Check className="w-5 h-5 text-green-400" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <p className="text-slate-300 mb-6">{ctaNote}</p>
                    <Link
                        to="/services/training"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
                    >
                        <span>{ctaText}</span>
                        <Check className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
