"use client";

import React, { useRef, useState } from "react";

import { useLoader, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial } from "three";

interface SwitchLightProps {
  handleButtonColored: () => void;
}

export const Button: React.FC<SwitchLightProps> = ({ handleButtonColored }) => {
  const [isPressed, setPressed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  // const handleClick = () => {
  //   setPressed((prevState) => !prevState);
  //   console.log("BUTTON: ", isPressed);
  // };

  const handleMouseDown = () => {
    setIsHolding(false);
    holdTimer.current = setTimeout(() => {
      setIsHolding(true);
    }, 200); // Czas, po którym uznajesz, że użytkownik przytrzymuje przycisk
  };

  const handleMouseUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
    }
    if (!isHolding) {
      handleButtonColored();
    }
    setIsHolding(false);
  };

  return (
    <div
      className="h-[80px] w-[100px]  cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Canvas
        camera={{ position: [9, 0, 0], fov: 8 }}
        className="flex items-center"
        shadows
      >
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 7, 7]} intensity={0.8} castShadow />
        <MeshComponent />
      </Canvas>
    </div>
  );
};

function MeshComponent() {
  const [isColored, setColored] = useState(false);

  const pressedButton = "/switch/b1.glb";
  const pressedButton1 = "/switch/b2.glb";
  const unpressedButton = "/switch/unpressed.gltf";
  const gltfUnpressedButton = useLoader(GLTFLoader, unpressedButton);
  const gltfPressedButton = useLoader(GLTFLoader, pressedButton);
  const gltfPressedButton1 = useLoader(GLTFLoader, pressedButton1);

  return (
    <>
      <mesh
        scale={[0.25, 0.25, 0.25]}
        position={[0.05, -0.15, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={gltfPressedButton.scene} />
      </mesh>
      <mesh scale={[0.25, 0.25, 0.25]} position={[0.05, -0.15, 0]}>
        <primitive object={gltfPressedButton1.scene} />
      </mesh>
    </>
  );
}
