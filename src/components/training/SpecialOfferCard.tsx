import { Gift, Zap, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpecialOfferCardProps {
    title: string;
    description: string;
    discount: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    variant?: 'primary' | 'secondary';
}

export function SpecialOfferCard({
    title,
    description,
    discount,
    features,
    ctaText,
    ctaLink,
    variant = 'primary'
}: SpecialOfferCardProps) {
    const isPrimary = variant === 'primary';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden rounded-2xl shadow-2xl ${isPrimary
                ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700'
                : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700'
                }`}
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>

            <div className="relative p-8 md:p-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <Gift className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white uppercase tracking-wide">Special Offer</span>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-white/90 text-lg mb-6">
                    {description}
                </p>

                {/* Discount Highlight */}
                <div className="inline-flex items-baseline gap-2 mb-8">
                    <span className="text-6xl md:text-7xl font-black text-white">
                        {discount}
                    </span>
                    <span className="text-2xl font-bold text-white/80">OFF</span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                        >
                            <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                <Zap className="w-4 h-4 text-yellow-300" fill="currentColor" />
                            </div>
                            <span className="text-white/95 font-medium">{feature}</span>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Button */}
                <a
                    href={ctaLink}
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Footer Note */}
                <p className="text-white/70 text-sm mt-6">
                    Limited time offer • Terms & conditions apply
                </p>
            </div>
        </motion.div>
    );
}

// Pre-configured variants for quick use
export function BundleOfferCard() {
    return (
        <SpecialOfferCard
            title="Bundle & Save Big"
            description="Enroll in 2 or more courses and get exclusive discounts plus bonus materials"
            discount="30%"
            features={[
                "Enroll in 2+ courses simultaneously",
                "Free downloadable resource library",
                "Priority placement assistance",
                "Exclusive networking events access"
            ]}
            ctaText="View Course Bundles"
            ctaLink="https://wa.me/96522092260"
            variant="primary"
        />
    );
}

export function EarlyBirdOfferCard() {
    return (
        <SpecialOfferCard
            title="Early Bird Special"
            description="Register before the deadline and secure your spot with exclusive early bird benefits"
            discount="20%"
            features={[
                "First 50 enrollments only",
                "Free 1-on-1 consultation session",
                "Lifetime access to course updates",
                "Certificate fast-track processing"
            ]}
            ctaText="Claim Early Bird Discount"
            ctaLink="https://wa.me/96522092260"
            variant="secondary"
        />
    );
}

export function ReferralOfferCard() {
    return (
        <SpecialOfferCard
            title="Refer & Earn"
            description="Bring a friend and you both get rewarded with special discounts"
            discount="15%"
            features={[
                "You get 15% off your next course",
                "Your friend gets 15% off their enrollment",
                "No limit on referrals",
                "Instant discount code on signup"
            ]}
            ctaText="Start Referring"
            ctaLink="https://wa.me/96597939494"
            variant="primary"
        />
    );
}
