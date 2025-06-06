import { useEffect, useRef } from 'react';

// Declare tsParticles as it's loaded from CDN
declare var tsParticles: any;

const ParticlesBackground: React.FC = () => {
  const particlesRef = useRef<boolean>(false); // To ensure init only once

  useEffect(() => {
    if (typeof tsParticles === 'undefined') {
      console.error("tsParticles is not loaded. Make sure it's included in your HTML.");
      return;
    }
    if (particlesRef.current) { // Already initialized
      return;
    }
    particlesRef.current = true;

    tsParticles.load({
      id: "tsparticles-background", // The ID of the div in index.html
      options: {
        autoPlay: true,
        background: {
          color: {
            value: 'transparent' // Background is handled by Three.js canvas
          },
        },
        fullScreen: {
          enable: false, // The container div handles positioning
          zIndex: 0
        },
        particles: {
          number: {
            value: 30, // Fewer, larger particles
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#00ff88", "#00ccff", "#88ff88", "#a0f0c0", "#88ffff"] // Tonos de verde y cian que combinen con el fondo
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: { min: 0.2, max: 0.6 }, // Más transparentes para combinar con el fondo
            animation: {
              enable: true,
              speed: 0.8,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: { min: 10, max: 30 }, // Tamaño más pequeño para mejor integración
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 5,
              sync: false,
              startValue: "random",
              destroy: "none"
            }
          },
          links: { // Disabled for lava lamp effect
            enable: false,
          },
          move: {
            enable: true,
            speed: {min: 0.2, max: 0.8}, // Movimiento más lento
            direction: "top", // Primarily upwards
            random: true,
            straight: false,
            outModes: { // How particles behave when they reach the edge
              default: "destroy", // Disappear at the top
              bottom: "out", // Appear from bottom if going down (though direction is top)
            },
            attract: {
              enable: false,
            },
            trail: {
              enable: true,
              length: 10,
              fillColor: "#000000"
            },
            wobble: { // Gentle wobble for organic feel
                enable: true,
                distance: 5,
                speed: 5
            },
          },
          zIndex: {
            value: 1, // Ensure they are behind content but above plain background
            opacityRate: 1,
            sizeRate: 1,
            velocityRate: 1
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "bubble", // Particles expand on hover
            },
            onClick: {
              enable: false, // No click interaction
            },
            resize: {
              enable: true,
              delay: 0.5
            }
          },
          modes: {
            bubble: {
              distance: 100,
              duration: 2,
              opacity: 0.8,
              size: 50, // Max size on bubble
              color: { value: "#A0D468" }
            },
            repulse: { // Kept in case mode changes, but not active for hover
              distance: 100,
              duration: 0.4
            },
          }
        },
        detectRetina: true,
      }
    });
  }, []);

  return null; // This component doesn't render any direct DOM, it just initializes particles
};

export default ParticlesBackground;