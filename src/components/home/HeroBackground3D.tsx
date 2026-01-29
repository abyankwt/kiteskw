
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useLanguage } from "@/contexts/LanguageContext";

function SimulationGrid() {
    const gridRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.position.z = (state.clock.elapsedTime * 0.15) % 2;
        }
    });

    return (
        <group ref={gridRef} position={[0, -2, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
            <gridHelper args={[60, 60, 0x2dd4bf, 0x111827]} position={[0, 0, 0]} />
            <gridHelper args={[60, 12, 0x38bdf8, 0x111827]} position={[0, 0.01, 0]} />
        </group>
    );
}

function DataNode({ position, color, delay }: { position: [number, number, number], color: string, delay: number }) {
    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
            <mesh position={position}>
                <icosahedronGeometry args={[0.15, 0]} />
                <meshBasicMaterial color={color} wireframe />
            </mesh>
            {/* Simple Glow Mesh */}
            <mesh position={position}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
            </mesh>
        </Float>
    );
}

// Procedural Nodes & Connections
function Network() {
    const count = 15;
    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 12;
            const y = (Math.random() - 0.5) * 6;
            const z = (Math.random() - 0.5) * 4;
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, []);

    const linesGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const points: number[] = [];

        // Create random connections
        nodes.forEach((node, i) => {
            // Connect to nearest neighbors
            nodes.forEach((other, j) => {
                if (i !== j && node.distanceTo(other) < 4) {
                    points.push(node.x, node.y, node.z);
                    points.push(other.x, other.y, other.z);
                }
            });
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        return geometry;
    }, [nodes]);

    useFrame((state) => {
        // Subtle rotation of the whole network
        const t = state.clock.getElapsedTime();
        if (state.scene) {
            // We can rotate a group if we wrapped this
        }
    });

    return (
        <group>
            {nodes.map((pos, i) => (
                <DataNode
                    key={i}
                    position={[pos.x, pos.y, pos.z]}
                    color={i % 3 === 0 ? "#2dd4bf" : (i % 3 === 1 ? "#38bdf8" : "#fbbf24")}
                    delay={i}
                />
            ))}
            <lineSegments geometry={linesGeometry}>
                <lineBasicMaterial color="#38bdf8" transparent opacity={0.15} />
            </lineSegments>
        </group>
    );
}

function Scene({ isRTL }: { isRTL: boolean }) {
    useFrame(({ mouse, camera }) => {
        // Subtle Parallax
        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <SimulationGrid />
            <Network />
        </>
    );
}

export function HeroBackground3D({ className }: { className?: string }) {
    const { isRTL } = useLanguage();

    return (
        <div className={className}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <Scene isRTL={isRTL} />
            </Canvas>
        </div>
    );
}
