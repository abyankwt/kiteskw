import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({
    end,
    duration = 2,
    prefix = "",
    suffix = "",
    className = ""
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const counterRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    hasAnimated.current = true;

                    gsap.to({ value: 0 }, {
                        value: end,
                        duration: duration,
                        ease: "power2.out",
                        onUpdate: function () {
                            setCount(Math.floor(this.targets()[0].value));
                        }
                    });

                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return (
        <span ref={counterRef} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}
