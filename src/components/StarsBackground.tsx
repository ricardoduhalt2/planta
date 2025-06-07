import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface StarsBackgroundProps {
  count?: number;
  opacity?: number;
  size?: number;
}

// Detectar capacidades del navegador
const useBrowserCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    webgl: true,
    webgl2: true,
    webp: true,
    avif: true,
    worker: true,
  });

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const webgl = !!canvas.getContext('webgl');
    const webgl2 = !!canvas.getContext('webgl2');
    
    // Verificar soporte para WebP
    const canvasWebP = document.createElement('canvas');
    const supportsWebP = canvasWebP.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    setCapabilities({
      webgl,
      webgl2,
      webp: supportsWebP,
      avif: false, // Deshabilitado por compatibilidad
      worker: 'Worker' in window,
    });
  }, []);

  return capabilities;
};

export const StarsBackground = ({ 
  count = 1000, 
  opacity = 0.8,
  size = 0.15 
}: StarsBackgroundProps) => {
  const particles = useRef<THREE.Points>(null);
  const capabilities = useBrowserCapabilities();
  
  // Ajustar parámetros según las capacidades del navegador
  const adjustedCount = capabilities.webgl2 ? count : Math.min(count, 500);
  
  // Generar posiciones y colores de partículas
  const { positions, colors } = useMemo(() => {
    const actualCount = capabilities.webgl2 ? adjustedCount : Math.min(adjustedCount, 300);
    const pos = new Float32Array(actualCount * 3);
    const cols = new Float32Array(actualCount * 3);
    
    for (let i = 0; i < actualCount; i++) {
      // Posiciones en una esfera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 50; // Aumentamos el radio para cubrir más espacio
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colores en tonos azules y blancos para estrellas
      const intensity = 0.5 + Math.random() * 0.5;
      cols[i * 3] = 0.5 * intensity;     // R: azul oscuro
      cols[i * 3 + 1] = 0.7 * intensity; // G: azul claro
      cols[i * 3 + 2] = 1.0 * intensity; // B: blanco azulado
    }
    
    return { positions: pos, colors: cols };
  }, [count]);
  
  // Ajustar rendimiento en dispositivos móviles
  useEffect(() => {
    const isMobileDevice = 
      window.matchMedia('(max-width: 768px)').matches || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
    if (isMobileDevice) {
      // Reducir el número de partículas en móviles
      count = Math.min(count, 300);
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (particles.current) {
      const time = clock.getElapsedTime();
      // Usar requestAnimationFrame para mejor rendimiento
      requestAnimationFrame(() => {
        if (particles.current) {
          particles.current.rotation.y = time * 0.02;
          particles.current.rotation.x = time * 0.01;
        }
      });
    }
  });
  
  // Si WebGL no está disponible, mostrar un fondo estático
  if (!capabilities.webgl) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, #0a2e0a 0%, #0d1f0d 50%, #091309 100%)',
        zIndex: -1
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2342ff00\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          opacity: 0.5
        }} />
      </div>
    );
  }
  
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
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        alphaTest={0.01}
      />
    </points>
  );
};

export default StarsBackground;
