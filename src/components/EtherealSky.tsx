import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const EtherealSky = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  
  // Configuración del shader
  const shader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
          // Coordenadas centradas
          vec2 uv = vUv * 2.0 - 1.0;
          float dist = length(uv);
          
          // Colores base
          vec3 color1 = vec3(0.0, 0.5, 0.3);  // Verde
          vec3 color2 = vec3(0.0, 0.2, 0.5);  // Azul
          
          // Gradiente radial
          vec3 color = mix(color1, color2, smoothstep(0.0, 1.5, dist));
          
          // Añadir algo de variación con el tiempo
          color.r += sin(time * 0.5) * 0.1;
          color.g += cos(time * 0.3) * 0.1;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
    []
  );

  // Actualizar el tiempo uniforme
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -10]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={shaderRef}
        {...shader}
        depthWrite={false}
        depthTest={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

// Exportación por defecto para compatibilidad
export default EtherealSky;
