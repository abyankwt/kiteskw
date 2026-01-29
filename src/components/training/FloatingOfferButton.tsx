import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingOfferButtonProps {
    onClick: () => void;
    visible?: boolean;
}

export function FloatingOfferButton({ onClick, visible = true }: FloatingOfferButtonProps) {
    return (
        <div
            className={cn(
                "fixed bottom-6 left-6 z-40 transition-all duration-500 ease-in-out",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none delay-100" // Hide when modal is open
            )}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-600/30 hover:scale-110 transition-transform duration-300"
            >
                {/* Pulse Ring */}
                <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping group-hover:animate-none" />

                <Gift className="text-white relative z-10" size={24} />

                {/* Tooltip / Label */}
                <div className="absolute left-full ml-4 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all whitespace-nowrap pointer-events-none">
                    Get 20% OFF
                    {/* Triangle */}
                    <div className="absolute top-1/2 right-full -mt-1 -mr-[1px] border-4 border-transparent border-r-white" />
                </div>
            </button>
        </div>
    );
}
