import React, { Suspense } from 'react';
import { PlantData } from '../types';
import { MAIN_LOGO_URL } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import Plant3DAnimation from './Plant3DAnimation';

// Componente de carga para la visualización 3D
const Loading3DModel = () => (
  <div className="w-full h-[500px] bg-gray-900/50 flex items-center justify-center rounded-xl">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009A44] mx-auto mb-4"></div>
      <p className="text-gray-400">Cargando visualización 3D...</p>
    </div>
  </div>
);

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
      <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 animated-gradient-title text-gray-100`}>
        {t('heroTitle')}
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
        {t('heroSubtitle')}
      </p>
      
      <div className="mb-10 w-full max-w-6xl px-4">
        <h2 className="text-3xl font-bold mb-10 animated-gradient-title text-gray-100">{t('ourPlants')}</h2>
        
        {/* Animación 3D */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50">
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
            <Suspense fallback={<Loading3DModel />}>
              <Plant3DAnimation />
            </Suspense>
          </div>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-2 text-center">
            <p className="text-gray-400 text-xs">
              Usa el ratón para rotar, hacer zoom y moverte por la escena
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 max-w-7xl mx-auto">
          {plants.map((plant) => (
            <div 
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className="relative bg-slate-800/80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,154,68,0.25)] transform hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer border border-slate-700/50 hover:border-[#009A44]/50 flex flex-col items-center group overflow-hidden hover:bg-slate-800/70 transition-colors duration-300"
            >
              {/* Efecto de brillo al pasar el ratón */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 group-hover:bg-[rad-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#8CC63F]/10 via-transparent to-[#009A44]/10 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#009A44]/5 group-hover:to-[#8CC63F]/10 transition-all duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8CC63F] via-[#009A44] to-[#8CC63F] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative z-10 w-full h-64 overflow-hidden">
                <div className="relative w-full h-full overflow-hidden">
                  <img 
                    src={plant.mainImage} 
                    alt={`${t(plant.cardDisplayNameKey)} ${t('plantImageAltSuffix') || 'plant image'}`} 
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
                    style={{
                      transformOrigin: 'center center',
                      willChange: 'transform',
                      objectPosition: plant.id === 'petgas-4k' ? 'center 30%' : 'center center'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8CC63F]/20 to-[#009A44]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#8CC63F] via-[#009A44] to-[#8CC63F] group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
              <div className="relative z-10 p-8 flex flex-col flex-grow w-full bg-transparent">
                <div className="bg-transparent p-2 rounded-lg">
                  <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#8CC63F] to-[#009A44] text-center">
                    {t(plant.cardDisplayNameKey)}
                  </h3>
                </div>
                <button 
                  aria-label={`${t('viewDetails')} for ${t(plant.cardDisplayNameKey)}`}
                  className="glass-button w-full mt-auto py-3 px-5 text-white font-medium tracking-wide group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2"
                >
                  <span>{t('viewDetails')}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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