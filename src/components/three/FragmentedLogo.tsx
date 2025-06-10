import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Interfaz para los datos de los cubos
interface CubeData {
  startPos: [number, number, number];
  targetPos: [number, number, number];
  size: number;
  color: string;
  delay: number;
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
}

// Colores para el efecto de fragmentación (verdes y amarillos)
const LOGO_COLORS = [
  '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', // Verdes
  '#C5E1A5', '#DCE775', '#FFF176', '#FFD54F', '#FFC107'  // Amarillos
];

// Tamaño de la cuadrícula para los cubos
const GRID_SIZE = 30;
const ASPECT_RATIO = 4; // Relación de aspecto 4:1

// Función para generar las posiciones iniciales aleatorias
const generateInitialPositions = (count: number): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  const spread = 25; // Aumentado para mayor dispersión
  
  for (let i = 0; i < count; i++) {
    // Crear un patrón de dispersión más interesante
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * spread;
    const height = (Math.random() - 0.5) * spread * 0.5;
    
    positions.push([
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ]);
  }
  
  return positions;
};

// Componente para el logo plano que aparecerá gradualmente
const FadingLogo = ({ progress }: { progress: number }) => {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[8, 2, 1]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent
        opacity={progress * 0.8} // Opacidad basada en el progreso
      />
    </mesh>
  );
};

// Componente principal del logo desfragmentado

export const FragmentedLogo = () => {
  const [cubes, setCubes] = useState<CubeData[]>([]);
  const [progress, setProgress] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  
  // Generar los cubos que formarán el logo
  useEffect(() => {
    const newCubes: CubeData[] = [];
    const gridSizeX = GRID_SIZE;
    const gridSizeY = Math.ceil(GRID_SIZE / ASPECT_RATIO);
    const spacing = 0.6;
    
    // Generar posiciones iniciales aleatorias
    const initialPositions = generateInitialPositions(gridSizeX * gridSizeY);
    
    let index = 0;
    
    // Crear una cuadrícula de cubos
    for (let x = 0; x < gridSizeX; x++) {
      for (let y = 0; y < gridSizeY; y++) {
        const size = 0.1 + Math.random() * 0.05;
        const color = LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
        
        // Posición objetivo en la cuadrícula (centrada)
        const targetX = (x - gridSizeX / 2) * spacing;
        const targetY = (y - gridSizeY / 2) * spacing * 0.8;
        
        // Crear rotaciones y velocidades aleatorias
        const rotation: [number, number, number] = [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ];
        
        const rotationSpeed: [number, number, number] = [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ];
        
        newCubes.push({
          startPos: initialPositions[index++],
          targetPos: [targetX, targetY, 0] as [number, number, number],
          size,
          color,
          delay: Math.random() * 0.7, // Mayor rango de retraso
          rotation,
          rotationSpeed
        });
      }
    }
    
    setCubes(newCubes);
    
    // Iniciar la aparición gradual del logo
    const timer = setTimeout(() => {
      setLogoOpacity(1);
    }, 1000);
    
    return () => clearTimeout(timer);
    
    // Iniciar animación
    const animate = () => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 0.003, 1); // Animación más lenta
        
        // Actualizar rotación del grupo
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.002;
        }
        
        return newProgress;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    let animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Actualizar rotación de los cubos
  useFrame(() => {
    setCubes(currentCubes => 
      currentCubes.map(cube => ({
        ...cube,
        rotation: [
          cube.rotation[0] + cube.rotationSpeed[0],
          cube.rotation[1] + cube.rotationSpeed[1],
          cube.rotation[2] + cube.rotationSpeed[2]
        ] as [number, number, number]
      }))
    );
  });

  return (
    <group position={[0, 0, 0]} scale={[1, 1, 1]} ref={groupRef}>
      {/* Logo plano que aparece gradualmente */}
      <FadingLogo progress={logoOpacity} />
      
      {/* Cubos del efecto de desfragmentación */}
      <group>
        {cubes.map((cube, index) => {
          // Interpolar entre la posición inicial y la objetivo
          const x = cube.startPos[0] + (cube.targetPos[0] - cube.startPos[0]) * progress;
          const y = cube.startPos[1] + (cube.targetPos[1] - cube.startPos[1]) * progress;
          const z = cube.startPos[2] + (cube.targetPos[2] - cube.startPos[2]) * progress;
          
          // Aplicar easing para un movimiento más natural
          const easedProgress = progress < cube.delay 
            ? 0 
            : Math.pow((progress - cube.delay) / (1 - cube.delay), 1.5); // Easing más pronunciado
            
          // Calcular opacidad basada en el progreso
          const opacity = Math.min(1, progress * 1.5);
          
          // Escala inicial más pequeña que crece al acercarse
          const scale = 0.3 + easedProgress * 0.7;
          
          return (
            <mesh
              key={index}
              position={[x, y, z]}
              rotation={cube.rotation}
              scale={[scale, scale, scale * 0.5]} // Aplanar un poco los cubos
            >
              <boxGeometry args={[cube.size, cube.size, cube.size * 0.5]} />
              <meshStandardMaterial 
                color={cube.color}
                metalness={0.5}
                roughness={0.3}
                emissive={cube.color}
                emissiveIntensity={0.3}
                transparent
                opacity={opacity}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Efectos de iluminación mejorados */}
      <ambientLight intensity={0.7} color="#ffffff" />
      <pointLight 
        position={[15, 10, 15]} 
        intensity={2.0} 
        color="#a5d6a7" 
        distance={40}
        castShadow
      />
      <pointLight 
        position={[-15, 5, 10]} 
        intensity={1.5} 
        color="#ffeb3b" 
        distance={35}
      />
      <pointLight 
        position={[0, -15, 5]} 
        intensity={0.8} 
        color="#00a8f3" 
        distance={50}
      />
      
      {/* Luz ambiental direccional para mejor iluminación */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
    </group>
  );
};

export default FragmentedLogo;
