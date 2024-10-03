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
      className="cursor-pointer mr-[45%] ml-[45%] h-[13%]"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onMouseEnter={handleMouseHover}
      onMouseDown={handleShibaClick}
    >
      <Canvas camera={{ position: [0, 0, 3.5], fov: 13 }}>
        <ambientLight intensity={2.7} />
        {/* <directionalLight position={[5, 5, 5]} intensity={1.8} /> */}
        <OrbitControls />
        <MeshComponent />
      </Canvas>
    </motion.div>
  );
}

function MeshComponent() {
  const fileUrl = "/shiba/dog1.glb";
  const mesh = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  // const meshPosition = new Mesh();
  // meshPosition.position.set(1, 1, 1);

  useFrame(() => {
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh} scale={[0.45, 0.45, 0.45]} position={[0, 0.02, 0]}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}
