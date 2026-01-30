import { useState, useEffect } from 'react';
import { X, Clock, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LimitedTimeOfferBannerProps {
    discount: string;
    expiryDate: string;
    remainingSeats?: number;
    message: string;
}

export function LimitedTimeOfferBanner({
    discount,
    expiryDate,
    remainingSeats,
    message
}: LimitedTimeOfferBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(expiryDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-[var(--header-height)] left-0 right-0 z-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg"
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Message & Discount */}
                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                                <Flame className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-bold">{discount} OFF</span>
                            </div>
                            <p className="text-sm md:text-base font-semibold">
                                {message}
                            </p>
                        </div>

                        {/* Countdown Timer */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium hidden sm:inline">Offer ends in:</span>
                            </div>
                            <div className="flex gap-2">
                                {timeLeft.days > 0 && (
                                    <div className="flex flex-col items-center bg-white/20 rounded-lg px-2 py-1 min-w-[45px] backdrop-blur-sm">
                                        <span className="text-lg font-bold leading-none">{timeLeft.days}</span>
                                        <span className="text-[10px] uppercase opacity-90">Days</span>
                                    </div>
                                )}
                                <div className="flex flex-col items-center bg-white/20 rounded-lg px-2 py-1 min-w-[45px] backdrop-blur-sm">
                                    <span className="text-lg font-bold leading-none">
                                        {String(timeLeft.hours).padStart(2, '0')}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-90">Hrs</span>
                                </div>
                                <div className="flex flex-col items-center bg-white/20 rounded-lg px-2 py-1 min-w-[45px] backdrop-blur-sm">
                                    <span className="text-lg font-bold leading-none">
                                        {String(timeLeft.minutes).padStart(2, '0')}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-90">Min</span>
                                </div>
                                <div className="flex flex-col items-center bg-white/20 rounded-lg px-2 py-1 min-w-[45px] backdrop-blur-sm">
                                    <span className="text-lg font-bold leading-none">
                                        {String(timeLeft.seconds).padStart(2, '0')}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-90">Sec</span>
                                </div>
                            </div>
                        </div>

                        {/* Remaining Seats (if provided) */}
                        {remainingSeats && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/30 rounded-full backdrop-blur-sm border border-red-300/50">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-sm font-bold">
                                    Only {remainingSeats} seats left!
                                </span>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close banner"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
