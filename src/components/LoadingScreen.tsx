import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Componente de partículas optimizado
const FloatingParticles = ({ count = 800 }) => {
  const particles = useRef<THREE.Points>(null);
  
  // Generar posiciones y colores de partículas
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Posiciones en una esfera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 15;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colores en tonos verdes
      const green = 0.3 + Math.random() * 0.7;
      cols[i * 3] = 0.1 * green;
      cols[i * 3 + 1] = 0.5 * green;
      cols[i * 3 + 2] = 0.2 * green;
    }
    
    return { positions: pos, colors: cols };
  }, [count]);
  
  // Animación de las partículas
  useFrame(({ clock }) => {
    if (particles.current) {
      particles.current.rotation.y = clock.getElapsedTime() * 0.1;
      particles.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        alphaTest={0.01}
      />
    </points>
  );
};

// Componente de texto flotante
const FloatingText = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-green-400 to-green-500">
        PETGAS
      </h1>
      <p className="text-green-200 text-sm">Iniciando sistema...</p>
    </div>
  );
};

// Componente principal de la pantalla de carga
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ 
      background: 'radial-gradient(ellipse at center, #001a0d 0%, #000000 100%)',
      opacity: 0.9,
      transition: 'opacity 0.8s ease-in-out'
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .glow {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(0, 90, 48, 0.15) 0%, transparent 70%);
            animation: float 8s ease-in-out infinite;
          }
          @keyframes spin-slow {
            to { transform: rotate(360deg); }
          }
          .spin-slow {
            animation: spin-slow 10s linear infinite;
          }
          @keyframes gradientText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `
      }} />
      <div className="glow" />
      <Canvas 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          background: 'transparent',
          opacity: 0.8
        }}
        camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 100 }}
      >
        <FloatingParticles count={800} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ff88" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00aaff" />
        <fog attach="fog" args={['#001a0d', 10, 50]} />
      </Canvas>
      
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative">
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Anillo exterior - gira lentamente en sentido horario */}
            <div className="absolute inset-0 border-4 border-transparent border-t-green-400 border-r-green-500 rounded-full spin-slow" 
                 style={{ boxShadow: '0 0 15px rgba(0, 255, 100, 0.3)' }}></div>
            
            {/* Anillo intermedio - gira en sentido antihorario */}
            <div className="absolute inset-3 border-4 border-transparent border-b-green-400 border-l-green-500 rounded-full spin-slow" 
                 style={{ animationDirection: 'reverse', boxShadow: '0 0 10px rgba(0, 200, 100, 0.3)' }}></div>
            
            {/* Anillo interior - gira más rápido en sentido horario */}
            <div className="absolute inset-6 border-4 border-transparent border-t-green-300 border-r-green-400 rounded-full spin-slow" 
                 style={{ animationDuration: '5s', boxShadow: '0 0 8px rgba(0, 255, 150, 0.3)' }}></div>
            
            {/* Centro con gradiente y brillo */}
            <div className="absolute inset-8 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center"
                 style={{ boxShadow: '0 0 20px rgba(0, 255, 100, 0.4)' }}>
              <div className="absolute inset-0.5 bg-green-600 rounded-full blur-sm opacity-70"></div>
            </div>
          </div>
          
          <FloatingText />
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
