
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function JourneyPath({ progress }: { progress: number }) {
    const curve = useMemo(() => {
        const points = [];
        for (let i = 0; i < 5; i++) {
            points.push(new THREE.Vector3(0, -i * 2.5, 0));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    const tubeRef = useRef<THREE.Mesh>(null);
    const geometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.1, 8, false), [curve]);

    useFrame(() => {
        if (tubeRef.current && Array.isArray(tubeRef.current.material)) {
            // If we were using shaders, we'd update uniform. 
            // With basic material, we can't easily "draw" it without custom shader or strokeDashoffset equivalent.
            // Simplification: Move a "head" object along the path.
        }
    });

    return (
        <group position={[0, 4, 0]}>
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#1e293b" transparent opacity={0.3} wireframe />
            </mesh>
            {/* Active Path - Simulated by a separate object or just nodes lighting up */}
            <ProgressHead curve={curve} progress={progress} />
            <JourneyNodes curve={curve} progress={progress} />
        </group>
    );
}

function ProgressHead({ curve, progress }: { curve: THREE.CatmullRomCurve3, progress: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            const point = curve.getPointAt(Math.min(0.99, Math.max(0.01, progress)));
            meshRef.current.position.copy(point);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
            <pointLight distance={3} intensity={2} color="#38bdf8" />
        </mesh>
    );
}

function JourneyNodes({ curve, progress }: { curve: THREE.CatmullRomCurve3, progress: number }) {
    const steps = [0.1, 0.3, 0.5, 0.7, 0.9]; // positions along curve

    return (
        <group>
            {steps.map((val, i) => (
                <Node key={i} curve={curve} val={val} active={progress >= val} />
            ))}
        </group>
    );
}

function Node({ curve, val, active }: { curve: THREE.CatmullRomCurve3, val: number, active: boolean }) {
    const pos = useMemo(() => curve.getPointAt(val), [curve, val]);

    return (
        <group position={pos}>
            <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
                <mesh scale={active ? 1.2 : 1}>
                    <icosahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial
                        color={active ? "#2dd4bf" : "#64748b"}
                        emissive={active ? "#2dd4bf" : "#000000"}
                        emissiveIntensity={active ? 1 : 0}
                        wireframe
                    />
                </mesh>
            </Float>
        </group>
    );
}

function JourneyScene({ progress }: { progress: number }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <JourneyPath progress={progress} />
        </>
    );
}

export function TrainingJourney3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        let ctx: ReturnType<typeof gsap.context> | null = null;

        const rafId = requestAnimationFrame(() => {
            if (!containerRef.current) return;

            ctx = gsap.context(() => {
                try {
                    ScrollTrigger.create({
                        trigger: containerRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1,
                        onUpdate: (self) => {
                            setProgress(self.progress);
                        }
                    });
                } catch (error) {
                    console.error("ScrollTrigger initialization error:", error);
                }
            }, containerRef);
        });

        // CRITICAL: Clean up BOTH the RAF and the GSAP context
        return () => {
            cancelAnimationFrame(rafId);
            if (ctx) {
                ctx.revert();
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="h-[150vh] w-full relative sm:h-[120vh]">
            <div className="sticky top-20 h-[80vh] w-full">
                <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                    <JourneyScene progress={progress} />
                </Canvas>

                {/* HTML Labels overlaid */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-start pt-[20vh] space-y-[15vh]">
                    <div className={`transition-opacity duration-500 ${progress > 0.05 ? 'opacity-100' : 'opacity-30'}`}>
                        <span className="bg-slate-900/80 text-white px-4 py-2 rounded border border-slate-700 text-sm font-mono">Foundations</span>
                    </div>
                    <div className={`transition-opacity duration-500 ${progress > 0.25 ? 'opacity-100' : 'opacity-30'}`}>
                        <span className="bg-slate-900/80 text-white px-4 py-2 rounded border border-slate-700 text-sm font-mono">Core Skills</span>
                    </div>
                    <div className={`transition-opacity duration-500 ${progress > 0.45 ? 'opacity-100' : 'opacity-30'}`}>
                        <span className="bg-slate-900/80 text-white px-4 py-2 rounded border border-slate-700 text-sm font-mono">Advanced Sim</span>
                    </div>
                    <div className={`transition-opacity duration-500 ${progress > 0.65 ? 'opacity-100' : 'opacity-30'}`}>
                        <span className="bg-slate-900/80 text-white px-4 py-2 rounded border border-slate-700 text-sm font-mono">Certification</span>
                    </div>
                    <div className={`transition-opacity duration-500 ${progress > 0.85 ? 'opacity-100' : 'opacity-30'}`}>
                        <span className="bg-slate-900/80 text-white px-4 py-2 rounded border border-slate-700 text-sm font-mono">Expertise</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
