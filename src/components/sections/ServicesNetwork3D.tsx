
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const NODE_POSITIONS: Record<string, [number, number, number]> = {
    "consultation": [-4, 1, 0],
    "software-distribution": [-1.5, 1, 0],
    "prototype-development": [1.5, 1, 0],
    "training": [4, 1, 0]
};

function CentralNode() {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[0, -2, 0]}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial color="#0f172a" wireframe />
            </mesh>
            <mesh position={[0, -2, 0]}>
                <sphereGeometry args={[0.4]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
            </mesh>
        </Float>
    );
}

function ServiceNode({ position, active, color }: { position: [number, number, number], active: boolean, color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.scale.lerp(new THREE.Vector3(active ? 1.5 : 1, active ? 1.5 : 1, active ? 1.5 : 1), delta * 4);
        }
    });

    return (
        <group position={position}>
            <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                <mesh ref={meshRef}>
                    <icosahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial
                        color={active ? color : "#94a3b8"}
                        wireframe
                        transparent
                        opacity={active ? 1 : 0.3}
                    />
                </mesh>
            </Float>
        </group>
    );
}

function ConnectionLine({ start, end, active }: { start: [number, number, number], end: [number, number, number], active: boolean }) {
    return (
        <Line
            points={[start, end]}
            color={active ? "#38bdf8" : "#e2e8f0"}
            lineWidth={active ? 2 : 1}
            transparent
            opacity={active ? 0.8 : 0.1}
        />
    );
}

function Scene({ hoveredId }: { hoveredId: string | null }) {
    return (
        <>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} />

            <CentralNode />

            {Object.entries(NODE_POSITIONS).map(([id, pos]) => (
                <group key={id}>
                    <ServiceNode
                        position={pos}
                        active={hoveredId === id}
                        color="#0ea5e9"
                    />
                    <ConnectionLine
                        start={[0, -2, 0]}
                        end={pos}
                        active={hoveredId === id}
                    />
                </group>
            ))}
        </>
    );
}

export function ServicesNetwork3D({ hoveredId, className }: { hoveredId: string | null, className?: string }) {
    return (
        <div className={className}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <Scene hoveredId={hoveredId} />
            </Canvas>
        </div>
    );
}
