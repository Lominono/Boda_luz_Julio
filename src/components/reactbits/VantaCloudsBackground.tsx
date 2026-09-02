import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VantaCloudsBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  onReady?: () => void;
}

export const VantaCloudsBackground: React.FC<VantaCloudsBackgroundProps> = ({
  children,
  className = '',
  onReady,
}) => {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set global THREE for Vanta
    (window as any).THREE = THREE;
    let vantaEffect: any = null;
    let isMounted = true;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const initVanta = () => {
      if (!isMounted || !vantaRef.current) return;
      try {
        vantaEffect = (window as any).VANTA.CLOUDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          skyColor: 0x449393,
          cloudColor: 0xbec8d7,
          sunGlareColor: 0xcf6441,
          speed: isMobile ? 0.15 : 0.20,
        });
        if (onReady) onReady();
      } catch (err) {
        console.warn('Vanta initialization error:', err);
        if (onReady) onReady();
      }
    };

    const loadScript = async () => {
      if (!(window as any).VANTA?.CLOUDS) {
        await new Promise<void>((resolve) => {
          const existing = document.querySelector('script[src*="vanta.clouds"]');
          if (existing) {
            existing.addEventListener('load', () => resolve());
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => resolve();
          document.body.appendChild(script);
        });
      }

      initVanta();
    };

    loadScript();

    return () => {
      isMounted = false;
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [onReady]);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden text-white ${className}`}>
      {/* Vanta 3D Clouds WebGL Canvas Target */}
      <div
        ref={vantaRef}
        className="fixed inset-0 z-0 h-full w-full pointer-events-none"
      />

      {/* Atmospheric Vignette Overlay for High Readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/60 via-black/30 to-black/80 backdrop-blur-[0.5px]" />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default VantaCloudsBackground;
