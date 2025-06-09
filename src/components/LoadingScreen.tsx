import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';
import { useLanguage } from '../contexts/LanguageContext';
import { LOGO_URLS } from '../constants';

// Función para simular carga suave
export const simulateSmoothLoading = (callback: () => void) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5 + 1; // Incremento aleatorio entre 1-6%
    if (progress >= 85) {
      progress = 85; // Llegamos al 85% y esperamos a los recursos reales
      clearInterval(interval);
    }
    callback();
  }, 150);
  
  return () => clearInterval(interval);
};

// Hook para manejar la carga de recursos
const useResourceLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedResources, setLoadedResources] = useState(0);
  const totalResources = 10; // Ajustado al número real de recursos
  
  // Inicializar el progreso en 0
  useEffect(() => {
    setProgress(0);
    setIsLoaded(false);
    setLoadedResources(0);
  }, []);

  const resourceLoaded = useCallback(() => {
    setLoadedResources(prev => {
      const newLoaded = Math.min(prev + 1, totalResources);
      // Calcular el nuevo progreso basado en los recursos cargados
      const newProgress = Math.min(100, Math.round((newLoaded / totalResources) * 100));
      
      // Actualizar el progreso
      setProgress(prevProgress => {
        // Solo actualizar si el nuevo progreso es mayor
        const nextProgress = Math.max(prevProgress, newProgress);
        
        // Si llegamos al 100%, marcar como cargado después de un pequeño retraso
        if (nextProgress >= 100) {
          setTimeout(() => setIsLoaded(true), 800);
          return 100;
        }
        return nextProgress;
      });
      
      return newLoaded;
    });
  }, [totalResources]);

  useEffect(() => {
    const loadResources = async () => {
      // Simular carga de recursos
      const resources = [
        'Inicializando sistema...',
        'Cargando texturas...',
        'Preparando modelos 3D...',
        'Compilando shaders...',
        'Cargando datos...',
        'Verificando configuraciones...',
        'Optimizando rendimiento...',
        'Preparando interfaz...',
        'Cargando efectos visuales...',
        'Iniciando motores...'
      ];

      for (let i = 0; i < resources.length; i++) {
        // Aumentar el tiempo de espera entre recursos
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
        console.log(resources[i]);
        resourceLoaded();
      }

      // Pequeña pausa final antes de marcar como completado
      await new Promise(resolve => setTimeout(resolve, 1000));
      resourceLoaded();
    };

    loadResources();
  }, [resourceLoaded]);

  return { progress, isLoaded, resourceLoaded };
};

// Componente de texto flotante
const FloatingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="text-center"
    >
      <div className="relative inline-block">
        <span className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
          {text}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-20 blur-md -z-10"></div>
      </div>
    </motion.div>
  );
};

// Componente de barra de progreso futurista con transición de colores
const ProgressBar = ({ progress }: { progress: number }) => {
  // Función para obtener el color basado en el progreso
  const getGradientColors = (progress: number) => {
    if (progress < 25) {
      return 'from-blue-400 to-cyan-400';
    } else if (progress < 50) {
      return 'from-cyan-400 to-teal-400';
    } else if (progress < 75) {
      return 'from-teal-400 to-emerald-400';
    } else if (progress < 100) {
      return 'from-emerald-400 to-green-400';
    } else {
      return 'from-green-400 to-green-500';
    }
  };

  return (
    <motion.div 
      className="relative w-64 h-2 bg-gray-800 rounded-full overflow-hidden mt-4"
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getGradientColors(progress)}`}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeInOut',
          backgroundColor: { duration: 1.5 }
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-white opacity-30"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: progress < 100 ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </motion.div>
      <motion.div 
        className="absolute inset-0 border rounded-full pointer-events-none"
        style={{
          borderColor: 'rgba(74, 222, 128, 0.3)'
        }}
        animate={{
          borderColor: ['rgba(74, 222, 128, 0.3)', 'rgba(52, 211, 153, 0.5)', 'rgba(74, 222, 128, 0.3)'],
        }}
        transition={{
          duration: 3,
          repeat: progress < 100 ? Infinity : 0,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
};

// Componente principal del loading screen
const LoadingScreen = ({ onLoaded }: { onLoaded: () => void }) => {
  const { progress, isLoaded, resourceLoaded } = useResourceLoader();
  const [loadingOpacity, setLoadingOpacity] = useState(1);
  const [localProgress, setLocalProgress] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const { language } = useLanguage();
  // Efecto para la secuencia de animación
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 500);
    const timer2 = setTimeout(() => setAnimationStage(2), 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  // Notificar cuando las partículas estén listas
  const handleParticlesLoad = () => {
    resourceLoaded();
  };
  
  // Mostrar contenido después de que las partículas se carguen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Configurar el tiempo mínimo de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 10000); // 10 segundos
    return () => clearTimeout(timer);
  }, []);

  // Notificar cuando todo esté cargado y haya pasado el tiempo mínimo
  useEffect(() => {
    if (isLoaded && minTimeElapsed) {
      // Asegurarnos de que las animaciones terminen su ciclo
      const animationTimer = setTimeout(() => {
        // Pequeño delay para mostrar la animación completa
        const completeTimer = setTimeout(() => {
          onLoaded();
        }, 800);
        
        return () => clearTimeout(completeTimer);
      }, 500);
      
      return () => clearTimeout(animationTimer);
    }
  }, [isLoaded, minTimeElapsed, onLoaded]);
  
  // Efecto para manejar la animación del progreso
  useEffect(() => {
    if (progress > localProgress) {
      const timer = setInterval(() => {
        setLocalProgress(prev => {
          const next = Math.min(prev + 1, progress);
          if (next >= progress) clearInterval(timer);
          return next;
        });
      }, 30); // Aumentado a 30ms para una animación más suave
      return () => clearInterval(timer);
    }
  }, [progress, localProgress]);

  // Efecto para precargar recursos
  useEffect(() => {
    // Contar el componente principal como un recurso cargado
    resourceLoaded();
    
    // Cargar imagen del logo
    const img = new Image();
    img.src = '/images/LOGO PETGAS NEW.png';
    
    const onImageLoad = () => {
      resourceLoaded();
    };
    
    img.onload = onImageLoad;
    
    // Si la imagen ya está en caché, forzar el evento load
    if (img.complete) {
      onImageLoad();
    }
    
    return () => {
      img.onload = null;
    };
  }, [resourceLoaded]);

  // Efecto para manejar la transición de salida
  useEffect(() => {
    if (isLoaded && minTimeElapsed && !isFadingOut) {
      setIsFadingOut(true);
      
      // Asegurar que el progreso llegue al 100%
      setLocalProgress(100);
      
      // Iniciar la transición de salida después de un pequeño retraso
      const fadeOutTimer = setTimeout(() => {
        setLoadingOpacity(0);
      }, 300);
      
      // Notificar al componente padre después de que termine la transición
      const completeTimer = setTimeout(() => {
        onLoaded();
      }, 1000);
      
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isLoaded, minTimeElapsed, onLoaded, isFadingOut]);

  return (
    <div 
      className={`fixed inset-0 w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center z-50 transition-opacity duration-1000`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        opacity: loadingOpacity,
        pointerEvents: isLoaded ? 'none' : 'auto'
      }}
    >
      {/* Fondo con partículas 3D */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 25], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00ff88" />
          <FloatingParticles count={600} onLoad={handleParticlesLoad} />
          
          {/* Efectos de luz adicionales */}
          <pointLight position={[-10, -10, 5]} intensity={0.5} color="#00ffff" />
          <pointLight position={[10, -10, 5]} intensity={0.5} color="#00ff88" />
        </Canvas>
      </div>

      {/* Efecto de brillo y neón */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,200,0.05)_0%,transparent_70%)]"></div>

      {/* Contenido principal - Aparece después del fondo */}
      <div className={`relative z-10 text-center p-8 bg-black/40 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl max-w-md w-full mx-4 transition-opacity duration-500 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Logo con efecto de brillo */}
        <motion.div 
          className="mb-6 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block">
            <img 
              src="/images/LOGO PETGAS NEW.png"
              alt="PETGAS" 
              className="h-16 mx-auto mb-1 drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 blur-xl -z-10"></div>
          </div>
        </motion.div>

        {/* Texto de carga con animación */}
        <motion.div 
          className="mb-6 font-mono text-cyan-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="text-sm mb-2 min-h-[20px]"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              color: [
                '#38bdf8', // blue-400
                '#22d3ee', // cyan-400
                '#2dd4bf', // teal-400
                '#34d399', // emerald-400
                '#4ade80'  // green-400
              ][Math.min(Math.floor(localProgress / 25), 4)]
            }}
            transition={{ 
              duration: 0.8,
              color: { duration: 1.5, ease: 'easeInOut' }
            }}
          >
            {localProgress < 25 && (
              <motion.span
                key="init"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                Initializing system...
              </motion.span>
            )}
            {localProgress >= 25 && localProgress < 50 && (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                Loading components...
              </motion.span>
            )}
            {localProgress >= 50 && localProgress < 75 && (
              <motion.span
                key="setting"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                Setting up environment...
              </motion.span>
            )}
            {localProgress >= 75 && localProgress < 100 && (
              <motion.span
                key="finalizing"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                Finalizing setup...
              </motion.span>
            )}
            {localProgress >= 100 && (
              <motion.span
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  textShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
                }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.2
                }}
                className="inline-block"
              >
                System ready
              </motion.span>
            )}
          </motion.div>
          <div className="flex items-center justify-center space-x-1 text-2xl h-6">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="inline-block w-1 h-1 mx-0.5 bg-cyan-400 rounded-full"
                animate={{
                  y: ['0%', '-50%', '0%'],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: localProgress < 100 ? Infinity : 0,
                  repeatType: 'loop',
                  delay: dot * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Spinner futurista */}
        <motion.div 
          className="relative w-40 h-40 mx-auto mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Anillos concéntricos con efectos de neón */}
          <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-green-400 rounded-full animate-spin-slow" 
               style={{ boxShadow: '0 0 20px rgba(0, 255, 200, 0.4)' }}></div>
          <div className="absolute inset-3 border-4 border-transparent border-b-cyan-400 border-l-green-400 rounded-full animate-spin-slow animate-reverse" 
               style={{ boxShadow: '0 0 15px rgba(0, 200, 255, 0.3)' }}></div>
          <div className="absolute inset-6 border-4 border-transparent border-t-green-300 border-r-cyan-300 rounded-full animate-spin-slow animate-faster" 
               style={{ boxShadow: '0 0 10px rgba(100, 255, 200, 0.3)' }}></div>
          
          {/* Centro con porcentaje */}
          <div className="absolute inset-8 bg-gradient-to-br from-cyan-400 via-green-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
            <motion.span 
              className="text-white font-bold text-xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Math.round(localProgress)}%
            </motion.span>
          </div>
        </motion.div>

        {/* Barra de progreso futurista */}
        <div className="mt-6">
          <ProgressBar progress={localProgress} />
        </div>

        {/* Texto de estado */}
        <motion.div 
          className="mt-6 text-cyan-300 text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {localProgress < 30 && 'Inicializando sistemas...'}
          {localProgress >= 30 && localProgress < 60 && 'Cargando componentes...'}
          {localProgress >= 60 && localProgress < 90 && 'Optimizando rendimiento...'}
          {localProgress >= 90 && localProgress < 100 && 'Preparando la experiencia...'}
          {localProgress >= 100 && '¡Listo!'}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
