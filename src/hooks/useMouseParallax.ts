import { useState, useEffect } from 'react';

interface MousePosition {
    x: number;
    y: number;
}

export function useMouseParallax(strength: number = 20): MousePosition {
    const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        // Disable on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * strength;
            const y = (e.clientY / window.innerHeight - 0.5) * strength;

            requestAnimationFrame(() => {
                setPosition({ x, y });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [strength]);

    return position;
}
