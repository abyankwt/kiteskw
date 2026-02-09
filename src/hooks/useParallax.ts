import { useState, useEffect, useRef, RefObject } from 'react';

interface ParallaxOptions {
    /**
     * Speed multiplier for parallax effect
     * 0.5 = half the scroll speed (slower)
     * 1.0 = same as scroll speed
     * 2.0 = twice the scroll speed (faster)
     */
    speed?: number;

    /**
     * Direction of parallax movement
     */
    direction?: 'vertical' | 'horizontal';

    /**
     * Enable parallax only when element is in viewport
     * Improves performance by not calculating when not visible
     */
    enableInViewport?: boolean;
}

interface ParallaxReturn<T extends HTMLElement> {
    ref: RefObject<T>;
    offset: number;
    isInView: boolean;
}

/**
 * useParallax Hook
 * 
 * Creates smooth parallax scrolling effects with performance optimization.
 * Uses IntersectionObserver to only calculate when element is visible.
 * 
 * @param options - Configuration for parallax behavior
 * @returns ref to attach to element, current offset value, and viewport status
 * 
 * @example
 * const { ref, offset } = useParallax({ speed: 0.5 });
 * <div ref={ref} style={{ transform: `translateY(${offset}px)` }}>
 *   Parallax content
 * </div>
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
    options: ParallaxOptions = {}
): ParallaxReturn<T> {
    const {
        speed = 0.5,
        direction = 'vertical',
        enableInViewport = true,
    } = options;

    const [offset, setOffset] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current) return;

        let observer: IntersectionObserver | null = null;
        let rafId: number | null = null;

        // Set up IntersectionObserver for performance
        if (enableInViewport) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    setIsInView(entry.isIntersecting);
                },
                {
                    // Start observing slightly before element enters viewport
                    rootMargin: '100px 0px',
                    threshold: 0,
                }
            );
            observer.observe(ref.current);
        } else {
            setIsInView(true);
        }

        const handleScroll = () => {
            // Only calculate if element is in viewport (or if optimization disabled)
            if (!isInView && enableInViewport) return;

            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }

            rafId = requestAnimationFrame(() => {
                if (!ref.current) return;

                const rect = ref.current.getBoundingClientRect();
                const scrollY = window.scrollY || window.pageYOffset;

                // Calculate offset based on element's position relative to viewport
                let parallaxOffset: number;

                if (direction === 'vertical') {
                    // Use element's distance from top of viewport
                    parallaxOffset = (scrollY - rect.top + window.innerHeight) * speed;
                } else {
                    // Horizontal parallax based on scroll position
                    parallaxOffset = scrollY * speed;
                }

                setOffset(parallaxOffset);
            });
        };

        // Initial calculation
        handleScroll();

        // Listen to scroll events with passive flag for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (observer) observer.disconnect();
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [speed, direction, enableInViewport, isInView]);

    return { ref, offset, isInView };
}

/**
 * useMultiLayerParallax Hook
 * 
 * Creates multiple parallax layers with different speeds for complex effects
 * 
 * @param layers - Array of speed values for each layer
 * @returns Array of parallax returns for each layer
 */
export function useMultiLayerParallax(
    layers: number[]
): ParallaxReturn<HTMLDivElement>[] {
    return layers.map(speed => useParallax({ speed }));
}
