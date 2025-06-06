import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlantDetailView from './components/PlantDetailView';
import Footer from './components/Footer';
import { ALL_PLANTS_DATA } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import ParticlesBackground from './components/ParticlesBackground';
import LoadingScreen from './components/LoadingScreen';
import { EtherealSky } from './components/EtherealSky';

// Importar estilos de Tailwind CSS
import './styles/main.css';

const App: React.FC = () => {
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
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Fondo etéreo */}
      <div className="fixed inset-0 -z-10">
        <Canvas>
          <Suspense fallback={null}>
            <EtherealSky />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Capa de partículas */}
      <div className="fixed inset-0 -z-10">
        <ParticlesBackground />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        <Navbar 
          plants={ALL_PLANTS_DATA} 
          selectedPlantId={selectedPlantId}
          onSelectPlant={handleSelectPlant}
          onShowHome={handleShowHome}
        />
        <main className={`flex-grow transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {selectedPlantData ? (
            <PlantDetailView plant={selectedPlantData} />
          ) : (
            <HeroSection plants={ALL_PLANTS_DATA} onSelectPlant={handleSelectPlant} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;