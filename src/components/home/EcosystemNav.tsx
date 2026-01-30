import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import {
    Cpu,
    Wrench,
    GraduationCap,
    Leaf,
    Building2,
    Factory,
    HardHat,
    Zap,
    Globe,
    Briefcase,
    Box
} from "lucide-react";

type EcosystemMode = 'capabilities' | 'industries';

interface NavItem {
    id: string;
    label: string;
    icon: any; // Lucide icon
    path: string;
}

const services: NavItem[] = [
    { id: 'consultation', label: 'Consultation', icon: Briefcase, path: '/services/consultation' },
    { id: 'training', label: 'Training', icon: GraduationCap, path: '/services/training' },
    { id: 'software', label: 'Software Dist.', icon: Box, path: '/services/software-distribution' },
    { id: 'prototype', label: 'Prototype Dev.', icon: Wrench, path: '/services/prototype-development' },
];

const industries: NavItem[] = [
    { id: 'gov', label: 'Government & Public Sector', icon: Building2, path: '/contact' },
    { id: 'oil', label: 'Oil & Gas', icon: Factory, path: '/contact' },
    { id: 'aec', label: 'Architecture, Eng & Const.', icon: HardHat, path: '/contact' },
    { id: 'manufacturing', label: 'Industrial & Manufacturing', icon: Wrench, path: '/contact' },
    { id: 'energy', label: 'Energy & Utilities', icon: Zap, path: '/contact' },
];

export function EcosystemNav() {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLButtonElement>(null);
    const [mode, setMode] = useState<EcosystemMode>('capabilities');
    const nodesRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const navigate = useNavigate();

    // Mobile: Track expansion state
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount and resize
    useLayoutEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Auto-expand on desktop, collapse on mobile
            if (!mobile) setIsExpanded(true);
            else setIsExpanded(false);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Switch handler / Contact Handler / Mobile Expand Handler
    const handleCenterClick = () => {
        // Mobile: First click expands, subsequent clicks switch mode
        if (isMobile && !isExpanded) {
            setIsExpanded(true);
            return;
        }

        if (mode === 'industries') {
            navigate('/contact');
            return;
        }
        setMode(prev => prev === 'capabilities' ? 'industries' : 'capabilities');
    };

    // Center Node Interactions
    const handleCenterHover = () => {
        if (!centerRef.current) return;

        // Scale & Lift
        gsap.to(centerRef.current, {
            scale: 1.02,
            y: -1,
            borderColor: "rgba(255, 255, 255, 0.6)", // White on dark
            duration: 0.3,
            ease: "cubic-bezier(0.4, 0, 0.2, 1)"
        });

        // Arrow Animation (Target by class)
        gsap.to(".eco-arrow", {
            x: 5,
            color: "#FFFFFF", // White
            duration: 0.3,
            ease: "cubic-bezier(0.4, 0, 0.2, 1)"
        });
    };

    const handleCenterLeave = () => {
        if (!centerRef.current) return;

        // Reset
        gsap.to(centerRef.current, {
            scale: 1,
            y: 0,
            borderColor: "rgba(255,255,255,0.3)", // Original
            duration: 0.25,
            ease: "cubic-bezier(0.4, 0, 0.2, 1)"
        });

        gsap.to(".eco-arrow", {
            x: 0,
            color: "currentColor", // Reset color
            duration: 0.25,
            ease: "cubic-bezier(0.4, 0, 0.2, 1)"
        });
    };

    const handleCenterDown = () => {
        if (!centerRef.current) return;
        gsap.to(centerRef.current, {
            scale: 0.98,
            duration: 0.08,
            ease: "power1.out"
        });
    };

    const handleCenterUp = () => {
        // Return to hover state if still hovering, or normal if not
        if (!centerRef.current) return;
        gsap.to(centerRef.current, {
            scale: 1.02, // Assuming still hovering
            duration: 0.2,
            ease: "power1.out"
        });
    };

    const [dimensions, setDimensions] = useState({ radius: 195, centerSize: 120, nodeSize: 120, iconSize: 24 });

    useLayoutEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile
                setDimensions({
                    radius: 120,
                    centerSize: 90,
                    nodeSize: 80,
                    iconSize: 20
                });
            } else if (width < 1024) {
                // Tablet
                setDimensions({
                    radius: 150,
                    centerSize: 100,
                    nodeSize: 90,
                    iconSize: 22
                });
            } else {
                // Desktop - Increased spacing for better breathing room
                setDimensions({
                    radius: mode === 'capabilities' ? 215 : 250,
                    centerSize: 120,
                    nodeSize: 120,
                    iconSize: 24
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [mode]);

    // Derived active items
    const activeItems = mode === 'capabilities' ? services : industries;
    const { radius, centerSize, nodeSize, iconSize } = dimensions;

    // ONE-TIME Entrance Animation + Continuous Rotation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance
            gsap.fromTo(".eco-entrance",
                { opacity: 0, y: 12 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "cubic-bezier(0.4, 0, 0.2, 1)"
                }
            );

            // Subtle continuous rotation for rings
            gsap.to(".eco-parallax-ring", {
                rotation: 360,
                duration: 120, // Very slow
                repeat: -1,
                ease: "none"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Mode Switch Animation + Mobile Expansion Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Mobile: Animate nodes in when expanded
            if (isMobile && isExpanded) {
                gsap.fromTo(".eco-node",
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.04,
                        ease: "cubic-bezier(0.4, 0, 0.2, 1)"
                    }
                );
            } else if (!isMobile) {
                // Desktop: Standard mode switch animation
                gsap.fromTo(".eco-node",
                    { opacity: 0, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        stagger: 0.04,
                        ease: "power2.out"
                    }
                );
            }
        }, containerRef);
        return () => ctx.revert();
    }, [mode, isExpanded, isMobile]);

    // Parallax & Interactivity Handler
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // Disable on likely touch/mobile devices check (simplified)
        if (window.matchMedia("(hover: none)").matches) return;

        const container = containerRef.current;
        if (!container) return;

        const { width, height, left, top } = container.getBoundingClientRect();
        // Normalized coordinates (-1 to 1)
        const x = ((e.clientX - left) / width) - 0.5;
        const y = ((e.clientY - top) / height) - 0.5;

        // Parallax Container Layers
        gsap.to(".eco-parallax-ring", {
            x: x * 15,
            y: y * 15,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.to(".eco-center", {
            x: x * 8,
            y: y * 8,
            duration: 1.2,
            ease: "power2.out"
        });

        // Nodes move slightly opposite or varied for depth
        gsap.to(".eco-node", {
            x: x * 6,
            y: y * 6,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto" // Caution: Don't overwrite hover effects
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        // Reset Parallax
        gsap.to([".eco-parallax-ring", ".eco-center", ".eco-node"], {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 1.2,
            ease: "power2.out"
        });
    }, []);

    // Node Interaction
    const handleNodeHover = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        const target = e.currentTarget;

        // Contextual Focus: Dim others
        gsap.to(nodesRef.current.filter((_, i) => i !== index), {
            opacity: 0.4,
            scale: 0.98,
            duration: 0.3
        });

        // Magnetic / Active effect
        gsap.to(target, {
            opacity: 1,
            scale: 1.05,
            borderColor: "rgba(255, 255, 255, 0.5)", // White
            backgroundColor: "rgba(255, 255, 255, 0.08)", // Subtle white tint
            duration: 0.3
        });
    };

    const handleNodeLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const target = e.currentTarget;

        // Reset Focus
        gsap.to(nodesRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3
        });

        // Reset Node
        gsap.to(target, {
            scale: 1,
            borderColor: "rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.05)",
            duration: 0.3
        });
    };

    const handleNodeClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, index: number) => {
        if (mode === 'industries') {
            e.preventDefault();
            const target = e.currentTarget;

            // Interaction: Scale up triggered node, fade out others
            gsap.to(target, { scale: 1.04, duration: 0.25, ease: "cubic-bezier(0.4, 0, 0.2, 1)" });
            gsap.to(nodesRef.current.filter((_, i) => i !== index), {
                opacity: 0.3,
                duration: 0.25
            });

            // Delayed Navigation
            setTimeout(() => {
                navigate(path);
            }, 300);
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center select-none eco-entrance"
        >

            {/* Background Rings - Parallax Layer + Slow Rotation */}
            <div className="eco-parallax-ring absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.045] eco-entrance">
                {/* Inner Decoration Ring */}
                <div
                    className="absolute border border-dashed border-white/20 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: radius * 1.4, height: radius * 1.4 }}
                />

                {/* Primary Alignment Ring - Passes through outer nodes */}
                <div
                    className="absolute border border-dashed border-white/10 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: radius * 2, height: radius * 2 }}
                />
            </div>

            {/* Central Node - Toggle */}
            <button
                ref={centerRef}
                onClick={handleCenterClick}
                onMouseEnter={handleCenterHover}
                onMouseLeave={handleCenterLeave}
                onMouseDown={handleCenterDown}
                onMouseUp={handleCenterUp}
                className={cn(
                    "eco-center eco-entrance relative z-20 rounded-full flex flex-col items-center justify-center",
                    "bg-white/[0.05] backdrop-blur-sm border border-white/30",
                    "transition-all duration-300",
                    "cursor-pointer group"
                )}
                style={{ width: centerSize, height: centerSize }}
            >
                <Globe className="text-white/90 mb-2 transition-transform duration-300" strokeWidth={1.5} style={{ width: iconSize + 8, height: iconSize + 8 }} />
                <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-white/70 font-medium group-hover:text-white transition-colors duration-300">
                    {mode === 'capabilities' ? 'Our Services' : 'Explore Industries'}
                </span>
                <span className={cn(
                    "absolute -bottom-6 md:-bottom-8 text-[9px] md:text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-1 group-hover:text-white/80",
                    isMobile && !isExpanded ? "text-white/90 font-semibold animate-pulse" : "text-white/50"
                )}>
                    {isMobile && !isExpanded ? 'Tap to Explore' : mode === 'capabilities' ? 'Explore Our Services' : 'Start a Conversation'}
                    <span className="eco-arrow inline-block text-[10px] transition-colors duration-300">→</span>
                </span>
            </button>

            {/* Satellite Nodes */}
            {(!isMobile || isExpanded) && (
                <div className="absolute inset-0 pointer-events-none">
                    {activeItems.map((item, index) => {
                        const total = activeItems.length;
                        const angle = (index * (360 / total)) - 90; // Start from top
                        const radian = (angle * Math.PI) / 180;
                        const x = Math.cos(radian) * radius;
                        const y = Math.sin(radian) * radius;

                        // Compute percentage based offset for transform-free positioning
                        // Center is 50%, radius is px. 
                        // To leave transform free for GSAP, we use left/top + margin to position.
                        // x,y are relative to center (0,0).

                        return (
                            <Link
                                key={item.id}
                                ref={el => nodesRef.current[index] = el}
                                to={item.path}
                                onMouseEnter={(e) => handleNodeHover(e, index)}
                                onMouseLeave={handleNodeLeave}
                                onClick={(e) => handleNodeClick(e, item.path, index)}
                                className={cn(
                                    "eco-node absolute",
                                    "rounded-full",
                                    "flex flex-col items-center justify-center text-center p-2 md:p-3",
                                    "bg-white/[0.05] border border-white/20 backdrop-blur-sm pointer-events-auto group",
                                    // "transition-all duration-200 ease-out", // Removiing CSS transition to let GSAP handle it fully to avoid conflict
                                    "cursor-pointer"
                                )}
                                style={{
                                    // Freeing up 'transform' for GSAP
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`,
                                    marginLeft: -nodeSize / 2, // Dynamic margin
                                    marginTop: -nodeSize / 2, // Dynamic margin
                                    width: nodeSize,
                                    height: nodeSize
                                }}
                            >
                                <item.icon className="text-white/80 mb-1 lg:mb-2 pointer-events-none" strokeWidth={1.5} style={{ width: iconSize, height: iconSize }} />
                                <span className="text-[10px] md:text-[11px] leading-relaxed text-white/80 font-medium uppercase tracking-wide pointer-events-none max-w-[95px]">
                                    {item.label}
                                </span>
                                <span className="absolute -bottom-5 text-[8px] md:text-[9px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest uppercase pointer-events-none whitespace-nowrap">
                                    {mode === 'capabilities' ? 'View Page' : 'Speak with our experts'}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
