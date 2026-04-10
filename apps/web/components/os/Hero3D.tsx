"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function TorusModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.35;
    meshRef.current.rotation.y += delta * 0.62;
  });

  return (
    <mesh ref={meshRef} rotation={[0.42, 0.24, 0]}>
      <torusGeometry args={[0.8, 0.28, 56, 170]} />
      <meshStandardMaterial color="#00c7a5" metalness={0.34} roughness={0.26} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="h-full w-full bg-[radial-gradient(circle_at_28%_18%,#f2fbff_0%,#ffffff_54%,#f4f7fa_100%)]">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 43 }} dpr={[1, 1.7]}>
        <ambientLight intensity={0.92} />
        <directionalLight position={[1.9, 2.4, 2.8]} intensity={1.22} />
        <pointLight position={[-2, -1.1, 1.6]} intensity={0.48} />
        <TorusModel />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
