import React, { useEffect, useRef, useState } from 'react';
import './MarqueeText.css';
import { useLanguage } from '../contexts/LanguageContext';

const LOGO_URL = 'https://www.petgas.com.mx/wp-content/uploads/2025/06/LOGO-PETGAS-NEW.png';

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ 
  text, 
  className = '',
  speed = 20 
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Estilo directo para la animación
  const marqueeStyle: React.CSSProperties = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    paddingLeft: '100%',
    animation: `marquee ${20}s linear infinite`,
    animationPlayState: isHovered ? 'paused' : 'running',
    fontWeight: 800, // Extra bold
    letterSpacing: '0.03em',
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        ref={textRef}
        className="inline-flex items-center whitespace-nowrap"
        style={marqueeStyle}
      >
        <span className="animated-gradient-text">{text}</span>
        <span className="mx-8 inline-flex items-center">
          <img 
            src={LOGO_URL} 
            alt={t('petgasLogoAlt')} 
            className="h-8 w-auto opacity-80 pulsating-logo" 
          />
        </span>
        <span className="animated-gradient-text">{text}</span>
      </div>
      
      {/* Gradient fades */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default MarqueeText;
