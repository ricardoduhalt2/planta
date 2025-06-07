import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlantDetailView from './components/PlantDetailView';
import Footer from './components/Footer';
import { ALL_PLANTS_DATA } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import LoadingScreen from './components/LoadingScreen';
import FloatingParticles from './components/FloatingParticles';
import ScrollToTopButton from './components/ScrollToTopButton';

// Importar estilos de Tailwind CSS
import './styles/main.css';
import './styles/fonts.css';

// Estilos de animación para el fondo
const backgroundStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  /* Asegurar que el gradiente de texto sea compatible con navegadores */
  @supports (-webkit-background-clip: text) {
    .animated-gradient-text {
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .glow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(0, 90, 48, 0.15) 0%, transparent 70%);
    animation: float 8s ease-in-out infinite;
  }
`;

const App: React.FC = () => {
  // Estados
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [contentOpacity, setContentOpacity] = useState<number>(0);
  
  // Inyectar estilos en el head del documento
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = backgroundStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Se mantiene useLanguage para futuras traducciones
  useLanguage();

  useEffect(() => {
    // Tiempo mínimo que se mostrará el loading (10 segundos)
    const minLoadingTime = 10000;
    // Tiempo máximo que puede durar el loading (20 segundos)
    const maxLoadingTime = 20000;
    
    const startTime = Date.now();
    let resourcesLoaded = false;
    let minTimeReached = false;
    
    // Función para verificar si todos los recursos están cargados
    const checkResources = () => {
      const images = Array.from(document.images);
      
      // Verificar si todas las imágenes están cargadas
      const allImagesLoaded = images.every(img => img.complete);
      
      // Verificar si el DOM está completamente cargado
      const domLoaded = document.readyState === 'complete';
      
      return allImagesLoaded && domLoaded;
    };
    
    // Función para intentar ocultar el loading
    const tryHideLoading = () => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - startTime;
      
      // Verificar si ya pasó el tiempo mínimo y si los recursos están cargados
      if (timeElapsed >= minLoadingTime && (resourcesLoaded || checkResources())) {
        setContentOpacity(1);
        setIsLoading(false);
        window.scrollTo({top: 0, behavior: 'smooth'});
        return true;
      }
      return false;
    };
    
    // Función para verificar recursos periódicamente
    const checkResourcesInterval = setInterval(() => {
      if (checkResources()) {
        resourcesLoaded = true;
        if (minTimeReached && tryHideLoading()) {
          clearInterval(checkResourcesInterval);
          clearTimeout(maxTimeTimer);
        }
      }
    }, 100);
    
    // Configurar el tiempo mínimo
    const minTimeTimer = setTimeout(() => {
      minTimeReached = true;
      if (tryHideLoading()) {
        clearInterval(checkResourcesInterval);
        clearTimeout(maxTimeTimer);
      }
    }, minLoadingTime);
    
    // Configurar el tiempo máximo como respaldo
    const maxTimeTimer = setTimeout(() => {
      clearInterval(checkResourcesInterval);
      setIsLoading(false);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, maxLoadingTime);
    
    // Limpiar timers al desmontar
    return () => {
      clearInterval(checkResourcesInterval);
      clearTimeout(minTimeTimer);
      clearTimeout(maxTimeTimer);
    };
  }, []);

  const handleSelectPlant = (id: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPlantId(id);
      setIsTransitioning(false);
    }, 300); 
  };

  const handleShowHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPlantId(null);
      setIsTransitioning(false);
    }, 300);
  };

  const selectedPlantData = ALL_PLANTS_DATA.find(p => p.id === selectedPlantId);

  // Mostrar el LoadingScreen hasta que todo esté cargado
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <LoadingScreen onLoaded={() => {
          // Pequeño retraso para asegurar que la transición sea visible
          setTimeout(() => {
            setContentOpacity(1);
            setIsLoading(false);
          }, 500);
        }} />
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col min-h-screen overflow-hidden" 
      style={{ 
        background: 'radial-gradient(ellipse at center, #001a0d 0%, #000000 100%)',
        opacity: contentOpacity,
        transition: 'opacity 0.8s ease-in-out'
      }}
    >
      {/* Efecto de partículas flotantes */}
      <div className="fixed inset-0 -z-10">
        <Canvas 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            background: 'transparent',
            opacity: 0.8
          }}
          camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 100 }}
        >
          <Suspense fallback={null}>
            <FloatingParticles 
              count={800} 
              onLoad={() => console.log('Particles loaded')} 
            />
          </Suspense>
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ff88" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00aaff" />
          <fog attach="fog" args={['#001a0d', 10, 50]} />
        </Canvas>
      </div>
      
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-900 opacity-10" />
      <div className="glow" style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(0, 90, 48, 0.15) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      
      {/* Contenido principal */}
      <div className="relative">
        <div className="relative z-10">
          <Navbar 
            plants={ALL_PLANTS_DATA} 
            selectedPlantId={selectedPlantId}
            onSelectPlant={handleSelectPlant}
            onShowHome={handleShowHome}
          />
          <main className={`flex-grow transition-opacity duration-300 min-h-[calc(100vh-200px)] ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {selectedPlantData ? (
              <PlantDetailView plant={selectedPlantData} />
            ) : (
              <HeroSection plants={ALL_PLANTS_DATA} onSelectPlant={handleSelectPlant} />
            )}
          </main>
        </div>
        <Footer />
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default App;