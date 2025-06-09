import React, { useRef } from 'react';
import { PlantData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import NavbarParticles from './NavbarParticles';

interface NavbarProps {
  plants: PlantData[];
  selectedPlantId: string | null;
  onSelectPlant: (id: string) => void;
  onShowHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ plants, selectedPlantId, onSelectPlant, onShowHome }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const navRef = useRef<HTMLElement>(null);

  return (
    <nav 
      ref={navRef}
      className="bg-gray-900/70 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-gray-700/50 relative overflow-hidden h-16"
      style={{
        background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.7) 100%)'
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
        <NavbarParticles />
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div onClick={onShowHome} className="cursor-pointer flex items-center group" aria-label={t('home')}>
          <div className="relative">
            <img 
              src="/images/LOGO PETGAS NEW.png"
              alt={t('petgasLogoAlt')} 
              className="h-10 md:h-12 mr-2 transform group-hover:scale-105 transition-transform duration-200 relative z-10"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(140, 198, 63, 0.6))',
                transition: 'filter 1s ease-in-out'
              }}
            />
            <div className="absolute inset-0 bg-[#8CC63F] rounded-full opacity-20 blur-xl -z-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <span className={`hidden sm:inline text-xl font-bold group-hover:opacity-80 transition-opacity animated-gradient-title`}>Petgas</span>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={onShowHome}
            aria-label={t('home')}
            className={`glass-button text-xs sm:text-sm ${!selectedPlantId ? 'glass-button-active' : ''}`}
          >
            {t('home')}
          </button>
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className={`glass-button hidden md:block text-xs sm:text-sm ${selectedPlantId === plant.id ? 'glass-button-active' : ''}`}
            >
              {plant.shortName}
            </button>
          ))}
          <select
            value={selectedPlantId || ''}
            onChange={(e) => e.target.value ? onSelectPlant(e.target.value) : onShowHome()}
            aria-label={t('selectPlant')}
            className={`custom-select md:hidden block w-auto text-xs sm:text-sm`}
          >
            <option value="" className="bg-gray-800 text-gray-300">{t('selectPlant')}</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id} className="bg-gray-800 text-gray-300">
                {plant.shortName}
              </option>
            ))}
          </select>
          <button
            onClick={toggleLanguage}
            aria-label={language === 'es' ? t('switchToEnglish') : t('switchToSpanish')}
            className="glass-button w-10 h-10 flex items-center justify-center text-lg rounded-full hover:bg-gray-700/50 transition-colors duration-200 border border-gray-600 hover:border-[#009A44] focus:outline-none focus:ring-2 focus:ring-[#8CC63F] focus:ring-opacity-50 relative group"
            title={language === 'es' ? t('switchToEnglish') : t('switchToSpanish')}
          >
            {/* Mostrar la bandera del idioma actual y al pasar el cursor mostrar a qué idioma cambiará */}
            {language === 'es' ? (
              <span role="img" aria-label="Español" className="hover:scale-110 transition-transform relative">
                🇲🇽
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-xs text-white">
                  EN
                </span>
              </span>
            ) : (
              <span role="img" aria-label="English" className="hover:scale-110 transition-transform relative">
                🇬🇧
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-xs text-white">
                  ES
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;