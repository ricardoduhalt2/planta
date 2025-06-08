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
    count: 150, // Reducido para mejor rendimiento con partículas más grandes
    size: {
      min: 40,  // Partículas mucho más grandes
      max: 180, // Tamaño máximo aumentado
      logoAreaMultiplier: 1.8,
      sizeVariation: 0.9 // Mayor variación de tamaño
    },
    colors: [
      // Colores etéreos con tonos pastel más suaves
      new THREE.Color(0x88FF88).multiplyScalar(4.0),  // Verde agua brillante
      new THREE.Color(0xAAFFAA).multiplyScalar(4.2),  // Verde menta
      new THREE.Color(0xFFFF88).multiplyScalar(4.4),  // Amarillo pastel
      new THREE.Color(0x88FFFF).multiplyScalar(4.6),  // Cian brillante
      new THREE.Color(0xAAAAFF).multiplyScalar(4.8)   // Azul claro
    ],
    speed: 0.5, // Movimiento más dinámico
    waveAmplitude: {
      min: 0.5,
      max: 1.5, // Amplitud aumentada para movimiento más pronunciado
      speed: 0.3 // Velocidad de variación de amplitud aumentada
    },
    waveFrequency: {
      min: 0.008,
      max: 0.02, // Frecuencia aumentada para movimiento más dinámico
      speed: 0.15 // Velocidad de variación de frecuencia aumentada
    },
    spread: 3.5, // Dispersión aún mayor para cubrir más área
    logoAreaDensity: 0.7, // 70% de probabilidad en área del logo
    logoAreaWidth: 0.5, // Área del logo más ancha
    opacity: {
      min: 0.6,
      max: 1.0
    },
    movement: {
      baseSpeed: 0.15,
      speedVariation: 0.1,
      directionChange: 0.005
    }
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
      
      // Crear partículas con distribución mejorada y propiedades dinámicas
      for (let i = 0; i < particleConfig.count; i++) {
        // Posición aleatoria con mayor densidad en el área del logo
        const isInLogoArea = Math.random() < particleConfig.logoAreaDensity;
        let x, y, z;
        
        if (isInLogoArea) {
          // Más partículas en el área del logo
          x = logoAreaLeft + (Math.random() * containerWidth * particleConfig.logoAreaWidth);
          y = (Math.random() - 0.5) * containerHeight * 0.6; // Menor altura para el área del logo
        } else {
          // Distribución expandida en el navbar
          x = (Math.random() - 0.5) * containerWidth * particleConfig.spread * 1.5;
          y = (Math.random() - 0.5) * containerHeight * 1.2; // Más altura
        }
        
        // Profundidad 3D con más variación
        z = (Math.random() - 0.5) * 50;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Colores con variación de brillo
        const color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
        const brightness = 0.8 + Math.random() * 0.7; // Variación de brillo
        colors[i * 3] = color.r * brightness;
        colors[i * 3 + 1] = color.g * brightness;
        colors[i * 3 + 2] = color.b * brightness;

        // Tamaño dinámico con más variación
        const sizeRandom = Math.pow(Math.random(), 1.5); // Sesgado hacia tamaños más pequeños
        const baseSize = particleConfig.size.min + 
                        sizeRandom * (particleConfig.size.max - particleConfig.size.min);
        const sizeMultiplier = isInLogoArea ? 
          (1.2 + Math.random() * particleConfig.size.sizeVariation) * particleConfig.size.logoAreaMultiplier : 
          (0.8 + Math.random() * particleConfig.size.sizeVariation);
        
        sizes[i] = baseSize * sizeMultiplier;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Material de partículas mejorado para efecto etéreo
      const material = new THREE.PointsMaterial({
        size: 6.0, // Tamaño aumentado para partículas más grandes
        vertexColors: true,
        transparent: true,
        opacity: 0.9, // Ligeramente más transparente
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true, // Activar atenuación para efecto más dinámico
        depthWrite: false,
        alphaTest: 0.001, // Mejor visibilidad para partículas transparentes
        fog: true, // Añadir efecto de niebla para integración con la escena
        // Usar un mapa de textura circular para las partículas
        map: (() => {
          const canvas = document.createElement('canvas');
          const size = 64;
          canvas.width = size;
          canvas.height = size;
          const context = canvas.getContext('2d');
          if (context) {
            const gradient = context.createRadialGradient(
              size / 2, size / 2, 0,
              size / 2, size / 2, size / 2
            );
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, size, size);
          }
          const texture = new THREE.CanvasTexture(canvas);
          return texture;
        })(),
      });

      const particles = new THREE.Points(geometry, material);
      sceneRef.current.add(particles);
      particlesRef.current = particles;
    } catch (error) {
      console.error('Error creating particles:', error);
    }
  }, [particleConfig]);

  // Bucle de animación mejorado
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) {
      return;
    }

    if (document.visibilityState === 'visible') {
      try {
        const time = clockRef.current.getElapsedTime();
        const positionAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute & {
          originalPositions?: Float32Array;
          originalSizes?: Float32Array;
          originalColors?: Float32Array;
          offsets?: {x: number, y: number, z: number}[];
          speeds?: {x: number, y: number, z: number}[];
        };
        
        const positions = positionAttr.array as Float32Array;
        const sizeArray = particlesRef.current.geometry.attributes.size.array as Float32Array;
        const colorArray = particlesRef.current.geometry.attributes.color.array as Float32Array;
        
        // Inicializar propiedades de animación si es la primera vez
        if (!positionAttr.originalPositions) {
          positionAttr.originalPositions = new Float32Array(positions);
          positionAttr.offsets = Array(positions.length / 3).fill(0).map(() => ({
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2
          }));
          positionAttr.speeds = Array(positions.length / 3).fill(0).map(() => ({
            x: 0.5 + Math.random() * 0.5,
            y: 0.3 + Math.random() * 0.7,
            z: 0.2 + Math.random() * 0.3
          }));
          positionAttr.originalSizes = new Float32Array(sizeArray);
          // Guardar colores originales para el efecto de parpadeo
          positionAttr.originalColors = new Float32Array(colorArray);
        }
        
        const originalPositions = positionAttr.originalPositions as Float32Array;
        const originalSizes = positionAttr.originalSizes as Float32Array;
        const originalColors = positionAttr.originalColors as Float32Array;
        const offsets = positionAttr.offsets as {x: number, y: number, z: number}[];
        const speeds = positionAttr.speeds as {x: number, y: number, z: number}[];

        // Actualizar posiciones y tamaños
        for (let i = 0; i < positions.length; i += 3) {
          const ix = i / 3;
          const x = originalPositions[i];
          const y = originalPositions[i + 1];
          const z = originalPositions[i + 2];
          
          // Actualizar offsets para movimiento fluido
          offsets[ix].x += 0.01 * speeds[ix].x;
          offsets[ix].y += 0.008 * speeds[ix].y;
          offsets[ix].z += 0.005 * speeds[ix].z;
          
          // Onda principal con múltiples frecuencias
          const waveTime = time * particleConfig.speed;
          const waveFreqX = particleConfig.waveFrequency.min + 
                          Math.sin(time * 0.1) * (particleConfig.waveFrequency.max - particleConfig.waveFrequency.min) * 0.5;
          const waveAmp = particleConfig.waveAmplitude.min + 
                         Math.sin(time * particleConfig.waveAmplitude.speed) * 
                         (particleConfig.waveAmplitude.max - particleConfig.waveAmplitude.min) * 0.5;
          
          // Múltiples ondas para movimiento orgánico
          const wave1 = Math.sin(x * waveFreqX + waveTime) * waveAmp;
          const wave2 = Math.cos((x + y) * waveFreqX * 0.7 + waveTime * 0.7) * (waveAmp * 0.8);
          const wave3 = Math.sin((y - x) * waveFreqX * 0.5 + waveTime * 0.5) * (waveAmp * 0.6);
          
          // Movimiento base
          positions[i] = x + Math.sin(waveTime * 0.2 + y * 0.01 + offsets[ix].x) * 2.0;
          positions[i + 1] = y + (wave1 + wave2 + wave3) * 0.5;
          positions[i + 2] = z + Math.sin(waveTime * 0.15 + x * 0.01 + offsets[ix].z) * 0.5;
          
          // Variación de tamaño con movimiento
          const sizePulse = 0.8 + 0.4 * Math.sin(waveTime * 0.5 + x * 0.01 + offsets[ix].y);
          sizeArray[ix] = originalSizes[ix] * sizePulse;
          
          // Efecto de parpadeo más dinámico y etéreo
          const timeFactor = time * 0.7 + ix * 0.15;
          
          // Múltiples frecuencias de parpadeo para un efecto más orgánico
          const flicker1 = 0.6 + 0.4 * Math.sin(timeFactor * 6 + ix * 0.2);
          const flicker2 = 0.6 + 0.4 * Math.sin(timeFactor * 3.7 + ix * 0.3);
          const flicker3 = 0.6 + 0.4 * Math.sin(timeFactor * 2.3 + ix * 0.4);
          
          // Combinar los efectos de parpadeo
          const flicker = (flicker1 + flicker2 + flicker3) / 3;
          
          // Pulso suave con múltiples frecuencias
          const pulse1 = 0.7 + 0.3 * Math.sin(timeFactor * 0.25 + x * 0.005);
          const pulse2 = 0.7 + 0.3 * Math.sin(timeFactor * 0.4 + y * 0.008);
          const pulse = (pulse1 + pulse2) / 2;
          
          // Brillo dinámico con variación aleatoria suave
          const dynamicBrightness = flicker * pulse * (0.9 + 0.2 * Math.sin(time * 0.5 + ix * 0.1));
          
          // Aplicar brillo a los colores con variación cromática
          const hueShift = Math.sin(time * 0.1 + ix * 0.01) * 0.1;
          const r = originalColors[i * 3] * (1 + hueShift);
          const g = originalColors[i * 3 + 1];
          const b = originalColors[i * 3 + 2] * (1 - hueShift);
          
          colorArray[i * 3] = Math.min(r * dynamicBrightness, 2.0);
          colorArray[i * 3 + 1] = Math.min(g * dynamicBrightness * 1.1, 2.0);
          colorArray[i * 3 + 2] = Math.min(b * dynamicBrightness * 1.2, 2.0);
          
          // Variación de tamaño más dinámica
          const sizePulseValue = 0.5 + 0.5 * Math.sin(timeFactor * 0.5 + ix * 0.2);
          sizeArray[ix] = originalSizes[ix] * (0.5 + 1.0 * dynamicBrightness * sizePulseValue);
          
          // Añadir un poco de movimiento vertical adicional para efecto más etéreo
          positions[i + 1] = originalPositions[i + 1] + Math.sin(time * 0.3 + ix * 0.1) * 10;
        }

        // Actualizar atributos
        positionAttr.needsUpdate = true;
        particlesRef.current.geometry.attributes.size.needsUpdate = true;
        particlesRef.current.geometry.attributes.color.needsUpdate = true;

        // Rotación sutil del sistema de partículas
        particlesRef.current.rotation.z = Math.sin(time * 0.03) * 0.02;
        particlesRef.current.rotation.x = Math.sin(time * 0.02) * 0.01;
        particlesRef.current.rotation.y = Math.sin(time * 0.025) * 0.015;

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
