"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Torus } from "@react-three/drei";

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={2} />
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.2}>
        <Torus args={[1, 0.35, 32, 100]}>
          <meshStandardMaterial color="#00F5D4" metalness={0.5} roughness={0.1} />
        </Torus>
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
  );
}
