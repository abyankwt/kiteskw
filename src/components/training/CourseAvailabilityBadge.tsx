import { AlertCircle, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseAvailabilityBadgeProps {
    variant?: "limited" | "filling" | "popular";
    seatsLeft?: number;
    className?: string;
}

export function CourseAvailabilityBadge({
    variant = "limited",
    seatsLeft,
    className
}: CourseAvailabilityBadgeProps) {
    const config = {
        limited: {
            icon: AlertCircle,
            text: seatsLeft ? `${seatsLeft} seats left` : "Limited seats",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-500",
            borderColor: "border-orange-500/20"
        },
        filling: {
            icon: TrendingUp,
            text: "Filling fast",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
            borderColor: "border-amber-500/20"
        },
        popular: {
            icon: Flame,
            text: "Most popular",
            bgColor: "bg-rose-500/10",
            textColor: "text-rose-500",
            borderColor: "border-rose-500/20"
        }
    };

    const { icon: Icon, text, bgColor, textColor, borderColor } = config[variant];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm",
                bgColor,
                textColor,
                borderColor,
                "text-[10px] font-bold uppercase tracking-wider",
                className
            )}
        >
            <Icon size={10} className="animate-pulse" />
            <span>{text}</span>
        </div>
    );
}
