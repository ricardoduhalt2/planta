import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Contador de recursos cargados
let resourcesLoaded = 0;
const totalResources = 3; // Ajusta según el número de recursos críticos

// Hook para manejar la carga de recursos
const useResourceLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const resourceLoaded = () => {
    resourcesLoaded++;
    const newProgress = Math.min(100, Math.round((resourcesLoaded / totalResources) * 100));
    setProgress(newProgress);
    
    if (resourcesLoaded >= totalResources) {
      setTimeout(() => setIsLoaded(true), 500); // Pequeño delay para la animación
    }
  };

  return { progress, isLoaded, resourceLoaded };
};

// Componente de partículas optimizado
export const FloatingParticles = ({ count = 300, onLoad }: { count?: number; onLoad: () => void }) => {
  const particles = useRef<THREE.Points>(null);
  const [ready, setReady] = useState(false);
  
  // Generar posiciones y colores de partículas
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Patrón más simple para mejor rendimiento
      const theta = Math.random() * Math.PI * 2;
      const r = 5 + Math.random() * 10;
      
      pos[i * 3] = r * Math.cos(theta) * 1.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2 * 5;
      pos[i * 3 + 2] = r * Math.sin(theta) * 1.5;
      
      // Colores más brillantes
      const green = 0.5 + Math.random() * 0.5;
      cols[i * 3] = 0.1 * green;
      cols[i * 3 + 1] = 0.8 * green;
      cols[i * 3 + 2] = 0.3 * green;
    }
    
    return { positions: pos, colors: cols };
  }, [count]);
  
  // Animación optimizada
  useFrame(({ clock }) => {
    if (particles.current) {
      particles.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Notificar cuando las partículas estén listas
  useEffect(() => {
    if (!ready) {
      setReady(true);
      onLoad();
    }
  }, [onLoad, ready]);
  
  return (
    <points ref={particles}>
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
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        alphaTest={0.05}
      />
    </points>
  );
};

// Componente principal del loading screen
const LoadingScreen = ({ onLoaded }: { onLoaded: () => void }) => {
  const { progress, isLoaded, resourceLoaded } = useResourceLoader();
  const [particlesLoaded, setParticlesLoaded] = useState(false);
  
  // Notificar cuando las partículas estén listas
  const handleParticlesLoad = () => {
    if (!particlesLoaded) {
      setParticlesLoaded(true);
      resourceLoaded();
    }
  };
  
  // Notificar cuando todo esté cargado
  useEffect(() => {
    if (isLoaded) {
      setTimeout(onLoaded, 500); // Pequeño delay para la transición
    }
  }, [isLoaded, onLoaded]);
  
  // Precargar recursos
  useEffect(() => {
    // Contar el componente principal como un recurso cargado
    resourceLoaded();
    
    // Cargar imagen del logo
    const img = new Image();
    img.src = 'https://www.petgas.com.mx/wp-content/uploads/2025/06/LOGO-PETGAS-NEW.png';
    img.onload = resourceLoaded;
    
    return () => {
      img.onload = null;
    };
  }, [resourceLoaded]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-green-900 to-green-950 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fondo con partículas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
          <FloatingParticles count={400} onLoad={handleParticlesLoad} />
        </Canvas>
      </div>

      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-900/20" />
      
      {/* Contenido central */}
      <div className="relative z-10 text-center p-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-green-500/20 shadow-2xl">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="https://www.petgas.com.mx/wp-content/uploads/2025/06/LOGO-PETGAS-NEW.png" 
            alt="PETGAS" 
            className="h-24 mx-auto mb-6 drop-shadow-lg"
          />
        </div>
        
        {/* Spinner */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Anillo exterior - gira lentamente en sentido horario */}
          <div className="absolute inset-0 border-4 border-transparent border-t-green-400 border-r-green-500 rounded-full animate-spin-slow" 
               style={{ boxShadow: '0 0 15px rgba(0, 255, 100, 0.3)' }}></div>
          
          {/* Anillo intermedio - gira en sentido antihorario */}
          <div className="absolute inset-3 border-4 border-transparent border-b-green-400 border-l-green-500 rounded-full animate-spin-slow animate-reverse" 
               style={{ boxShadow: '0 0 10px rgba(0, 200, 100, 0.3)' }}></div>
          
          {/* Anillo interior - gira más rápido en sentido horario */}
          <div className="absolute inset-6 border-4 border-transparent border-t-green-300 border-r-green-400 rounded-full animate-spin-slow animate-faster" 
               style={{ boxShadow: '0 0 8px rgba(0, 255, 150, 0.3)' }}></div>
          
          {/* Centro con gradiente y brillo */}
          <div className="absolute inset-8 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center"
               style={{ boxShadow: '0 0 20px rgba(0, 255, 100, 0.4)' }}>
            <div className="absolute inset-0.5 bg-green-600 rounded-full blur-sm opacity-70"></div>
            <span className="text-white font-bold text-sm">{progress}%</span>
          </div>
        </div>
        
        {/* Texto de carga */}
        <p className="text-green-100 text-sm font-medium tracking-wider">
          Cargando recursos...
        </p>
      </div>
      
      {/* Los estilos de animación están en main.css */}
    </div>
  );
};

export default LoadingScreen;
