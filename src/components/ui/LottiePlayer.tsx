import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { cn } from "@/lib/utils";

export interface LottiePlayerProps {
    /**
     * Lottie animation data (JSON object) or URL to JSON file
     */
    animationData: object | string;

    /**
     * Whether to loop the animation
     * @default true
     */
    loop?: boolean;

    /**
     * Whether to autoplay the animation
     * @default true
     */
    autoplay?: boolean;

    /**
     * Animation playback speed
     * @default 1
     */
    speed?: number;

    /**
     * Play animation only when hovered
     * @default false
     */
    playOnHover?: boolean;

    /**
     * Enable lazy loading with Intersection Observer
     * @default true
     */
    lazyLoad?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Accessible label for screen readers
     */
    ariaLabel?: string;

    /**
     * Callback when animation is loaded
     */
    onLoad?: () => void;

    /**
     * Callback when animation completes (for non-looping animations)
     */
    onComplete?: () => void;
}

/**
 * Optimized Lottie animation player with lazy loading and performance features
 * 
 * Features:
 * - Intersection Observer for lazy loading
 * - Respects prefers-reduced-motion
 * - Play on hover support
 * - Accessible with ARIA labels
 */
export function LottiePlayer({
    animationData,
    loop = true,
    autoplay = true,
    speed = 1,
    playOnHover = false,
    lazyLoad = true,
    className,
    ariaLabel,
    onLoad,
    onComplete,
}: LottiePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [isVisible, setIsVisible] = useState(!lazyLoad);
    const [isHovered, setIsHovered] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    // Lazy loading with Intersection Observer
    useEffect(() => {
        if (!lazyLoad || isVisible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                rootMargin: "50px", // Start loading 50px before element enters viewport
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [lazyLoad, isVisible]);

    // Handle playback speed
    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(speed);
        }
    }, [speed]);

    // Handle hover interactions
    useEffect(() => {
        if (!playOnHover || !lottieRef.current || prefersReducedMotion) return;

        if (isHovered) {
            lottieRef.current.play();
        } else {
            lottieRef.current.stop();
        }
    }, [isHovered, playOnHover, prefersReducedMotion]);

    // CRITICAL: Cleanup on unmount to prevent DOM removal errors
    useEffect(() => {
        const currentLottieRef = lottieRef.current;

        return () => {
            try {
                // Attempt to stop and destroy animation before unmount
                if (currentLottieRef) {
                    currentLottieRef.stop();
                    currentLottieRef.destroy();
                }
            } catch (error) {
                // Silently catch errors during cleanup
                console.warn('Lottie cleanup warning:', error);
            }
        };
    }, []);

    // Fetch animation data if URL is provided
    const [loadedAnimationData, setLoadedAnimationData] = useState<object | null>(
        typeof animationData === "object" ? animationData : null
    );
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (typeof animationData === "string" && isVisible) {
            setLoadError(false); // Reset error state
            fetch(animationData)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (!data || typeof data !== 'object') {
                        throw new Error('Invalid animation data');
                    }
                    setLoadedAnimationData(data);
                    onLoad?.();
                })
                .catch((error) => {
                    console.error("Failed to load Lottie animation:", error);
                    setLoadError(true);
                    setLoadedAnimationData(null);
                });
        } else if (typeof animationData === "object") {
            setLoadedAnimationData(animationData);
            onLoad?.();
        }
    }, [animationData, isVisible, onLoad]);

    // Don't render animation if not visible yet (lazy loading) or if there was an error
    if (!isVisible || loadError) {
        return (
            <div
                ref={containerRef}
                className={cn("w-full h-full", className)}
                aria-label={ariaLabel || "Animation placeholder"}
            />
        );
    }

    // Don't render if animation data hasn't loaded yet
    if (!loadedAnimationData) {
        return (
            <div
                ref={containerRef}
                className={cn("w-full h-full", className)}
                aria-label={ariaLabel || "Loading animation"}
            />
        );
    }

    // Respect reduced motion preference
    const shouldAutoplay = autoplay && !playOnHover && !prefersReducedMotion;

    try {
        return (
            <div
                ref={containerRef}
                className={cn("w-full h-full", className)}
                onMouseEnter={() => playOnHover && setIsHovered(true)}
                onMouseLeave={() => playOnHover && setIsHovered(false)}
                role="img"
                aria-label={ariaLabel || "Animated illustration"}
            >
                <Lottie
                    lottieRef={lottieRef}
                    animationData={loadedAnimationData}
                    loop={loop && !prefersReducedMotion}
                    autoplay={shouldAutoplay}
                    onComplete={onComplete}
                    rendererSettings={{
                        preserveAspectRatio: "xMidYMid slice",
                    }}
                />
            </div>
        );
    } catch (error) {
        console.error('Lottie render error:', error);
        return (
            <div
                ref={containerRef}
                className={cn("w-full h-full", className)}
                aria-label="Animation error"
            />
        );
    }
}
