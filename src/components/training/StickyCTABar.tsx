import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyCTABarProps {
    whatsappUrl: string;
}

export const StickyCTABar = ({ whatsappUrl }: StickyCTABarProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling 500px
            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0B0F14] via-[#1A1F29] to-[#0B0F14] border-t border-blue-500/30 shadow-2xl backdrop-blur-xl"
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Left: Urgency Message */}
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-500/30"
                                >
                                    <Flame size={14} className="animate-pulse" />
                                    <span>LIMITED SEATS AVAILABLE</span>
                                </motion.div>
                                <p className="text-white text-sm font-medium hidden md:block">
                                    Don't miss out on our{' '}
                                    <span className="text-blue-400 font-bold">February 2026 intake</span>
                                </p>
                            </div>

                            {/* Right: CTA Button */}
                            <motion.a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm rounded-full transition-all shadow-lg hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MessageCircle size={18} className="mr-2" />
                                <span>Start Free Consultation</span>
                                <ArrowRight
                                    size={16}
                                    className="ml-2 transition-transform group-hover:translate-x-1"
                                />
                            </motion.a>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
