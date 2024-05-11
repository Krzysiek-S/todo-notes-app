"use client";

import React, { useRef } from "react";

import { useLoader, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import { motion } from "framer-motion";

// export default function Scene() {
//   const gltf = useLoader(GLTFLoader, "/shiba/scene.gltf");

//   return <primitive object={gltf.scene} />;
// }

export function Shiba({ handleMouseHover, handleShibaClick }: any) {
  return (
    <motion.div
      className="cursor-pointer mr-[43%] ml-[43%] h-[15%]"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onMouseEnter={handleMouseHover}
      onMouseDown={handleShibaClick}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 13 }}>
        <OrbitControls />
        <MeshComponent />
      </Canvas>
    </motion.div>
  );
}

function MeshComponent() {
  const fileUrl = "/shiba/scene.gltf";
  const mesh = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  // const meshPosition = new Mesh();
  // meshPosition.position.set(1, 1, 1);

  useFrame(() => {
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh} scale={[0.5, 0.5, 0.5]} position={[0, 0.2, 0]}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}
