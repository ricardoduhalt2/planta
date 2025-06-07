import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar/ocultar el botón basado en la posición de desplazamiento
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Función para hacer scroll suave hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
        shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-petgas-green focus:ring-opacity-50
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Volver arriba"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-petgas-green to-petgas-light-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <FaArrowUp className="relative z-10 text-white text-xl" />
      </div>
      <span className="sr-only">Volver arriba</span>
    </button>
  );
};

export default ScrollToTopButton;
