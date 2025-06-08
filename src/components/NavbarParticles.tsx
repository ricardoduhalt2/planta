import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// Extender las interfaces para incluir originalPositions
declare module 'three' {
  interface BufferAttribute {
    originalPositions?: Float32Array;
  }
  
  interface InterleavedBufferAttribute {
    originalPositions?: Float32Array;
  }
}

const NavbarParticles = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const animationFrameId = useRef<number | null>(null);

  // Configuración de partículas
  const particleConfig = {
    count: 180,
    size: { 
      min: 12, // Aumentado a 12 (6x el tamaño original)
      max: 60, // Aumentado a 60 (5x el tamaño original)
      logoAreaMultiplier: 1.8
    }, 
    colors: [
      new THREE.Color(0x4CAF50).multiplyScalar(1.5),
      new THREE.Color(0x8BC34A).multiplyScalar(1.5),
      new THREE.Color(0x00ff88).multiplyScalar(1.5),
      new THREE.Color(0x00ffcc).multiplyScalar(1.5),
      new THREE.Color(0x88ff88).multiplyScalar(1.5)
    ],
    speed: 0.4,
    waveAmplitude: 2.5,
    waveFrequency: 0.008,
    spread: 1.8,
    logoAreaDensity: 0.6,
    logoAreaWidth: 0.3
  };

  // Inicializar Three.js
  const initThree = useCallback((): boolean => {
    if (!mountRef.current) return false;

    try {
      // Escena
      const scene = new THREE.Scene();
      scene.background = null;
      sceneRef.current = scene;

      // Cámara
      const width = mountRef.current.clientWidth || window.innerWidth;
      const height = 60;
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 100);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      
      // Manejador de pérdida de contexto
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        console.log('WebGL context lost');
      };

      const handleContextRestore = () => {
        console.log('WebGL context restored');
        initThree();
      };

      const canvas = renderer.domElement;
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestore, false);

      // Limpiar contenedor
      if (mountRef.current) {
        while (mountRef.current.firstChild) {
          mountRef.current.removeChild(mountRef.current.firstChild);
        }
        mountRef.current.appendChild(renderer.domElement);
      }

      rendererRef.current = renderer;
      return true;
    } catch (error) {
      console.error('Error initializing Three.js:', error);
      return false;
    }
  }, []);

  // Crear partículas
  const createParticles = useCallback(() => {
    if (!sceneRef.current) return;

    try {
      // Limpiar partículas existentes
      if (particlesRef.current && sceneRef.current) {
        sceneRef.current.remove(particlesRef.current);
        particlesRef.current.geometry?.dispose();
        if (Array.isArray(particlesRef.current.material)) {
          particlesRef.current.material.forEach(mat => mat.dispose());
        } else if (particlesRef.current.material) {
          particlesRef.current.material.dispose();
        }
      }

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleConfig.count * 3);
      const colors = new Float32Array(particleConfig.count * 3);
      const sizes = new Float32Array(particleConfig.count);

      // Obtener dimensiones del contenedor
      const containerWidth = mountRef.current?.clientWidth || window.innerWidth;
      const containerHeight = 80; // Altura del navbar
      const logoAreaLeft = -containerWidth * 0.15;
      
      // Crear partículas con distribución mejorada
      for (let i = 0; i < particleConfig.count; i++) {
        let x, y, sizeMultiplier = 1;
        const isInLogoArea = Math.random() < particleConfig.logoAreaDensity;
        
        if (isInLogoArea) {
          // Más partículas en el área del logo
          x = logoAreaLeft + (Math.random() * containerWidth * particleConfig.logoAreaWidth);
          sizeMultiplier = 1.2 + Math.random() * 0.8; // Partículas más grandes en el área del logo
        } else {
          // Distribución en el resto del navbar
          x = (Math.random() - 0.5) * containerWidth * 1.2 * particleConfig.spread;
        }
        
        y = (Math.random() - 0.5) * containerHeight * 0.8;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // Profundidad para efecto 3D

        // Colores
        const color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Tamaño
        const baseSize = particleConfig.size.min + 
                        Math.pow(Math.random(), 2) * (particleConfig.size.max - particleConfig.size.min);
        sizes[i] = baseSize * (isInLogoArea ? particleConfig.size.logoAreaMultiplier : 1) * sizeMultiplier;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Material de partículas
      const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
      });

      const particles = new THREE.Points(geometry, material);
      sceneRef.current.add(particles);
      particlesRef.current = particles;
    } catch (error) {
      console.error('Error creating particles:', error);
    }
  }, [particleConfig]);

  // Bucle de animación
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) {
      return;
    }

    if (document.visibilityState === 'visible') {
      try {
        const time = clockRef.current.getElapsedTime();
        const positionAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute & {
          originalPositions?: Float32Array;
        };
        const positions = positionAttr.array as Float32Array;
        
        // Inicializar originalPositions si no existe (solo una vez)
        if (!positionAttr.originalPositions) {
          positionAttr.originalPositions = new Float32Array(positions);
        }
        const originalPositions = positionAttr.originalPositions as Float32Array;

        // Actualizar posiciones con efecto de ondas
        const waveTime = time * particleConfig.speed;
        const sizeArray = particlesRef.current.geometry.attributes.size.array as Float32Array;
        
        // Precalcular valores comunes
        const wave1Freq = particleConfig.waveFrequency;
        const wave2Freq = particleConfig.waveFrequency * 0.7;
        const wave3Freq = particleConfig.waveFrequency * 0.5;
        const waveAmp = particleConfig.waveAmplitude;
        
        // Usar un bucle optimizado
        for (let i = 0; i < positions.length; i += 3) {
          const ix = i / 3;
          const x = originalPositions[i];
          const y = originalPositions[i + 1];
          
          // Efecto de ondas
          const wave1 = Math.sin(x * wave1Freq + waveTime) * waveAmp;
          const wave2 = Math.cos((x + y) * wave2Freq + waveTime * 0.7) * (waveAmp * 0.8);
          const wave3 = Math.sin((y - x) * wave3Freq + waveTime * 0.5) * (waveAmp * 0.6);
          
          // Aplicar movimiento
          positions[i + 1] = y + (wave1 + wave2 + wave3) * 0.5;
          positions[i] = x + Math.sin(waveTime * 0.3 + y * 0.01) * 1.5;
          
          // Actualizar tamaños
          sizeArray[ix] = particleConfig.size.min + 
                         (particleConfig.size.max - particleConfig.size.min) * 
                         (0.7 + 0.3 * Math.sin(waveTime * 0.5 + x * 0.01));
        }
        
        // Actualizar atributos
        positionAttr.needsUpdate = true;
        particlesRef.current.geometry.attributes.size.needsUpdate = true;

        // Rotación sutil
        particlesRef.current.rotation.z = Math.sin(time * 0.05) * 0.03;
        particlesRef.current.rotation.x = Math.sin(time * 0.03) * 0.02;
        particlesRef.current.rotation.y = Math.sin(time * 0.04) * 0.01;

        // Renderizar
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      } catch (error) {
        console.error('Error en la animación de partículas:', error);
      }
    }
  }, [particleConfig]);

  // Efecto principal
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (mounted && initThree()) {
        await createParticles();
        clockRef.current.start();
        
        const animateLoop = () => {
          if (!mounted) return;
          animate();
          animationFrameId.current = requestAnimationFrame(animateLoop);
        };
        
        animationFrameId.current = requestAnimationFrame(animateLoop);
      }
    };

    // Inicializar
    init();

    // Manejador de redimensionamiento
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = 60;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
        createParticles();
      }
    };

    // Usar debounce para el evento de redimensionamiento
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', debouncedResize);

    // Limpieza
    return () => {
      mounted = false;
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      // Limpiar recursos de Three.js
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) { 
          const child = sceneRef.current.children[0];
          if (child instanceof THREE.Points) {
            const points = child as THREE.Points;
            if (points.geometry) points.geometry.dispose();
            if (points.material) {
              if (Array.isArray(points.material)) {
                points.material.forEach(m => m.dispose());
              } else {
                points.material.dispose();
              }
            }
          }
          sceneRef.current.remove(child);
        }
      }
    };
  }, [initThree, createParticles, animate]);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
        mixBlendMode: 'screen',
        willChange: 'transform, opacity'
      }} 
    />
  );
};

export default NavbarParticles;
