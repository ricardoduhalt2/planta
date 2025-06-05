import React from 'react';
import { PlantData } from '../types';
import { MAIN_LOGO_URL, PETGAS_ACCENT_GREEN } from '../constants'; // Removed unused color imports
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  plants: PlantData[];
  onSelectPlant: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ plants, onSelectPlant }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-70px)] bg-transparent flex flex-col items-center justify-center p-6 text-center selection:bg-[#A0D468] selection:text-white">
      <img 
        src={MAIN_LOGO_URL} 
        alt={t('petgasMainLogoAlt')}
        className="hero-logo-effects w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto h-auto mb-10 mt-8"
      />
      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animated-gradient-title text-gray-100`}>
        {t('heroTitle')}
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
        {t('heroSubtitle')}
      </p>
      
      <div className="mb-10 w-full max-w-6xl px-4">
        <h2 className={`text-3xl font-bold mb-10 animated-gradient-title text-gray-100`}>{t('ourPlants')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {plants.map((plant) => (
            <div 
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className={`bg-slate-800/70 backdrop-filter backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 border-slate-700 hover:border-[#009A44] flex flex-col items-center group overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8CC63F] to-[#009A44] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              <img 
                src={plant.mainImage} 
                alt={`${t(plant.cardDisplayNameKey)} ${t('plantImageAltSuffix') || 'plant image'}`} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6 flex flex-col flex-grow w-full">
                <h3 className={`text-2xl font-bold mb-3 text-[#009A44] text-center`}>{t(plant.cardDisplayNameKey)}</h3>
                <button 
                  aria-label={`${t('viewDetails')} for ${t(plant.cardDisplayNameKey)}`}
                  className={`glass-button w-full mt-auto py-3 px-5 text-white`} // Applied .glass-button
                >
                  {t('viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <p className="text-slate-400 mt-12 text-sm">
        {t('heroSelectPrompt')}
      </p>
    </div>
  );
};

export default HeroSection;