import { cn } from "@/lib/utils";
import { LottiePlayer } from "./LottiePlayer";

export interface Step {
    id: string;
    label: string;
    description?: string;
}

export type StepState = "pending" | "active" | "complete";

interface AnimatedStepIndicatorProps {
    /**
     * Array of steps to display
     */
    steps: Step[];

    /**
     * Current active step index (0-based)
     */
    currentStep: number;

    /**
     * Array of completed step indices
     */
    completedSteps?: number[];

    /**
     * Orientation of the step indicator
     * @default "horizontal"
     */
    orientation?: "horizontal" | "vertical";

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Show connector lines between steps
     * @default true
     */
    showConnector?: boolean;
}

/**
 * Reusable animated step indicator component
 * Perfect for multi-step forms, onboarding flows, progress tracking
 */
export function AnimatedStepIndicator({
    steps,
    currentStep,
    completedSteps = [],
    orientation = "horizontal",
    className,
    showConnector = true,
}: AnimatedStepIndicatorProps) {
    const checkmarkAnimationUrl = "https://lottie.host/b8e61857-7533-4d1f-8c8e-0a3f6fc5c6f5/qzrckLZSHZ.json";

    const getStepState = (index: number): StepState => {
        if (completedSteps.includes(index)) return "complete";
        if (index === currentStep) return "active";
        return "pending";
    };

    const isHorizontal = orientation === "horizontal";

    return (
        <div
            className={cn(
                "flex",
                isHorizontal ? "flex-row items-center" : "flex-col items-start",
                className
            )}
        >
            {steps.map((step, index) => {
                const state = getStepState(index);
                const isLast = index === steps.length - 1;

                return (
                    <div
                        key={step.id}
                        className={cn(
                            "flex items-center",
                            isHorizontal ? "flex-row" : "flex-col",
                            !isLast && isHorizontal && "flex-1"
                        )}
                    >
                        {/* Step Circle */}
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "relative flex items-center justify-center rounded-full transition-all duration-300",
                                    state === "pending" && "w-10 h-10 bg-gray-100 border-2 border-gray-300",
                                    state === "active" && "w-12 h-12 bg-blue-100 border-2 border-blue-500 animate-pulse",
                                    state === "complete" && "w-10 h-10 bg-green-100 border-2 border-green-500"
                                )}
                            >
                                {state === "complete" ? (
                                    // Animated checkmark for completed steps
                                    <div className="w-6 h-6">
                                        <LottiePlayer
                                            animationData={checkmarkAnimationUrl}
                                            loop={false}
                                            autoplay={true}
                                            speed={1.2}
                                            lazyLoad={false}
                                            ariaLabel="Step complete"
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    // Step number
                                    <span
                                        className={cn(
                                            "font-heading font-bold text-sm",
                                            state === "pending" && "text-gray-400",
                                            state === "active" && "text-blue-600 text-base"
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                )}
                            </div>

                            {/* Step Label */}
                            <div className={cn("text-center", isHorizontal ? "max-w-[120px]" : "")}>
                                <p
                                    className={cn(
                                        "font-heading text-xs font-semibold uppercase tracking-wide transition-colors",
                                        state === "pending" && "text-gray-400",
                                        state === "active" && "text-blue-600",
                                        state === "complete" && "text-green-600"
                                    )}
                                >
                                    {step.label}
                                </p>
                                {step.description && (
                                    <p className="font-body text-xs text-gray-500 mt-1">{step.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {showConnector && !isLast && (
                            <div
                                className={cn(
                                    "flex-1 transition-all duration-500",
                                    isHorizontal ? "h-[2px] mx-4" : "w-[2px] h-12 ml-5 my-2",
                                    state === "complete" ? "bg-green-500" : "bg-gray-200"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
