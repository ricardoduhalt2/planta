import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PlantDetailView from './components/PlantDetailView';
import Footer from './components/Footer';
import { PlantData } from './types';
import { ALL_PLANTS_DATA, PETGAS_GREEN, PETGAS_WHITE, MAIN_LOGO_URL, NAVBAR_LOGO_URL } from './constants';
import { useLanguage } from './contexts/LanguageContext';
import ParticlesBackground from './components/ParticlesBackground'; // Ensure relative path

const App: React.FC = () => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Adjusted loading time for modern feel
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
    return (
      // Loading screen with dark background matching the app's theme
      <div className={`fixed inset-0 bg-gradient-to-br from-[#1f2937] to-[#111827] flex flex-col items-center justify-center z-[100] transition-opacity duration-500`}>
        {/* Particles could also be rendered here if desired for the loading screen itself, 
            but the #tsparticles-background div in index.html should already cover this. 
            If explicitly needed: <ParticlesBackground /> */}
        <img 
          src={MAIN_LOGO_URL} 
          alt={t('petgasLoadingLogoAlt')} 
          className="h-20 md:h-24 mb-8 hero-logo-effects animated-logo-breathe" 
        />
        <div className="pulsing-dots-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className={`text-xl font-semibold text-gray-300`}>{t('loading')}</p>
      </div>
    );
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