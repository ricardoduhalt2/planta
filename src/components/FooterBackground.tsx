import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Componente de partículas optimizado para el footer con zoom out y brillo intermitente
const FooterParticles = ({ count = 200 }) => {
  const particles = useRef<THREE.Points>(null);
  const [timeOffset] = useState(() => Math.random() * 1000);
  
  // Generar posiciones y colores de partículas
  const { positions, colors, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 4); // Ahora usamos RGBA para controlar la opacidad
    const ops = new Float32Array(count); // Para controlar la opacidad individual
    const radius = 10; // Radio más pequeño para mejor visibilidad
    
    for (let i = 0; i < count; i++) {
      // Patrón más plano y ancho para mejor visibilidad
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1) * 0.5; // Más plano
      const r = radius * (0.9 + Math.random() * 0.2); // Menos variación en el radio
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 4; // Más ancho
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8; // Más plano
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2; // Menos profundidad
      
      // Colores más intensos y brillantes
      const green = 0.6 + Math.random() * 0.4; // Verde más intenso
      // Variable de brillo para futuros ajustes
      const isBright = Math.random() > 0.9; // 10% de probabilidad de ser brillante
      const isSuperBright = isBright && Math.random() > 0.7; // 30% de las brillantes serán súper brillantes
      
      // Colores base más intensos
      if (isSuperBright) {
        // Partículas súper brillantes (como el logo)
        cols[i * 4] = 0.9;     // R
        cols[i * 4 + 1] = 1.0;  // G - máximo brillo
        cols[i * 4 + 2] = 0.6;  // B
        cols[i * 4 + 3] = 1.0;  // Alpha inicial
      } else if (isBright) {
        // Partículas brillantes normales
        cols[i * 4] = 0.7 * green + 0.3;     // R
        cols[i * 4 + 1] = 0.9 * green + 0.1;  // G
        cols[i * 4 + 2] = 0.5 * green;        // B
        cols[i * 4 + 3] = 1.0;                // Alpha inicial
      } else {
        // Partículas normales más intensas
        cols[i * 4] = 0.2 * green;
        cols[i * 4 + 1] = 0.8 * green;
        cols[i * 4 + 2] = 0.4 * green;
        cols[i * 4 + 3] = 0.9; // Menos transparentes
      }
      
      // Guardar tipo de partícula (0: normal, 1: brillante, 2: súper brillante)
      ops[i] = isSuperBright ? 2 : isBright ? 1 : 0;
    }
    
    return { positions: pos, colors: cols, opacities: ops };
  }, [count]);
  
  // Animación de las partículas con brillo intermitente
  useFrame((state) => {
    if (!particles.current) return;
    
    const time = state.clock.getElapsedTime() + timeOffset;
    
    // Rotación más lenta para el zoom out
    particles.current.rotation.x = time * 0.03;
    particles.current.rotation.y = time * 0.02;
    
    const positions = particles.current.geometry.attributes.position.array as Float32Array;
    const colors = particles.current.geometry.attributes.color.array as Float32Array;
    const originalPositions = particles.current.userData.originalPositions as Float32Array;
    const opacities = particles.current.userData.opacities as Float32Array;
    
    // Mover partículas y actualizar brillo
    for (let i = 0; i < positions.length / 3; i++) {
      const idx = i * 3;
      const colorIdx = i * 4;
      
      // Movimiento suave
      const wave1 = Math.sin(time * 0.1 + i * 0.01) * 0.3;
      const wave2 = Math.cos(time * 0.08 + i * 0.015) * 0.4;
      
      positions[idx] = originalPositions[idx] + wave1 * 1.5;
      positions[idx + 1] = originalPositions[idx + 1] + wave2 * 1.2;
      positions[idx + 2] = originalPositions[idx + 2] + (wave1 + wave2) * 0.3;
      
      // Efecto de brillo intermitente mejorado
      if (opacities[i] > 0) {
        if (opacities[i] === 2) {
          // Efecto más intenso para partículas súper brillantes
          const pulse = 0.6 + 0.4 * Math.sin(time * 3 + i);
          const glow = 0.8 + 0.2 * Math.sin(time * 4 + i * 0.5);
          colors[colorIdx + 3] = pulse;
          // Aumentar el brillo del color
          colors[colorIdx] = 0.8 + 0.2 * Math.sin(time * 2 + i * 0.3);
          colors[colorIdx + 1] = 1.0; // Verde al máximo
          colors[colorIdx + 2] = 0.6 + 0.4 * glow;
        } else {
          // Efecto normal para partículas brillantes
          const pulse = 0.6 + 0.4 * Math.sin(time * 2 + i * 0.7);
          colors[colorIdx + 3] = pulse;
        }
      }
    }
    
    particles.current.geometry.attributes.position.needsUpdate = true;
    particles.current.geometry.attributes.color.needsUpdate = true;
  });
  
  // Inicializar datos de partículas
  useEffect(() => {
    if (particles.current) {
      // Guardar posiciones originales
      const positions = (particles.current.geometry.attributes.position.array as Float32Array).slice();
      particles.current.userData.originalPositions = positions;
      
      // Guardar opacidades iniciales
      particles.current.userData.opacities = [...opacities];
    }
  }, [opacities]);
  
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
          args={[colors, 4]}
          count={colors.length / 4}
          array={colors}
          itemSize={4}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5} // Tamaño aumentado
        vertexColors
        transparent
        opacity={1.0}
        sizeAttenuation={true}
        alphaTest={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Componente principal del fondo del footer
const FooterBackground: React.FC = () => {
  return (
    <div 
      className="fixed bottom-0 left-0 w-full pointer-events-none"
      style={{
        zIndex: 1, // Aseguramos que esté por encima de otros elementos
        height: '30vh',
        minHeight: '200px',
        maxHeight: '300px',
        backgroundColor: 'rgba(0, 20, 10, 0.7)', // Fondo base para mejor contraste
        backgroundImage: 'linear-gradient(to top, rgba(0, 40, 20, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 25], fov: 50, near: 0.1, far: 1000 }} // Mejor configuración de cámara
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          gl={{ alpha: true, antialias: true }} // Mejorar renderizado
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ff88" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00aaff" />
          <FooterParticles count={250} />
        </Canvas>
      </div>
    </div>
  );
};

export default FooterBackground;
