import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
}

export function FloatingWhatsAppButton({
    phoneNumber,
    message = "Hi! I'm interested in your training programs."
}: FloatingWhatsAppButtonProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 400px
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Main Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={cn(
                    "flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 group",
                    isExpanded ? "px-6 py-4" : "p-4"
                )}
            >
                <MessageCircle size={24} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span
                    className={cn(
                        "font-semibold text-sm whitespace-nowrap transition-all duration-300 overflow-hidden",
                        isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
                    )}
                >
                    Chat with us on WhatsApp
                </span>
            </a>

            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none" />
        </div>
    );
}
