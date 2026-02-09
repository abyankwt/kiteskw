import { useParallax } from '@/hooks/useParallax';

/**
 * ParallaxSection - Reusable component for parallax backgrounds
 * 
 * Features:
 * - Smooth parallax scrolling effect
 * - Optimized with IntersectionObserver
 * - Configurable speed and direction
 * 
 * @example
 * <ParallaxSection speed={0.3} className="bg-blue-500">
 *   <h1>Content goes here</h1>
 * </ParallaxSection>
 */

interface ParallaxSectionProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
    bgClassName?: string;
}

export function ParallaxSection({
    children,
    speed = 0.2,
    className = '',
    bgClassName = ''
}: ParallaxSectionProps) {
    const { ref, offset } = useParallax<HTMLDivElement>({
        speed,
        enableInViewport: true
    });

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Parallax Background Layer */}
            <div
                ref={ref}
                className={`absolute inset-0 will-change-transform ${bgClassName}`}
                style={{
                    transform: `translateY(${offset}px)`,
                }}
            />

            {/* Content Layer (fixed) */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

/**
 * ParallaxImage - Image with parallax effect
 */
interface ParallaxImageProps {
    src: string;
    alt: string;
    speed?: number;
    className?: string;
}

export function ParallaxImage({
    src,
    alt,
    speed = 0.3,
    className = ''
}: ParallaxImageProps) {
    const { ref, offset } = useParallax<HTMLImageElement>({ speed });

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                ref={ref}
                src={src}
                alt={alt}
                className="w-full h-full object-cover will-change-transform"
                style={{
                    transform: `translateY(${offset}px)`,
                }}
            />
        </div>
    );
}

/**
 * MultiLayerParallax - Complex parallax with multiple layers
 */
interface ParallaxLayer {
    speed: number;
    className?: string;
    children?: React.ReactNode;
}

interface MultiLayerParallaxProps {
    layers: ParallaxLayer[];
    children?: React.ReactNode;
    className?: string;
}

export function MultiLayerParallax({
    layers,
    children,
    className = ''
}: MultiLayerParallaxProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Parallax Layers */}
            {layers.map((layer, index) => {
                const { ref, offset } = useParallax({ speed: layer.speed });

                return (
                    <div
                        key={index}
                        ref={ref}
                        className={`absolute inset-0 will-change-transform ${layer.className}`}
                        style={{
                            transform: `translateY(${offset}px)`,
                            zIndex: index,
                        }}
                    >
                        {layer.children}
                    </div>
                );
            })}

            {/* Content */}
            <div className="relative" style={{ zIndex: layers.length }}>
                {children}
            </div>
        </div>
    );
}
