import { useEffect, useState } from 'react';

interface FloatingParticlesProps {
    count?: number;
    color?: string;
    opacity?: number;
}

export function FloatingParticles({
    count = 20,
    color = 'rgba(255, 255, 255, 0.1)',
    opacity = 1
}: FloatingParticlesProps) {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

    // Reduce count on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? Math.floor(count / 2) : count;

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 10
        }));
        setParticles(newParticles);
    }, [particleCount]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full animate-float"
                    style={{
                        left: `${particle.left}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: color,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                        boxShadow: `0 0 4px ${color}`
                    }}
                />
            ))}
        </div>
    );
}
