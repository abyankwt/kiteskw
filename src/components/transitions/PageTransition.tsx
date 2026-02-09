import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    variant?: 'fade' | 'slideUp' | 'slideRight' | 'scale';
}

// Transition variants for different animation styles
const variants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideRight: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 },
    },
};

const transition = {
    duration: 0.3,
    ease: [0.43, 0.13, 0.23, 0.96] as const, // Custom easing for smooth feel
};

/**
 * PageTransition component
 * Wraps page content with smooth animations during route changes
 * Works alongside SplashScreen for a premium navigation experience
 * Respects user's reduced motion preferences for accessibility
 */
export function PageTransition({ children, variant = 'fade' }: PageTransitionProps) {
    const location = useLocation();
    const shouldReduceMotion = useReducedMotion();

    // If user prefers reduced motion, don't animate
    if (shouldReduceMotion) {
        return <>{children}</>;
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.pathname}
                variants={variants[variant]}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * PageTransitionWrapper - for wrapping Routes
 * Automatically applies transitions to route changes
 */
export function PageTransitionWrapper({ children }: { children: ReactNode }) {
    return <PageTransition variant="fade">{children}</PageTransition>;
}
