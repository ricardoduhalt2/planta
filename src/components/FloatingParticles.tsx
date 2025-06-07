import { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticlePositions {
  positions: Float32Array;
  colors: Float32Array;
}

export const FloatingParticles = ({ count = 150, onLoad }: { count?: number; onLoad?: () => void }) => {
  const particles = useRef<THREE.Points>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Notificar cuando el componente esté montado
  useEffect(() => {
    onLoad?.();
    
    // Limpieza al desmontar
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [onLoad]);

  // Generar posiciones y colores de partículas
  const { positions, colors } = useMemo<ParticlePositions>(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    const hueBase = 0.3; // Verde-azul
    const saturation = 0.8;
    const lightness = 0.7;
    
    // Crear partículas en un patrón esférico optimizado
    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      
      pos[i * 3] = radius * sinPhi * cosTheta;
      pos[i * 3 + 1] = radius * sinPhi * sinTheta;
      pos[i * 3 + 2] = radius * cosPhi;
      
      // Colores neón optimizados
      const hue = hueBase + (Math.random() * 0.1 - 0.05); // Pequeña variación
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors: cols };
  }, [count]);

  // Material optimizado
  const material = useMemo(() => new THREE.PointsMaterial({
    size: 0.12,
    sizeAttenuation: true,
    color: 0x00ff88,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    vertexColors: true
  }), []);

  // Geometría optimizada
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, [count, positions, colors]);

  // Inicializar posiciones originales
  useEffect(() => {
    if (particles.current) {
      const posAttr = particles.current.geometry.attributes.position as THREE.BufferAttribute;
      originalPositions.current = new Float32Array(posAttr.array as ArrayBuffer);
    }
  }, [geometry]);

  // Animación optimizada
  const animateParticles = useCallback((elapsedTime: number) => {
    if (!particles.current || !originalPositions.current) return;

    const positions = (particles.current.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    const origPositions = originalPositions.current;
    
    // Actualizar posiciones
    for (let i = 0; i < positions.length; i += 3) {
      const i3 = i / 3;
      const time = elapsedTime * (0.2 + (i3 % 10) * 0.01) + i3 * 0.1;
      
      positions[i] = origPositions[i] + Math.sin(time) * 0.3;
      positions[i + 1] = origPositions[i + 1] + Math.cos(time * 0.8) * 0.3;
      positions[i + 2] = origPositions[i + 2] + Math.sin(time * 0.6) * 0.2;
    }
    
    // Marcar para actualización
    (particles.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }, []);

  // Bucle de animación
  useFrame(({ clock }) => {
    animationFrameId.current = requestAnimationFrame(() => {
      animateParticles(clock.getElapsedTime());
    });
  });

  return <points ref={particles} geometry={geometry} material={material} />;
};

export default FloatingParticles;
