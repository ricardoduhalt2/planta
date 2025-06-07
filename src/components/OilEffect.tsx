import React, { useEffect, useRef } from 'react';

interface OilEffectProps {
  width?: number;
  height?: number;
  className?: string;
  children: React.ReactNode;
}

const OilEffect: React.FC<OilEffectProps> = ({
  width = 200,
  height = 200,
  className = '',
  children,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let animationId: number;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - (startTime || 0);
      
      if (svgRef.current) {
        const turbulence = svgRef.current.querySelector('#turbulence');
        if (turbulence) {
          const time = elapsed * 0.001; // Convertir a segundos
          turbulence.setAttribute(
            'baseFrequency',
            `0.0${5 + Math.sin(time * 0.2) * 4} 0.0${5 + Math.cos(time * 0.3) * 4}`
          );
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter 
            id="oil-filter" 
            x="-20%" 
            y="-20%" 
            width="140%" 
            height="140%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence 
              id="turbulence"
              type="fractalNoise" 
              baseFrequency="0.05 0.05"
              numOctaves={3}
              seed={1}
              stitchTiles="stitch"
              result="turbulence"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="turbulence" 
              scale={10}
              xChannelSelector="R" 
              yChannelSelector="G"
              result="displacement"
            />
            <feComposite 
              in="SourceGraphic" 
              in2="displacement" 
              operator="in"
              result="composite"
            />
            <feGaussianBlur 
              in="composite" 
              stdDeviation="1" 
              result="blur"
            />
            <feColorMatrix 
              in="blur" 
              type="matrix" 
              values="0 0 0 0 0.1
                      0 1 0 0 0.6
                      0 0 0.5 0 0.2
                      0 0 0 0.5 0"
              result="colormatrix"
            />
            <feBlend 
              in="SourceGraphic" 
              in2="colormatrix" 
              mode="screen"
              result="blend"
            />
          </filter>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          filter="url(#oil-filter)" 
          opacity="0.7"
        />
      </svg>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OilEffect;
