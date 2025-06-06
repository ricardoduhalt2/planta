import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlantDetailView from './components/PlantDetailView';
import Footer from './components/Footer';
import { ALL_PLANTS_DATA } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import ParticlesBackground from './components/ParticlesBackground';
import LoadingScreen from './components/LoadingScreen';

// Importar estilos de Tailwind CSS
import './styles/main.css';

const App: React.FC = () => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const { t } = useLanguage();

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
    <div className="flex flex-col min-h-screen bg-transparent"> {/* Background is now on body */}
      <ParticlesBackground /> {/* Main app particle background component */}
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
  );
};

export default App;