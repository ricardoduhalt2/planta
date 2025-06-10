import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Extender las interfaces de Three.js
declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      pointsMaterial: any;
      bufferGeometry: any;
      meshStandardMaterial: any;
      boxGeometry: any;
      mesh: any;
      group: any;
      color: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

// Spinner component
const Spinner = () => (
  <div className="relative w-16 h-16 mb-8">
    <div className="absolute inset-0 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
    <div className="absolute inset-1 border-4 border-t-4 border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
  </div>
);

// Animated dots component
const AnimatedDots = () => {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return <span className="inline-block min-w-[24px] text-left">{dots}</span>;
};

// Logo with fade-in effect and smaller size
const LogoBackground = ({ progress }: { progress: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const scale = useRef(0.3); // Start smaller
  
  // Load logo texture once
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    textureRef.current = loader.load('/images/LOGO PETGAS NEW.png');
    if (textureRef.current) {
      textureRef.current.wrapS = THREE.ClampToEdgeWrapping;
      textureRef.current.wrapT = THREE.ClampToEdgeWrapping;
    }
    
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, []);
  
  // Smooth scale animation
  useFrame(() => {
    if (ref.current) {
      // Smoothly increase scale from 0.3 to 0.6 based on progress
      scale.current = 0.3 + (progress / 100) * 0.3;
      ref.current.scale.set(scale.current, scale.current, 1);
      
      // Subtle rotation
      ref.current.rotation.z = Math.sin(Date.now() * 0.0005) * 0.1;
    }
  });
  
  return (
    <group>
      <mesh ref={ref} position={[0, 0, 0]} scale={[0.3, 0.3, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          map={textureRef.current}
          color="#ffffff" 
          transparent 
          opacity={0.1 + (progress / 100) * 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Progress bar component with animation
const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-400 rounded-full relative"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.div 
            className="absolute inset-0 bg-white opacity-20"
            animate={{ 
              left: ['0%', '100%'],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// 3D Cubes with defragmentation effect
const ParticleCubes = ({ count = 150 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const clockRef = useRef(new THREE.Clock());
  
  // Cube data with initial and target positions
  const cubes = useRef<Array<{
    startPos: [number, number, number];
    targetPos: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    speed: number;
    progress: number;
    delay: number;
    color: string;
    emissive: string;
  }>>([]);

  // Initialize cubes in a grid pattern that will defragment
  useEffect(() => {
    const gridSize = Math.ceil(Math.cbrt(count));
    const spacing = 0.5;
    const halfSize = (gridSize * spacing) / 2;
    
    const newCubes = [];
    let index = 0;
    
    for (let x = 0; x < gridSize && index < count; x++) {
      for (let y = 0; y < gridSize && index < count; y++) {
        for (let z = 0; z < gridSize && index < count; z++, index++) {
          // Start position (grid)
          const startX = (x * spacing) - halfSize;
          const startY = (y * spacing) - halfSize;
          const startZ = (z * spacing) - halfSize;
          
          // Target position (sphere around center)
          const radius = 1.5 + Math.random() * 1.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          const targetX = Math.sin(phi) * Math.cos(theta) * radius;
          const targetY = Math.sin(phi) * Math.sin(theta) * radius;
          const targetZ = Math.cos(phi) * radius;
          
          // Alternate between green and yellow
          const isGreen = Math.random() > 0.5;
          
          newCubes.push({
            startPos: [startX, startY, startZ] as [number, number, number],
            targetPos: [targetX, targetY, targetZ] as [number, number, number],
            position: [startX, startY, startZ] as [number, number, number],
            rotation: [
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2
            ] as [number, number, number],
            scale: 0.08 + Math.random() * 0.12, // Larger cubes
            speed: 0.5 + Math.random() * 0.5,
            progress: 0,
            delay: Math.random() * 2, // Stagger the animation
            color: isGreen ? "#00ff88" : "#ffcc00",
            emissive: isGreen ? "#00aa55" : "#cc9900"
          });
        }
      }
    }
    
    cubes.current = newCubes;
  }, [count]);
  
  // Animation
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    
    const time = clockRef.current.getElapsedTime();
    
    // Update each cube's position and rotation
    cubes.current.forEach((cube, i) => {
      if (time < cube.delay) return;
      
      // Ease in-out progress
      const elapsed = Math.min(time - cube.delay, 3) / 3; // 3 seconds to reach target
      cube.progress = Math.min(elapsed * cube.speed, 1);
      
      // Smooth step easing
      const t = cube.progress < 0.5 
        ? 2 * cube.progress * cube.progress 
        : 1 - Math.pow(-2 * cube.progress + 2, 2) / 2;
      
      // Interpolate position
      cube.position[0] = cube.startPos[0] + (cube.targetPos[0] - cube.startPos[0]) * t;
      cube.position[1] = cube.startPos[1] + (cube.targetPos[1] - cube.startPos[1]) * t;
      cube.position[2] = cube.startPos[2] + (cube.targetPos[2] - cube.startPos[2]) * t;
      
      // Update rotation
      if (group.children[i]) {
        const mesh = group.children[i] as THREE.Mesh;
        mesh.position.set(cube.position[0], cube.position[1], cube.position[2]);
        
        // Add some rotation
        mesh.rotation.x = cube.rotation[0] + time * 0.5;
        mesh.rotation.y = cube.rotation[1] + time * 0.7;
        mesh.rotation.z = cube.rotation[2] + time * 0.3;
        
        // Scale up from 0 to target scale
        const scale = cube.scale * Math.min(1, (time - cube.delay) * 2);
        mesh.scale.set(scale, scale, scale);
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {cubes.current.map((cube, i) => (
        <mesh
          key={i}
          position={cube.position}
          scale={[cube.scale, cube.scale, cube.scale]}
          rotation={cube.rotation}
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial 
            color={cube.color}
            emissive={cube.emissive}
            emissiveIntensity={1.5} // Brighter
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={1}
            envMapIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main loading screen component
const LoadingScreen = ({ onLoaded }: { onLoaded: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Simulate loading progress
  useEffect(() => {
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += Math.random() * 10;
      if (progressValue >= 100) {
        progressValue = 100;
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(onLoaded, 1000); // Wait for animation to complete
      }
      setProgress(Math.min(progressValue, 100));
    }, 300);
    
    return () => clearInterval(interval);
  }, [onLoaded]);
  
  // Loading messages with context for Petgas
  const loadingMessages = [
    "Initializing gas monitoring systems",
    "Calibrating pressure sensors",
    "Establishing secure connections",
    "Preparing real-time analytics",
    "Optimizing data pipelines",
    "Finalizing system checks",
    "Ready to optimize your operations"
  ];
  
  // Get current loading message based on progress
  const getLoadingMessage = () => {
    const messageIndex = Math.min(
      Math.floor(progress / (100 / (loadingMessages.length - 1))),
      loadingMessages.length - 1
    );
    
    return (
      <span className="flex items-center">
        {loadingMessages[messageIndex]}
        <AnimatedDots />
      </span>
    );
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-50 p-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5, delay: isComplete ? 0.5 : 0 }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff88" />
          <pointLight position={[-10, -10, 5]} intensity={1.0} color="#ffcc00" />
          <pointLight position={[0, 0, 10]} intensity={0.8} color="#ffffff" />
          <ParticleCubes count={150} />
          <LogoBackground progress={progress} />
        </Canvas>
      </div>
      
      {/* Loading Content */}
      <motion.div 
        className="relative z-10 text-center max-w-2xl w-full flex flex-col items-center justify-center"
        style={{ marginTop: '50vh' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Spinner />
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-400">
          Loading
        </h1>
        
        <p className="text-gray-300 mb-6 text-lg font-mono font-medium">
          {getLoadingMessage()}
        </p>
        
        <div className="w-full max-w-md mx-auto mt-4">
          <ProgressBar progress={progress} />
        </div>
        
        <p className="text-xs text-gray-600 mt-8">
          © {new Date().getFullYear()} Petgas. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
