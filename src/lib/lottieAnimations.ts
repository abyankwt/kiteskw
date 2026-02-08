/**
 * Centralized Lottie Animation Registry
 * Single source of truth for all Lottie animation URLs
 */

// ============================================================================
// DATA VISUALIZATION ANIMATIONS
// ============================================================================

export const celebrationAnimations = {
    /** Celebration burst for count-up completion */
    // TEMPORARY: Using existing animations until we get proper ones
    confetti: "https://lottie.host/95b6d9c7-2295-4711-85fa-6e5b9f1a5ec5/zWGRu9JdDr.json", // Confetti animation
    sparkle: "https://lottie.host/95b6d9c7-2295-4711-85fa-6e5b9f1a5ec5/zWGRu9JdDr.json", // Using same as confetti
};

export const metricAnimations = {
    /** Animated briefcase opening - for "Enterprise Projects" */
    // TEMPORARY: Using checkmark animation as placeholder
    briefcase: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",

    /** Graduation cap toss - for "Engineers Trained" */
    graduation: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",

    /** Animated handshake/team - for "Strategic Partners" */
    team: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",

    /** Spinning globe - for "GCC Countries Served" */
    globe: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",
};

// ============================================================================
// ONBOARDING FLOW ANIMATIONS
// ============================================================================

export const stepAnimations = {
    /** Target with bullseye hit - "Assess" step */
    // TEMPORARY: Using checkmark as placeholder
    Target: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",

    /** Book flipping pages - "Train" step */
    BookOpen: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",

    /** Gear spinning - "Implement" step */
    Settings: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",

    /** Handshake animation - "Support" step */
    HeartHandshake: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",
};

// ============================================================================
// HOVER STATE ANIMATIONS (Service Icons)
// ============================================================================

export const serviceIconAnimations = {
    /** Line chart growing - Consultation service */
    // TEMPORARY: Using arrow animation as placeholder
    consultation: "https://lottie.host/0affe2ef-c16c-4c9e-bc11-a27b1e970827/4UOREGxUPA.json",

    /** Leaf rustling - Software Distribution */
    "software-distribution": "https://lottie.host/0affe2ef-c16c-4c9e-bc11-a27b1e970827/4UOREGxUPA.json",

    /** CPU with data flow - Prototype Development */
    "prototype-development": "https://lottie.host/0affe2ef-c16c-4c9e-bc11-a27b1e970827/4UOREGxUPA.json",

    /** Earth/globe with orbit - Environmental Consulting */
    "environmental-consulting": "https://lottie.host/0affe2ef-c16c-4c9e-bc11-a27b1e970827/4UOREGxUPA.json",
};

// ============================================================================
// EXISTING ANIMATIONS (Reference)
// ============================================================================

export const existingAnimations = {
    gift: "https://lottie.host/e5100b63-3e4a-4601-810d-9dedc1a40cf9/DRzHMcNRNG.json",
    scroll: "https://lottie.host/0eb5b0a7-dbfc-4b95-bfb3-3c8cf4c50bf5/aXy0iJdGAf.json",
    particles: "https://lottie.host/3bf5632e-7cd9-4c25-873e-c4cbdbd6c0e2/qPYSdNCk3M.json",
    loader: "https://lottie.host/4db68bbd-31f2-4cd9-a059-b68729bcfd06/wm4exwC63t.json",
    checkmark: "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json",
    verifiedBadge: "https://lottie.host/d4c6e7fa-85c0-4b32-a85f-7d5c4e44b49c/OqGKnKZj2O.json",
    notFound404: "https://lottie.host/1c0f4b8a-7f4e-4f55-b89d-3c8c7e7b59a0/OguzGKZjFu.json",
    errorBoundary: "https://lottie.host/2fa8e7b6-6c8a-4f25-9c8e-4b3d8c7a9e1f/DqRGZjKnPQ.json",
    arrowRight: "https://lottie.host/0affe2ef-c16c-4c9e-bc11-a27b1e970827/4UOREGxUPA.json",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get metric animation URL by metric ID
 */
export function getMetricAnimation(metricId: string): string {
    const animations: Record<string, string> = {
        engineers: metricAnimations.graduation,
        clients: metricAnimations.briefcase,
        partners: metricAnimations.team,
        countries: metricAnimations.globe,
    };

    return animations[metricId] || metricAnimations.briefcase; // fallback
}

/**
 * Get step animation URL by icon name
 */
export function getStepAnimation(iconName: string): string {
    const animations: Record<string, string> = {
        Target: stepAnimations.Target,
        BookOpen: stepAnimations.BookOpen,
        Settings: stepAnimations.Settings,
        HeartHandshake: stepAnimations.HeartHandshake,
    };

    return animations[iconName] || stepAnimations.Target; // fallback
}

/**
 * Get service icon animation URL by service ID
 */
export function getServiceIconAnimation(serviceId: string): string {
    return serviceIconAnimations[serviceId as keyof typeof serviceIconAnimations] || serviceIconAnimations.consultation;
}
