import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text as TextImpl } from 'troika-three-text';
import { useLanguage } from '../contexts/LanguageContext';
import { MAIN_LOGO_URL } from '../constants';
import EtherealSky from './EtherealSky';

// Extend Three.js with Text
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textImpl: any;
    }
  }
}

extend({ TextImpl });

// Componente de partículas mejorado con efectos
const FloatingParticles = ({ count = 2000 }) => {
  const particles = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  
  const { positions, colors, sizes } = useMemo(() => {
    const pos = [];
    const cols = [];
    const sizs = [];
    
    for (let i = 0; i < count; i++) {
      // Posiciones en una esfera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 300 + Math.random() * 200;
      
      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Colores aleatorios con tonos verdes y azules
      cols.push(
        0.1 + Math.random() * 0.4,
        0.5 + Math.random() * 0.5,
        0.3 + Math.random() * 0.4
      );
      
      // Tamaños aleatorios
      sizs.push(1 + Math.random() * 4);
    }
    
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(cols),
      sizes: new Float32Array(sizs)
    };
  }, [count]);

  useFrame((state) => {
    if (particles.current) {
      const time = state.clock.getElapsedTime();
      particles.current.rotation.x = time * 0.05;
      particles.current.rotation.y = time * 0.03;
      
      // Efecto de pulsación sutil
      const scale = hovered ? 1.2 : 1;
      particles.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.1
      );
    }
  });

  return (
    <points 
      ref={particles}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        alphaTest={0.01}
      />
    </points>
  );
};

// Tipos para los props del componente AnimatedText
interface AnimatedTextProps {
  children?: React.ReactNode; // Hacemos children opcional
  position?: [number, number, number];
  size?: number;
  color?: string;
}

// Componente de texto 3D animado simplificado
const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  position = [0, 0, 0], 
  size = 1, 
  color = '#ffffff'
}) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      // Efecto de flotación suave
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      // Rotación sutil
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  // Usamos un cubo simple que se mueve como marcador de posición
  return (
    <mesh 
      ref={ref} 
      position={position as [number, number, number]}
      scale={[size * 0.5, size * 0.2, size * 0.5]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.8}
      />
    </mesh>
  );
};

// Tipos para los props del componente Ring
interface RingProps {
  radius: number;
  speed: number;
  opacity: number;
}

// Componente de anillo individual
const Ring: React.FC<RingProps> = ({ radius, speed, opacity }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * speed;
      ref.current.rotation.y = clock.getElapsedTime() * (speed * 0.7);
    }
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[radius, radius + 0.5, 64]} />
      <meshBasicMaterial
        color="#88ff88"
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Componente de anillos concéntricos
const ConcentricRings: React.FC<{ count?: number }> = ({ count = 5 }) => {
  const rings = useMemo(() => {
    const rings: RingProps[] = [];
    for (let i = 0; i < count; i++) {
      rings.push({
        radius: 10 + i * 5,
        speed: 0.2 + i * 0.05,
        opacity: 0.2 + (i / count) * 0.8,
      });
    }
    return rings;
  }, [count]);

  return (
    <group>
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </group>
  );
};

// Componente principal de carga mejorado
const LoadingScreen: React.FC = () => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const fullText = 'CARGANDO PRESENTACIÓN DE PETGAS';
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Efecto para la animación de texto tipo terminal
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTerminalText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, Math.random() * 100 + 50);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Efecto para la barra de progreso
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);
    
    // Mostrar mensaje de bienvenida después de 1.5 segundos
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 1500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(welcomeTimer);
    };
  }, [t]); // Añadido t como dependencia

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <Canvas 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1
        }}
        camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 10 }}
      >
        <EtherealSky />
      </Canvas>
      <div className="absolute inset-0">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 1000 }}
          style={{ background: 'transparent' }}
        >
        <FloatingParticles count={3000} />
        <ConcentricRings count={8} />
        
        {/* Elementos decorativos */}
        <group position={[0, 2, 0]}>
          <AnimatedText position={[0, 0, 0]} size={1.5} color="#88ff88" />
          {showWelcome && (
            <AnimatedText position={[0, -1.5, 0]} size={0.5} color="#ffffff" />
          )}
        </group>
        
        {/* Luces */}
        <ambientLight intensity={0.5} color="#88ff88" />
        <pointLight position={[10, 10, 10]} intensity={1} color="#88ff88" />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00aaff" />
        
        {/* Efecto de lente */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
        </mesh>
        </Canvas>
      </div>
      
      {/* Spinner futurista más grande */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-32 h-32">
          {/* Anillo exterior */}
          <div className="absolute inset-0 border-4 border-transparent border-t-green-400 border-r-cyan-400 rounded-full animate-spin-slow" 
               style={{
                 boxShadow: '0 0 15px rgba(136, 255, 136, 0.7)',
                 filter: 'blur(1px)'
               }}>
          </div>
          
          {/* Anillo interior */}
          <div className="absolute inset-2 border-4 border-transparent border-b-cyan-400 border-l-green-400 rounded-full animate-spin-slow-reverse"
               style={{
                 boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                 filter: 'blur(0.5px)'
               }}>
          </div>
          
          {/* Punto central */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-400 to-cyan-500"
               style={{
                 boxShadow: '0 0 20px rgba(136, 255, 255, 0.8)',
                 animation: 'pulse 2s infinite'
               }}>
          </div>
        </div>
      </div>
      
      {/* Logo y mensaje de carga */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="relative flex flex-col items-center transform scale-100 md:scale-110 transition-all duration-500">
          <img 
            src={MAIN_LOGO_URL} 
            alt={t('petgasLoadingLogoAlt')} 
            className="h-20 md:h-28 mb-6 opacity-90 transition-all duration-1000"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(136, 255, 136, 0.8))',
              transform: `scale(${1 + Math.sin(progress * 0.1) * 0.05})`
            }}
          />
          
          {/* Mensaje de carga con efecto de gradiente */}
          <h2 className="text-2xl md:text-3xl font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-cyan-300"
              style={{
                textShadow: '0 0 10px rgba(136, 255, 200, 0.5)',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% auto',
                animation: 'gradientText 3s ease infinite',
                letterSpacing: '0.1em'
              }}>
            {t('loading')}
          </h2>
          
          {/* Texto de carga tipo terminal */}
          <div className="mt-6 font-mono text-green-400 text-sm md:text-base bg-black bg-opacity-50 px-4 py-2 rounded-md">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">$</span>
              <div>
                <div className="inline-block">
                  <span>{terminalText}</span>
                  <span className="animate-pulse">_</span>
                </div>
                {currentIndex >= fullText.length && (
                  <div className="text-green-300 mt-1">
                    {t('loading').toUpperCase()}...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-900 opacity-20" />
      
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 3s linear infinite;
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(0.95);
            opacity: 0.8;
          } 
          50% { 
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .glow {
          text-shadow: 0 0 10px #88ff88, 0 0 20px #88ff88, 0 0 30px #00ff88;
          filter: drop-shadow(0 0 5px rgba(136, 255, 136, 0.7));
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
