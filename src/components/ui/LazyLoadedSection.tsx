import { useState, useEffect } from "react";
import { ServicesBentoGrid } from "@/components/services/ServicesBentoGrid";
import { ServicesBentoGridSkeleton } from "@/components/skeletons/ServicesBentoGridSkeleton";
import { ScrollPartners } from "@/components/home/ScrollPartners";
import { ScrollPartnersSkeleton } from "@/components/skeletons/ScrollPartnersSkeleton";

interface LazyLoadedSectionProps {
    children: React.ReactNode;
    skeleton: React.ReactNode;
    delay?: number;
}

/**
 * Component that shows skeleton while loading, then displays actual content
 * Useful for demonstrating loading states and improving perceived performance
 */
export function LazyLoadedSection({ children, skeleton, delay = 1000 }: LazyLoadedSectionProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!isLoaded) {
        return <>{skeleton}</>;
    }

    return <>{children}</>;
}

// Example usage exports
export function LazyServicesBentoGrid({ services }: { services: any[] }) {
    return (
        <LazyLoadedSection
            skeleton={<ServicesBentoGridSkeleton />}
            delay={800}
        >
            <ServicesBentoGrid services={services} />
        </LazyLoadedSection>
    );
}

export function LazyScrollPartners() {
    return (
        <LazyLoadedSection
            skeleton={<ScrollPartnersSkeleton />}
            delay={600}
        >
            <ScrollPartners />
        </LazyLoadedSection>
    );
}
