/**
 * TechnicalGrid - Engineering-themed animated SVG background
 * For Expertise page hero section
 */

export function TechnicalGrid() {
    return (
        <svg
            className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {/* Dot pattern */}
                <pattern id="dot-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" className="text-white" />
                </pattern>

                {/* Circuit line pattern */}
                <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path
                        d="M 0 50 L 20 50 M 80 50 L 100 50"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-purple-400"
                    />
                    <circle cx="50" cy="50" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
                    <path
                        d="M 50 0 L 50 20 M 50 80 L 50 100"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-blue-400"
                    />
                </pattern>

                {/* Animated pulse */}
                <radialGradient id="pulse-gradient">
                    <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)">
                        <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>

            {/* Background patterns */}
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" opacity="0.5" />

            {/* Animated pulse circles */}
            <circle cx="20%" cy="30%" r="100" fill="url(#pulse-gradient)" />
            <circle cx="80%" cy="70%" r="120" fill="url(#pulse-gradient)">
                <animate attributeName="r" values="120;140;120" dur="4s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}
