import { LottiePlayer } from "./LottiePlayer";

interface LoadingAnimationProps {
    /**
     * Size of the loading animation
     * @default "md"
     */
    size?: "sm" | "md" | "lg" | "xl";

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Loading text to display below animation
     */
    text?: string;
}

/**
 * Branded loading animation for KITES
 * Uses a modern abstract loader with brand colors
 */
export function LoadingAnimation({
    size = "md",
    className,
    text
}: LoadingAnimationProps) {
    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
        xl: "w-48 h-48",
    };

    // Using a free Lottie animation from LottieFiles
    // This is a modern loader animation with geometric shapes
    const animationUrl = "https://lottie.host/4db68bbd-31f2-4cd9-a059-b68729bcfd06/wm4exwC63t.json";

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className={sizeClasses[size]}>
                <LottiePlayer
                    animationData={animationUrl}
                    loop={true}
                    autoplay={true}
                    speed={1}
                    lazyLoad={false} // Don't lazy load loading animations
                    ariaLabel="Loading animation"
                />
            </div>
            {text && (
                <p className="font-body text-sm text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}
