import { useEffect, useRef } from 'react';
import { partners } from '@/data/partners';
import { useLanguage } from '@/contexts/LanguageContext';
import { gsap } from "@/lib/gsap";

export function ScrollPartners() {
    const { isRTL } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Configuration
    const ITEM_WIDTH = 300; // Increased width for card spacing
    const PAUSE_DURATION = 2; // Seconds to pause on each logo
    const MOVE_DURATION = 0.8; // Seconds to move between logos
    const SET_LENGTH = partners.length;

    // Use 3 sets: [Buffer Previous] [Active Set] [Buffer Next]
    // This allows sufficient buffer for infinite looping in both directions
    const marqueePartners = [...partners, ...partners, ...partners];

    useEffect(() => {
        if (!trackRef.current || !containerRef.current) return;

        const track = trackRef.current;
        const totalItems = marqueePartners.length;

        // Clean up previous animations
        gsap.killTweensOf(track);

        const ctx = gsap.context(() => {

            // Calculate starting position to center the first item of the MIDDLE set
            // The middle set starts at index = SET_LENGTH
            const viewportWidth = containerRef.current?.offsetWidth || window.innerWidth;
            const centerOffset = (viewportWidth / 2) - (ITEM_WIDTH / 2);

            // Initial position: 
            // - Push back by the width of the first set (buffer)
            // + Add centering offset
            const startX = -(SET_LENGTH * ITEM_WIDTH) + centerOffset;

            // Reset to initial state
            gsap.set(track, { x: startX });

            // Create the Master Timeline
            const tl = gsap.timeline({
                repeat: -1,
                paused: false,
                defaults: { ease: "linear" }
            });

            // LTR Logic (Standard)
            // Move LEFT: decrease x value
            // We want to move through one entire set (SET_LENGTH items)
            if (!isRTL) {
                for (let i = 0; i < SET_LENGTH; i++) {
                    // 1. Move to next item
                    tl.to(track, {
                        x: `-=${ITEM_WIDTH}`,
                        duration: MOVE_DURATION,
                        ease: "power2.inOut"
                    })
                        // 2. Pause
                        .to(track, {}, `+=${PAUSE_DURATION}`);
                }

                // seamless loop reset: instantly jump back to startX
                // This happens after we have moved exactly one set width to the left
                tl.add(() => {
                    gsap.set(track, { x: startX });
                });
            }
            // RTL Logic (Arabic)
            // Move RIGHT: increase x value
            else {
                for (let i = 0; i < SET_LENGTH; i++) {
                    // 1. Move to next item (to the right)
                    tl.to(track, {
                        x: `+=${ITEM_WIDTH}`,
                        duration: MOVE_DURATION,
                        ease: "power2.inOut"
                    })
                        // 2. Pause
                        .to(track, {}, `+=${PAUSE_DURATION}`);
                }

                // seamless loop reset: instantly jump back to startX
                // This happens after we have moved exactly one set width to the right
                tl.add(() => {
                    gsap.set(track, { x: startX });
                });
            }

            // Hover Interactions
            const onMouseEnter = () => tl.pause();
            const onMouseLeave = () => tl.play();

            containerRef.current?.addEventListener('mouseenter', onMouseEnter);
            containerRef.current?.addEventListener('mouseleave', onMouseLeave);

            // Cleanup interactions
            return () => {
                containerRef.current?.removeEventListener('mouseenter', onMouseEnter);
                containerRef.current?.removeEventListener('mouseleave', onMouseLeave);
            };

        }, containerRef);

        return () => ctx.revert();
    }, [isRTL]);

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden bg-slate-50 border-y border-slate-200 py-12 relative z-20"
            dir="ltr" // Structure is always LTR, we handle direction via transforms
        >
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Trusted By Industry Leaders</p>
            </div>

            {/* Soft Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

            {/* Track */}
            <div
                ref={trackRef}
                className="flex items-center w-max will-change-transform"
            >
                {marqueePartners.map((partner, index) => (
                    <div
                        key={`${partner.id}-${index}`}
                        className="flex-shrink-0 flex justify-center items-center px-3" // Added horizontal padding for spacing between cards
                        style={{
                            width: `${ITEM_WIDTH}px`,
                        }}
                    >
                        <div className="relative w-full h-[110px] sm:h-[120px] flex items-center justify-center border border-neutral-300 rounded-[2rem] bg-transparent transition-all duration-300 hover:border-neutral-400 hover:bg-black/[0.02] p-4">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Optional: Central Focus Indicator (Subtle) */}
            {/* <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-500/0 z-50 transform -translate-x-1/2 pointer-events-none" /> */}
        </div>
    );
}
