import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import FooterBackground from './FooterBackground';

// Estilos para el efecto de brillo parpadeante
const glowPulse = `
  @keyframes glowPulse {
    0% { filter: drop-shadow(0 0 5px rgba(140, 198, 63, 0.7)); }
    50% { filter: drop-shadow(0 0 20px rgba(140, 198, 63, 0.9)); }
    100% { filter: drop-shadow(0 0 5px rgba(140, 198, 63, 0.7)); }
  }
`;

// Inyectar estilos globales
const injectGlowStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = glowPulse;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [isGlowing, setIsGlowing] = useState(true);

  useEffect(() => {
    // Inyectar estilos al montar el componente
    const cleanup = injectGlowStyles();
    
    // Efecto de parpadeo aleatorio
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
      const duration = 2000 + Math.random() * 3000; // 2-5 segundos
      setTimeout(() => setIsGlowing(true), duration);
    }, 3000 + Math.random() * 4000); // 3-7 segundos

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <FooterBackground />
      <footer 
        className="relative border-t-4 border-[#009A44] text-slate-200" 
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: '-1px', // Asegura que el borde superior sea visible
        }}
      >
        <div 
          className="py-12" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="container mx-auto px-6 text-center">
            <div className="mb-6">
              <img 
                src="https://www.petgas.com.mx/wp-content/uploads/2025/06/LOGO-PETGAS-NEW.png" 
                alt={t('petgasLogoAlt')} 
                className={`h-14 mx-auto mb-3 transition-all duration-1000 ease-in-out ${isGlowing ? 'animate-glowPulse' : ''}`}
                style={{
                  animation: isGlowing ? 'glowPulse 2s infinite' : 'none',
                  filter: isGlowing ? 'drop-shadow(0 0 10px rgba(140, 198, 63, 0.8))' : 'none',
                  transition: 'filter 1s ease-in-out'
                }}
              />
            </div>
            <p className="mb-3 text-sm text-gray-300">&copy; {currentYear} {t('footerRights')}</p>
            <p className="text-sm italic mb-4 text-gray-400">{t('footerSlogan')}</p>
            <a 
              href="http://www.petgas.com.mx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-[#8CC63F] hover:text-white transition-colors duration-300 text-sm font-medium px-4 py-2 rounded-md hover:bg-white/5"
            >
              {t('footerWebsite')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;