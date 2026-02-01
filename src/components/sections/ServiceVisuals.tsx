import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

// 1. Consulting: Data Wave (Chaos to Order)
export const DataWaveVisual = () => {
    const lineRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!lineRef.current) return;

        // Simulate a wave that stabilizes
        const tl = gsap.timeline({ repeat: -1 });

        // Randomize path data points to simulate "chaos" then smooth out
        // Simple sine wave simulation

        // Animate the 'd' attribute or use drawSVG if complex. 
        // Here we will use simple transforms on multiple bars for a "digital equalizer" look 
        // which effectively communicates "Data/Analysis".
    }, []);

    return (
        <div className="w-full h-full flex items-end justify-center gap-1 p-2">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="w-1.5 bg-blue-500/80 rounded-t-sm data-bar"
                    style={{ height: '20%' }}
                />
            ))}
            <DataWaveAnimation />
        </div>
    );
};

const DataWaveAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".data-bar", {
                height: () => Math.random() * 80 + 20 + "%",
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.inOut",
                repeat: -1,
                yoyo: true
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);
    // Using a separate component to isolate text context if needed, but wrapper is better
    return null;
}

// Re-write DataWave to be self-contained in logic
export const ConsultingVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".bar", {
                height: () => gsap.utils.random(30, 100) + "%",
                duration: 0.6,
                stagger: {
                    each: 0.1,
                    from: "center",
                    repeat: -1,
                    yoyo: true
                },
                ease: "sine.inOut"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-16 h-16 flex items-end justify-center gap-[3px] overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bar w-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-[2px] h-4" />
            ))}
        </div>
    );
};

// 2. Software: Floating Stack (Platforms)
export const SoftwareVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".layer", {
                y: -4,
                duration: 1.5,
                stagger: {
                    each: 0.2,
                    repeat: -1,
                    yoyo: true
                },
                ease: "power1.inOut"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-16 h-16 relative flex items-center justify-center perspective-[100px]">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="layer absolute w-11 h-11 border-2 border-purple-400/40 bg-purple-100/60 rounded-lg transform rotate-45"
                    style={{
                        top: 20 - (i * 8), // Stack vertically
                        zIndex: i,
                        scale: 1 - (i * 0.1)
                    }}
                />
            ))}
            {/* Core */}
            <div className="absolute w-3 h-3 bg-purple-600 rounded-full z-10 shadow-lg shadow-purple-500/30" style={{ top: '40%' }} />
        </div>
    );
};

// 3. Prototyping: 3D Cube (Modeling/Validation)
export const PrototypingVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".cube-spinner", {
                rotation: 360,
                duration: 10,
                repeat: -1,
                ease: "none"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 stroke-emerald-600 stroke-[1.5] fill-none cube-spinner">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="M3.27 6.96 12 12.01l8.73-5.05" />
                <path d="M12 22.08V12" />
            </svg>
        </div>
    );
};

// 4. Training: Growth Curve (Capacity Building)
export const TrainingVisual = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // Draw line
            tl.fromTo(".chart-line",
                { strokeDasharray: 100, strokeDashoffset: 100 },
                { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }
            );

            // Pop nodes
            tl.fromTo(".chart-node",
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, stagger: 0.2, ease: "back.out(2)" },
                "-=0.5"
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
                {/* Axes */}
                <path d="M5 35 H35" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 5 V35" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />

                {/* Growth Line */}
                <path
                    d="M5 35 C15 35, 15 15, 35 5"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="chart-line"
                />

                {/* Nodes */}
                <circle cx="5" cy="35" r="3" fill="white" stroke="#ea580c" strokeWidth="2" className="chart-node" />
                <circle cx="20" cy="25" r="3" fill="white" stroke="#ea580c" strokeWidth="2" className="chart-node" />
                <circle cx="35" cy="5" r="3" fill="white" stroke="#ea580c" strokeWidth="2" className="chart-node" />
            </svg>
        </div>
    );
};
