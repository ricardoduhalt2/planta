import React, { lazy, Suspense } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Importación lazy del componente de burbujas
const BubbleBackground = lazy(() => import('./BubbleBackground'));

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 py-10 border-t-4 border-[#009A44] relative overflow-hidden">
      <Suspense fallback={null}>
        <BubbleBackground />
      </Suspense>
      <div className="container mx-auto px-6 text-center relative z-20">
        <div className="mb-4">
          <img 
            src="https://www.petgas.com.mx/wp-content/uploads/2025/06/LOGO-PETGAS-NEW.png" 
            alt={t('petgasLogoAlt')} 
            className="animated-footer-logo h-12 mx-auto mb-2" // Applied .animated-footer-logo, removed opacity
          />
        </div>
        <p className="mb-2 text-sm">&copy; {currentYear} {t('footerRights')}</p>
        <p className="text-xs italic mb-3 opacity-80">{t('footerSlogan')}</p>
        <a 
          href="http://www.petgas.com.mx" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`text-[#A0D468] hover:text-white transition-colors duration-200 underline text-sm font-medium`}
        >
          {t('footerWebsite')}
        </a>
      </div>
    </footer>
  );
};

export default Footer;