import React, { useEffect, useState } from 'react';

const BubbleBackground: React.FC = () => {
  const [bubbles] = useState(() => {
    const bubbleGroups = 3; // Número de grupos de burbujas
    const bubblesPerGroup = 7; // Burubujas por grupo
    let bubbles = [];
    
    // Crear grupos de burbujas
    for (let g = 0; g < bubbleGroups; g++) {
      const groupX = 5 + (g * 30); // Grupos espaciados uniformemente
      const isOrangeGroup = g % 2 === 0; // Alternar colores por grupo
      
      for (let i = 0; i < bubblesPerGroup; i++) {
        const size = Math.random() * 20 + 25; // 25-45px
        // Distribuir las burbujas con más espacio entre grupos
        const offsetX = (Math.random() - 0.5) * 5; // Menor dispersión horizontal
        const offsetY = Math.random() * 30; // Menor dispersión vertical inicial
        
        bubbles.push({
          id: `group${g}-bubble${i}`,
          size,
          left: `${Math.min(90, Math.max(10, groupX + offsetX))}%`,
          bottom: `${offsetY}px`,
          delay: `${Math.random() * 3}s`,
          duration: `${Math.random() * 10 + 20}s`, // 20-30s de duración
          isOrange: isOrangeGroup && Math.random() > 0.3, // 70% de probabilidad en grupos naranjas
          group: g
        });
      }
    }
    
    return bubbles;
  });

  useEffect(() => {
    console.log('Bubbles initialized:', bubbles.length);
  }, [bubbles]);

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-full pointer-events-none z-10 overflow-hidden"
      style={{
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <style jsx global>{`
        @keyframes lava-float {
          0% {
            transform: translateY(0) scale(1);
            border-radius: 50%;
            filter: brightness(1);
            opacity: 0;
          }
          2% {
            opacity: 0.8;
            filter: brightness(1.1);
          }
          10% {
            transform: translateY(-5vh) scale(1);
            border-radius: 50%;
          }
          20% {
            transform: translateY(-15vh) scale(1.05);
            border-radius: 45% 55% 55% 45% / 55%;
          }
          35% {
            transform: translateY(-35vh) scale(1.1);
            border-radius: 50% 50% 45% 55% / 50% 55% 45% 50%;
          }
          50% {
            transform: translateY(-55vh) scale(1.15);
            border-radius: 55% 45% 50% 50% / 50% 50% 50% 50%;
          }
          65% {
            transform: translateY(-75vh) scale(1.1);
            border-radius: 45% 55% 45% 55% / 55% 45% 55% 45%;
          }
          80% {
            transform: translateY(-90vh) scale(1.05);
            border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%;
            opacity: 0.7;
          }
          95% {
            transform: translateY(-98vh) scale(1);
            border-radius: 40% 60% 60% 40% / 60%;
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(0.95);
            opacity: 0;
            filter: brightness(1.5);
          }
        }
        
        .bubble {
          position: absolute;
          border-radius: 40% 60% 60% 40% / 60%;
          background: linear-gradient(
            45deg,
            var(--color-1, rgba(0, 90, 40, 0.95)) 0%,
            var(--color-2, rgba(0, 110, 50, 0.9)) 30%,
            var(--color-3, rgba(0, 130, 60, 0.85)) 70%,
            var(--color-4, rgba(0, 150, 70, 0.8)) 100%
          );
          box-shadow: 
            0 0 25px 10px var(--shadow-color, rgba(0, 150, 70, 0.5)),
            inset 0 0 20px 8px rgba(255, 255, 255, 0.3),
            inset 0 0 30px 15px rgba(0, 170, 80, 0.3);
          filter: saturate(1.3) contrast(1.2);
          animation: lava-float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity, border-radius, filter;
          transform: translateZ(0);
          backface-visibility: hidden;
          z-index: 10;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .bubble.orange {
          --color-1: rgba(255, 140, 0, 0.95);
          --color-2: rgba(255, 160, 20, 0.9);
          --color-3: rgba(255, 180, 40, 0.85);
          --color-4: rgba(255, 200, 60, 0.8);
          --shadow-color: rgba(255, 180, 60, 0.6);
        }
        
        .bubble::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 15%;
          left: 15%;
          width: 40%;
          height: 40%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          filter: blur(3px);
        }

        .bubble::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 60%;
          width: 25%;
          height: 25%;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          filter: blur(2px);
        }
      `}</style>

      {bubbles.map((bubble) => {
        const bubbleClasses = [
          'bubble',
          bubble.isOrange ? 'orange' : ''
        ].filter(Boolean).join(' ');
        
        return (
          <div 
            key={bubble.id}
            className={bubbleClasses}
            style={{
              '--size': `${bubble.size}px`,
              '--left': bubble.left,
              '--delay': bubble.delay,
              '--duration': bubble.duration,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: bubble.left,
              bottom: bubble.bottom || '0',
              '--group': bubble.group
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

export default BubbleBackground;
