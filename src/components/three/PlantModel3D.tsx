import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Componente para la planta 3D
const PlantModel = () => {
  // Cargar la textura de la imagen de la planta
  const texture = useTexture('https://www.petgas.com.mx/wp-content/uploads/2025/06/planta.png');
  
  // Crear geometría para la planta
  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 6), []);
  
  // Material con la textura
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ 
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      emissive: '#009A44',
      emissiveIntensity: 0.3,
      roughness: 0.7,
      metalness: 0.3
    }),
    [texture]
  );

  // Referencia al mesh para animación
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animación de rotación
  useFrame((state) => {
    if (meshRef.current) {
      // Rotación suave en el eje Y
      meshRef.current.rotation.y += 0.002;
      
      // Movimiento de flotación suave
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={material}
      rotation={[0, 0, 0]}
    >
      {/* Luces para mejorar la visualización */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8CC63F" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#009A44" />
    </mesh>
  );
};

// Componente para la cámara con animación tipo dron
const DroneCamera = () => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(({ clock }) => {
    // Movimiento de cámara circular
    const time = clock.getElapsedTime();
    const radius = 15;
    const speed = 0.2;
    
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(time * speed) * radius;
      cameraRef.current.position.z = Math.cos(time * speed) * radius;
      cameraRef.current.position.y = 5 + Math.sin(time * 0.5) * 2;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 5, 15]}
      fov={45}
      near={0.1}
      far={1000}
    />
  );
};

// Componente principal del canvas 3D
export const Plant3DAnimation = () => {
  return (
    <div className="w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-900 rounded-xl overflow-hidden">
      <Canvas>
        <color attach="background" args={['#111827']} />
        <DroneCamera />
        <PlantModel />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        <gridHelper args={[20, 20, '#009A44', '#8CC63F']} rotation={[Math.PI / 2, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default Plant3DAnimation;
