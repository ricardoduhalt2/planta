import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ParticleVelocity {
  x: number;
  y: number;
}

const HeaderParticles = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuración
    const config = {
      count: 120,  // Número de partículas
      colors: [0x4CAF50, 0x8BC34A, 0xCDDC39, 0xFFEB3B, 0xFFC107],
      size: { min: 3, max: 8 },  // Tamaño más visible
      speed: 0.1,
      waveAmplitude: 2.5,
      waveFrequency: 0.008,
      particleArea: 1.3,
      opacity: 1.0,
      waveSpeed: 1.0
    };

    // Dimensiones del navbar
    const width = window.innerWidth;
    const height = 80; // Altura del navbar
    
    // Configurar escena
    const scene = new THREE.Scene();
    scene.background = null;
    
    // Configurar cámara
    const viewWidth = width;
    const viewHeight = height * 2;  // Altura suficiente para el efecto de onda
    const camera = new THREE.OrthographicCamera(
      -viewWidth / 2, viewWidth / 2,
      viewHeight / 2, -viewHeight / 2,
      0.1, 1000
    );
    camera.position.z = 50;
    
    // Configurar renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Crear partículas
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);
    const velocities: ParticleVelocity[] = [];
    
    for (let i = 0; i < config.count; i++) {
      // Posición horizontal uniforme
      positions[i * 3] = (Math.random() - 0.5) * viewWidth * 0.9;
      // Posición vertical centrada
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewHeight * 0.4;
      // Profundidad
      positions[i * 3 + 2] = 0;
      
      // Tamaño aleatorio (ligeramente más grandes las amarillas)
      const isYellow = i % 5 === 0;
      const baseSize = isYellow ? config.size.max * 1.2 : config.size.max;
      sizes[i] = baseSize * (0.6 + Math.random() * 0.8); // Más variación en tamaños
      
      // Velocidad inicial
      velocities.push({
        x: (Math.random() - 0.5) * config.speed,
        y: (Math.random() - 0.5) * config.speed
      });
    }
    
    // Asignar atributos
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Material de partículas con shader personalizado
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(width, height) }
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vSize = size;
          
          // Efecto de onda visible
          float waveX = sin(position.x * 0.01 + time * 0.8) * 2.0;
          float waveY = cos(position.x * 0.02 + time * 0.5) * 3.0;
          
          vec3 newPosition = position + vec3(0.0, waveX + waveY, 0.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = size * (150.0 / -mvPosition.z); // Reducir tamaño general
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float dist = length(uv);
          
          if (dist > 0.5) discard;
          
          // Gradiente radial
          float alpha = smoothstep(0.5, 0.2, dist);
          
          // Colores PETGAS
          vec3 color1 = vec3(0.2, 0.8, 0.2); // Verde PETGAS
          vec3 color2 = vec3(0.9, 0.9, 0.2); // Amarillo PETGAS
          
          // Mezclar colores
          vec3 finalColor = mix(color1, color2, smoothstep(0.0, 1.0, dist * 2.0));
          
          gl_FragColor = vec4(finalColor, alpha * 0.9);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
    
    // Crear sistema de partículas
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Animación
    const clock = new THREE.Clock();
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Actualizar uniformes
      material.uniforms.time.value = elapsedTime * 0.5;
      
      // Renderizar
      renderer.render(scene, camera);
    };
    
    // Manejar redimensionamiento
    const handleResize = () => {
      const newWidth = window.innerWidth;
      camera.left = -newWidth * 0.75;
      camera.right = newWidth * 0.75;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Iniciar animación
    animate();
    
    // Limpieza
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default HeaderParticles;
