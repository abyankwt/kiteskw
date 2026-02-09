import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    decimals?: number;
    className?: string;
}

export function CountUp({
    end,
    duration = 2000,
    suffix = '',
    decimals = 0,
    className = ''
}: CountUpProps) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (hasAnimated) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true);

                    const startTime = Date.now();
                    const startValue = 0;

                    const animate = () => {
                        const now = Date.now();
                        const progress = Math.min((now - startTime) / duration, 1);

                        // Easing function (easeOutExpo)
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentCount = startValue + (end - startValue) * easeOut;

                        setCount(currentCount);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    const displayValue = decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toString();

    return (
        <span ref={elementRef} className={className}>
            {displayValue}{suffix}
        </span>
    );
}
