import { useState, useEffect } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

export function useMouseParallax(strength: number = 20): MousePosition {
    const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        let rafId: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (rafId !== null) return; // one rAF per frame — no storm
            const x = (e.clientX / window.innerWidth - 0.5) * strength;
            const y = (e.clientY / window.innerHeight - 0.5) * strength;
            rafId = requestAnimationFrame(() => {
                setPosition({ x, y });
                rafId = null;
            });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, [strength]);

    return position;
}
