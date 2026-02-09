/**
 * NetworkLines - Interconnected network visualization
 * For Partners page hero section
 */

export function NetworkLines() {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Connection line glow */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Animated gradient for lines */}
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)">
                        <animate attributeName="stop-opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.5)">
                        <animate attributeName="stop-opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                    </stop>
                </linearGradient>
            </defs>

            {/* Network nodes */}
            <circle cx="15%" cy="25%" r="4" fill="rgba(59, 130, 246, 0.6)" filter="url(#glow)">
                <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="85%" cy="30%" r="3" fill="rgba(139, 92, 246, 0.6)" filter="url(#glow)">
                <animate attributeName="r" values="3;5;3" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="50%" cy="60%" r="5" fill="rgba(99, 102, 241, 0.6)" filter="url(#glow)">
                <animate attributeName="r" values="5;7;5" dur="4.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="25%" cy="75%" r="3" fill="rgba(59, 130, 246, 0.6)" filter="url(#glow)">
                <animate attributeName="r" values="3;4;3" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="75%" cy="70%" r="4" fill="rgba(139, 92, 246, 0.6)" filter="url(#glow)">
                <animate attributeName="r" values="4;5;4" dur="3.8s" repeatCount="indefinite" />
            </circle>

            {/* Connection lines */}
            <line x1="15%" y1="25%" x2="50%" y2="60%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
            <line x1="85%" y1="30%" x2="50%" y2="60%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
            <line x1="50%" y1="60%" x2="25%" y2="75%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
            <line x1="50%" y1="60%" x2="75%" y2="70%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
            <line x1="15%" y1="25%" x2="25%" y2="75%" stroke="url(#line-gradient)" strokeWidth="0.5" opacity="0.2" />
            <line x1="85%" y1="30%" x2="75%" y2="70%" stroke="url(#line-gradient)" strokeWidth="0.5" opacity="0.2" />
        </svg>
    );
}
