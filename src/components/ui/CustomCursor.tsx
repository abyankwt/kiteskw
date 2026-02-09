import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CursorState {
    isHovering: boolean;
    isClicking: boolean;
    cursorType: 'default' | 'link' | 'button' | 'text';
}

/**
 * CustomCursor Component
 * 
 * Premium interactive cursor that responds to hover states.
 * Features:
 * - Smooth mouse tracking with spring physics
 * - Different states for interactive elements
 * - Desktop-only (hidden on mobile)
 * - Respects reduced motion preferences
 * - GPU-accelerated animations
 * 
 * @example
 * <CustomCursor />
 */
export function CustomCursor() {
    const [cursorState, setCursorState] = useState<CursorState>({
        isHovering: false,
        isClicking: false,
        cursorType: 'default',
    });

    const [isVisible, setIsVisible] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Smooth spring animation for cursor position
    const cursorX = useSpring(0, { damping: 25, stiffness: 400 });
    const cursorY = useSpring(0, { damping: 25, stiffness: 400 });

    // Track if device is desktop (has hover capability)
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Check if device supports hover (desktop)
        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        setIsDesktop(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsDesktop(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Mouse move handler
    const handleMouseMove = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        if (!isVisible) {
            setIsVisible(true);
        }
    }, [cursorX, cursorY, isVisible]);

    // Mouse leave handler
    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
    }, []);

    // Click handlers
    const handleMouseDown = useCallback(() => {
        setCursorState(prev => ({ ...prev, isClicking: true }));
    }, []);

    const handleMouseUp = useCallback(() => {
        setCursorState(prev => ({ ...prev, isClicking: false }));
    }, []);

    // Detect interactive elements
    useEffect(() => {
        if (!isDesktop) return;

        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]'
        );

        const handleMouseEnter = (e: Event) => {
            const target = e.target as HTMLElement;
            const tagName = target.tagName.toLowerCase();

            let cursorType: CursorState['cursorType'] = 'default';

            if (tagName === 'a') {
                cursorType = 'link';
            } else if (tagName === 'button' || target.getAttribute('role') === 'button') {
                cursorType = 'button';
            } else if (['input', 'textarea'].includes(tagName)) {
                cursorType = 'text';
            }

            setCursorState(prev => ({
                ...prev,
                isHovering: true,
                cursorType
            }));
        };

        const handleMouseLeaveElement = () => {
            setCursorState(prev => ({
                ...prev,
                isHovering: false,
                cursorType: 'default'
            }));
        };

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeaveElement);
        });

        return () => {
            interactiveElements.forEach(element => {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeaveElement);
            });
        };
    }, [isDesktop]);

    // Global mouse event listeners
    useEffect(() => {
        if (!isDesktop) return;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDesktop, handleMouseMove, handleMouseLeave, handleMouseDown, handleMouseUp]);

    // Don't render on mobile or if user prefers reduced motion
    if (!isDesktop || shouldReduceMotion) {
        return null;
    }

    const { isHovering, isClicking, cursorType } = cursorState;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference",
                    !isVisible && "opacity-0"
                )}
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    className="bg-white rounded-full"
                    animate={{
                        width: isHovering ? 8 : 6,
                        height: isHovering ? 8 : 6,
                        scale: isClicking ? 0.8 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 400,
                    }}
                />
            </motion.div>

            {/* Cursor ring */}
            <motion.div
                className={cn(
                    "fixed top-0 left-0 pointer-events-none z-[9998] border-2 border-white/50 rounded-full mix-blend-difference",
                    !isVisible && "opacity-0"
                )}
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: isHovering ? 48 : 32,
                    height: isHovering ? 48 : 32,
                    borderColor: isHovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                    scale: isClicking ? 0.85 : 1,
                }}
                transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 150,
                }}
            />
        </>
    );
}
