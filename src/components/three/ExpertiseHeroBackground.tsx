import { useEffect, useState, useRef, useMemo } from "react";

/**
 * Premium Interactive Particle Network Background
 * Sophisticated animation with particles, connecting lines, and mouse interaction
 */

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

export function ExpertiseHeroBackground() {
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>();

    // Particle configuration
    const config = useMemo(() => ({
        particleCount: 80,
        connectionDistance: 150,
        particleSpeed: 0.3,
        mouseRadius: 150,
        particleColor: 'rgba(255, 255, 255, 0.8)',
        lineColor: 'rgba(255, 255, 255, 0.15)',
        glowColor: 'rgba(139, 92, 246, 0.3)', // Purple glow
    }), []);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (isReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            initParticles();
        };

        // Initialize particles
        const initParticles = () => {
            const particles: Particle[] = [];
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * config.particleSpeed,
                    vy: (Math.random() - 0.5) * config.particleSpeed,
                    radius: Math.random() * 2 + 1,
                });
            }

            particlesRef.current = particles;
        };

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        // Animation loop
        const animate = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            // Clear canvas with fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Mouse interaction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseRadius) {
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.05;
                    particle.vy -= Math.sin(angle) * force * 0.05;
                }

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > height) particle.vy *= -1;

                // Keep particles in bounds
                particle.x = Math.max(0, Math.min(width, particle.x));
                particle.y = Math.max(0, Math.min(height, particle.y));

                // Apply friction
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Draw particle glow
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 3
                );
                gradient.addColorStop(0, config.glowColor);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
                ctx.fill();

                // Draw particle
                ctx.fillStyle = config.particleColor;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections
                particles.slice(i + 1).forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        const opacity = (1 - distance / config.connectionDistance) * 0.3;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isReducedMotion, config]);

    // Fallback for reduced motion
    if (isReducedMotion) {
        return (
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
                }}
            />
        );
    }

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Canvas for particle animation */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ mixBlendMode: 'screen' }}
            />

            {/* Subtle gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
