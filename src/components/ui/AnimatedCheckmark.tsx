import { LottiePlayer } from "./LottiePlayer";
import { cn } from "@/lib/utils";

interface AnimatedCheckmarkProps {
    /**
     * Size of the checkmark icon
     * @default "md"
     */
    size?: "sm" | "md" | "lg";

    /**
     * Color theme for the checkmark
     * @default "default"
     */
    variant?: "default" | "success" | "primary";

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Whether to play animation immediately or on scroll
     * @default false (plays on scroll)
     */
    autoplay?: boolean;
}

/**
 * Animated checkmark icon using Lottie
 * Perfect for success states, deliverables, completed items
 */
export function AnimatedCheckmark({
    size = "md",
    variant = "default",
    className,
    autoplay = false
}: AnimatedCheckmarkProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    // Color filters for different variants
    const variantClasses = {
        default: "opacity-90",
        success: "opacity-100 brightness-110",
        primary: "opacity-100",
    };

    // Animated checkmark from LottieFiles
    const checkmarkUrl = "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json";

    return (
        <div className={cn(sizeClasses[size], variantClasses[variant], className)}>
            <LottiePlayer
                animationData={checkmarkUrl}
                loop={false}
                autoplay={autoplay}
                speed={1.2}
                ariaLabel="Checkmark icon"
                className="w-full h-full"
            />
        </div>
    );
}
