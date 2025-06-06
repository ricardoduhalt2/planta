import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Función para crear material wireframe
const createWireframeMaterial = (color: number, opacity: number) => {
  return new THREE.MeshBasicMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: opacity,
  });
};

// Componente para el fondo etéreo
const GradientBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[100, 64, 64]} />
      <shaderMaterial
        ref={shaderRef}
        side={THREE.BackSide}
        uniforms={{
          time: { value: 0 },
          color1: { value: new THREE.Color(0x003300) }, // Verde muy oscuro
          color2: { value: new THREE.Color(0x006633) }, // Verde bosque
          color3: { value: new THREE.Color(0x00aa77) }, // Verde agua
          fogColor: { value: new THREE.Color(0x001a0a) },
          fogDensity: { value: 0.15 }
        }}
        vertexShader={`
          varying vec3 vWorldPosition;
          varying vec2 vUv;
          
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform vec3 fogColor;
          uniform float fogDensity;
          uniform float time;
          
          varying vec3 vWorldPosition;
          varying vec2 vUv;
          
          // Función de ruido simplex
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          float snoise(vec3 v) { 
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            
            i = mod289(i);
            vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
          }
          
          void main() {
            // Coordenadas normalizadas
            vec3 pos = normalize(vWorldPosition);
            
            // Generar patrones de ruido
            float n1 = snoise(pos * 2.0 + time * 0.1);
            float n2 = snoise(pos * 4.0 + time * 0.2);
            float n3 = snoise(pos * 8.0 + time * 0.1);
            
            // Mezclar colores basados en la posición y el ruido
            float h = smoothstep(-0.5, 0.5, pos.y + n1 * 0.3);
            vec3 color = mix(color1, color2, h);
            color = mix(color, color3, smoothstep(0.3, 1.0, h + n2 * 0.2));
            
            // Añadir variación con el tiempo
            color = mix(color, color * 1.1, 0.5 + 0.5 * sin(time * 0.5 + pos.y * 10.0) * n3);
            
            // Añadir neblina basada en la distancia
            float fogFactor = 1.0 - exp(-fogDensity * length(vWorldPosition));
            color = mix(color, fogColor, fogFactor);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

// Componente de partículas flotantes
const FloatingParticles: React.FC<{ count: number }> = ({ count }) => {
  const particles = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
    }
    return new Float32Array(positions);
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00aaff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Componente para cargar modelos OBJ
const OBJModel: React.FC<{ modelPath: string; material: THREE.Material }> = ({ modelPath, material }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  
  useEffect(() => {
    const loader = new OBJLoader();
    let isMounted = true;
    
    loader.load(
      modelPath,
      (object) => {
        if (!isMounted) return;
        
        // Clonar el objeto para evitar problemas de referencia
        const model = object.clone();
        
        // Aplicar el material a todos los hijos del modelo
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
          }
        });
        
        // Ajustar la escala (450% más grande) y posición
        model.scale.set(3.0, 3.0, 3.0);
        model.position.set(0, 0, 0);
        
        setModel(model);
      },
      undefined,
      (error) => {
        console.error('Error loading OBJ model:', error);
      }
    );
    
    return () => {
      isMounted = false;
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [modelPath, material]);
  
  // Actualizar el grupo cuando el modelo cambie
  useEffect(() => {
    if (model && groupRef.current) {
      // Limpiar el grupo actual
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      
      // Agregar el nuevo modelo
      groupRef.current.add(model);
    }
  }, [model]);
  
  return <primitive object={groupRef.current} />;
};

// Componente para cargar modelos GLTF/GLB
const GLTFModel: React.FC<{ modelPath: string; material: THREE.Material }> = ({ modelPath, material }) => {
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  
  useEffect(() => {
    const loader = new GLTFLoader();
    let isMounted = true;
    
    loader.load(
      modelPath,
      (gltf) => {
        if (!isMounted || !groupRef.current) return;
        
        // Limpiar el grupo actual
        while (groupRef.current.children.length > 0) {
          const child = groupRef.current.children[0];
          groupRef.current.remove(child);
          
          // Limpiar recursos del hijo
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose?.());
            } else {
              mesh.material?.dispose?.();
            }
            mesh.geometry?.dispose();
          }
        }
        
        // Clonar la escena para evitar problemas de referencia
        const model = gltf.scene.clone();
        
        // Aplicar material a todo el modelo
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = material;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        
        // Ajustar la escala y posición
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        
        // Agregar el modelo al grupo
        groupRef.current.add(model);
      },
      undefined,
      (error) => {
        console.error('Error al cargar el modelo GLTF:', error);
      }
    );
    
    return () => {
      isMounted = false;
      
      // Limpiar recursos al desmontar
      if (groupRef.current) {
        while (groupRef.current.children.length > 0) {
          const child = groupRef.current.children[0];
          groupRef.current.remove(child);
          
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose?.());
            } else {
              mesh.material?.dispose?.();
            }
            mesh.geometry?.dispose();
          }
        }
      }
    };
  }, [modelPath, material]);
  
  return <primitive object={groupRef.current} />;
};

// Componente principal para el modelo 3D con rotación suave
const Model: React.FC = () => {
  const [showWireframe, setShowWireframe] = useState(false);
  const modelRef = useRef<THREE.Group>(null);
  
  // Material para el modelo industrial
  const standardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x003366,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.95,
  }), []);
  
  // Material para el wireframe
  const wireframeMaterial = useMemo(() => 
    createWireframeMaterial(0x00aaff, 0.8)
  , []);
  
  // Alternar entre modelos cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setShowWireframe(prev => !prev);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Animación de rotación suave
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5; // Rotación suave
    }
  });
  
  return (
    <group ref={modelRef}>
      <group scale={[4, 4, 4]} position={[0, 0, 0]}>
        <Suspense fallback={null}>
          {showWireframe ? (
            <GLTFModel
              modelPath="/images/planta4k.glb"
              material={wireframeMaterial}
            />
          ) : (
            <OBJModel
              modelPath="/images/Industrial_Blueprint_0605180610_generate.obj"
              material={standardMaterial}
            />
          )}
        </Suspense>
      </group>
    </group>
  );
};

// Componente de animación que se ejecuta dentro del Canvas
const AnimationController = ({ onUpdate }: { onUpdate: (progress: number) => void }) => {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const animationRef = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const animationSpeed = 0.3; // Velocidad de la animación (más bajo = más lento)
  
  // Efecto para manejar la animación
  useEffect(() => {
    let isMounted = true;
    
    const animate = (time: number) => {
      if (!isMounted) return;
      
      if (!lastTime.current) lastTime.current = time;
      const delta = (time - lastTime.current) / 1000; // Delta en segundos
      lastTime.current = time;
      
      setProgress(prevProgress => {
        let newProgress = prevProgress + (delta * animationSpeed * direction);
        
        // Invertir la dirección al llegar a los límites
        if (newProgress >= 1) {
          newProgress = 1;
          setDirection(-1);
        } else if (newProgress <= 0) {
          newProgress = 0;
          setDirection(1);
        }
        
        return newProgress;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      isMounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction]);
  
  // Notificar los cambios de progreso
  useEffect(() => {
    onUpdate(progress);
  }, [progress, onUpdate]);
  
  return null;
};

// Componente principal del visor 3D
const Plant3DAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 45, near: 0.1, far: 500 }}>
        <color attach="background" args={['#001a0a']} />
        <fog attach="fog" args={['#001a0a', 10, 150]} />
        <GradientBackground />
        
        {/* Luces principales */}
        <ambientLight intensity={0.3} color="#ffffff" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
        />
        <hemisphereLight
          args={[0x88ccff, 0x002200, 0.5]}
          position={[0, 20, 0]}
        />
        <pointLight
          position={[0, 15, 10]}
          intensity={0.5}
          color="#88ccff"
          distance={50}
          decay={1.5}
        />
        
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          maxDistance={20}
          minDistance={5}
          zoomSpeed={0.5}
        />
        
        {/* Grid helper para referencia */}
        <gridHelper args={[20, 20, 0x444444, 0x222222]} />
        
        {/* Efecto de partículas flotantes */}
        <FloatingParticles count={200} />
      </Canvas>
    </div>
  );
};

export default Plant3DAnimation;
