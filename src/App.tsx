import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlantDetailView from './components/PlantDetailView';
import Footer from './components/Footer';
import { ALL_PLANTS_DATA } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import LoadingScreen from './components/LoadingScreen';
import { FloatingParticles } from './components/LoadingScreen';
import ScrollToTopButton from './components/ScrollToTopButton';

// Importar estilos de Tailwind CSS
import './styles/main.css';

// Estilos de animación para el fondo
const backgroundStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
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
  // Inyectar estilos en el head del documento
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = backgroundStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  // Se mantiene useLanguage para futuras traducciones
  useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Increased loading time for better effect
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isLoading) { 
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [selectedPlantId, isLoading]);

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

  if (isLoading) {
    return <LoadingScreen onLoaded={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden" style={{ 
      background: 'radial-gradient(ellipse at center, #001a0d 0%, #000000 100%)',
      opacity: 0.98,
      transition: 'opacity 0.8s ease-in-out'
    }}>
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