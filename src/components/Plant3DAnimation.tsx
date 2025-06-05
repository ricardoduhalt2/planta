import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Componente de partículas flotantes
const FloatingParticles = ({ count = 2000 }) => {
  const particles = useRef<THREE.Points>(null);
  
  // Crear geometría de partículas
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);
  
  // Animar partículas
  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particles.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry attach="geometry" {...particlesGeometry} />
      <pointsMaterial 
        size={0.1} 
        color="#00ffff"
        transparent 
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Shader para el efecto de wireframe con gradiente animado
const TechnicalWireframeShader = {
  uniforms: {
    time: { value: 0 },
    lineColor1: { value: new THREE.Color(0x00ff88) },  // Verde esmeralda
    lineColor2: { value: new THREE.Color(0xffff00) },  // Amarillo brillante
    bgColor: { value: new THREE.Color(0x001a0f) },     // Verde oscuro
    opacity: { value: 1.0 },
    gradientSpeed: { value: 0.5 },
    pulseSpeed: { value: 0.8 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 lineColor1;  // Verde
    uniform vec3 lineColor2;  // Amarillo
    uniform vec3 bgColor;     // Fondo oscuro
    uniform float opacity;
    uniform float gradientSpeed;
    uniform float pulseSpeed;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    // Función para crear un patrón de líneas de cuadrícula
    float grid(vec2 st, float res) {
      vec2 grid = fract(st);
      float line = min(step(res, grid.x), step(res, grid.y));
      return 1.0 - line;
    }
    
    // Función para mezclar colores con ruido
    vec3 gradientColor(float t) {
      // Añadir ruido suave al gradiente
      float noise = 0.5 + 0.5 * sin(vWorldPosition.y * 5.0 + time * 0.5);
      t = clamp(t + noise * 0.1, 0.0, 1.0);
      
      // Crear gradiente entre los dos colores
      return mix(lineColor1, lineColor2, smoothstep(0.0, 1.0, t));
    }
    
    void main() {
      // Coordenadas UV basadas en la posición del mundo
      vec2 uv = vWorldPosition.xz * 0.5;
      
      // Crear patrón de cuadrícula
      float gridPattern = grid(uv, 0.1);
      
      // Efecto de pulso para la animación
      float pulse = 0.7 + 0.3 * sin(time * pulseSpeed);
      
      // Crear gradiente vertical animado
      float gradient = 0.5 + 0.5 * sin(time * gradientSpeed + vWorldPosition.y * 2.0);
      
      // Color de línea con gradiente animado
      vec3 lineColor = gradientColor(gradient);
      
      // Aplicar brillo a las líneas
      lineColor = mix(lineColor, vec3(1.0), 0.3 * pulse);
      
      // Color base (fondo oscuro)
      vec3 color = bgColor;
      
      // Aplicar color de línea con efecto de pulso
      color = mix(color, lineColor, gridPattern * pulse);
      
      // Resaltar bordes con brillo
      float edge = smoothstep(0.7, 1.0, abs(dot(vNormal, vec3(0.0, 1.0, 0.0))));
      color = mix(color, vec3(1.0, 1.0, 0.8), edge * 0.8);
      
      gl_FragColor = vec4(color, opacity);
    }
  `,
  wireframe: false,
  transparent: true,
  side: THREE.DoubleSide
};

// Props del componente Model
interface ModelProps {
  scanProgress: number; // 0 a 1 para la transición
}

// Componente de cámara con zoom al 450%
const IndustrialCamera = () => {
  // Posición más cercana para simular zoom al 450% con mejor ángulo
  return <PerspectiveCamera 
    makeDefault 
    fov={15} 
    position={[0, 0.5, 1.8]} // Ajuste para compensar la altura del modelo
    rotation={[0, 0, 0]} 
  />;
};

// Props del componente Model
interface ModelProps {
  scanProgress: number; // 0 a 1 para la transición
}

// Componente del modelo 3D
const Model: React.FC<ModelProps> = ({ scanProgress }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Crear material con shader personalizado
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      ...TechnicalWireframeShader,
      wireframe: true,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Configurar valores iniciales de los uniformes
    mat.uniforms.lineColor1.value = new THREE.Color(0x00ff88);  // Verde esmeralda
    mat.uniforms.lineColor2.value = new THREE.Color(0xffff00);  // Amarillo brillante
    mat.uniforms.bgColor.value = new THREE.Color(0x001a0f);     // Verde oscuro
    mat.uniforms.opacity.value = 1.0;
    mat.uniforms.gradientSpeed.value = 0.3;  // Velocidad del gradiente
    mat.uniforms.pulseSpeed.value = 0.8;     // Velocidad del pulso
    
    return mat;
  }, []);
  
  // Actualizar el material basado en el progreso del escaneo
  useEffect(() => {
    if (materialRef.current) {
      // Invertir el progreso para que 0 = wireframe, 1 = modelo normal
      const wireframeAmount = 1.0 - scanProgress;
      
      // Actualizar uniformes del shader
      materialRef.current.uniforms.time.value = performance.now() * 0.001;
      materialRef.current.uniforms.opacity.value = 1.0;
      
      // Interpolar entre wireframe y modelo normal
      materialRef.current.wireframe = wireframeAmount > 0.5;
      
      // Si estamos en modo wireframe, usar el shader personalizado
      if (wireframeAmount > 0.5) {
        materialRef.current.wireframeLinewidth = 1.5;
        materialRef.current.uniforms.lineColor.value.set(0x4d79ff);
        materialRef.current.uniforms.bgColor.value.set(0x000d33);
      }
      
      materialRef.current.needsUpdate = true;
    }
  }, [scanProgress]);
  
  // Cargar modelo OBJ
  useEffect(() => {
    if (!model) {
      const loader = new OBJLoader();
      let mounted = true;
      
      const loadModel = async () => {
        try {
          // Cargar el modelo OBJ desde la ruta correcta
          const obj = await loader.loadAsync('/images/Industrial_Blueprint_0605180610_generate.obj');
          
          if (!mounted) return;
          
          // Clonar el modelo para evitar problemas de referencia
          const modelGroup = obj.clone();
          
          // Ajustar escala y posición
          const box = new THREE.Box3().setFromObject(modelGroup);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.5 / maxDim; // Ajuste de escala más pequeño para mejor visualización
          
          // Aplicar transformaciones
          modelGroup.scale.set(scale, scale, scale);
          
          // Posicionar el modelo centrado en el origen
          modelGroup.position.x = -center.x * scale - 0.2; // Pequeño ajuste a la izquierda
          modelGroup.position.y = -center.y * scale + 0.3; // Pequeño ajuste hacia arriba
          modelGroup.position.z = -center.z * scale;
          
          // Aplicar material a todos los hijos del modelo
          modelGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = material;
            }
          });
          
          setModel(modelGroup);
        } catch (error) {
          console.error('Error al cargar el modelo:', error);
        }
      };
      
      loadModel();
      
      return () => {
        mounted = false;
        if (model) {
          const scene = new THREE.Scene();
          scene.remove(model);
        }
      };
    }
  }, [model, material]);
  
  if (!model) return null;
  
  return <primitive ref={groupRef} object={model} />;
};

// Componente de animación que se ejecuta dentro del Canvas
const AnimationController = ({ onUpdate }: { onUpdate: (progress: number) => void }) => {
  const forward = useRef(true);
  const progress = useRef(0);
  // Velocidad de la animación (más lenta para mejor efecto)
  const speed = 0.15;
  
  useFrame(() => {
    // Calcular el siguiente valor basado en la dirección
    const nextValue = forward.current 
      ? progress.current + (speed * 0.01) 
      : progress.current - (speed * 0.01);
    
    // Cambiar dirección si llegamos a los extremos
    if (nextValue >= 1.0) {
      forward.current = false;
      progress.current = 1.0;
    } else if (nextValue <= 0) {
      forward.current = true;
      progress.current = 0;
    } else {
      progress.current = nextValue;
    }
    
    // Notificar el cambio
    onUpdate(progress.current);
  });
  
  return null;
};

// Componente principal
export default function Plant3DAnimation() {
  const [scanProgress, setScanProgress] = useState(0);

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-xl overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <IndustrialCamera />
          <FloatingParticles count={1000} />
          <Model scanProgress={scanProgress} />
          <AnimationController onUpdate={setScanProgress} />
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <Environment preset="city" />
          <axesHelper args={[20]} position={[0, 0.1, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
};
