import React, { useEffect, useRef, useState } from 'react';

interface VantaCloudsBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const VantaCloudsBackground: React.FC<VantaCloudsBackgroundProps> = ({
  children,
  className = '',
}) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    // Detect low-end mobile device to avoid WebGL stutter and heavy battery consumption
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const nav = navigator as any;
    const isLowPower =
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
      (nav.deviceMemory && nav.deviceMemory <= 4) ||
      nav.connection?.saveData === true;

    // For low-end mobile devices, use lightweight CSS ambient glow instead of heavy 3D WebGL
    if (isMobile && isLowPower) {
      setIsLowEnd(true);
      return;
    }

    let vantaEffect: any = null;

    const loadScript = async () => {
      try {
        const THREE = await import('three');
        (window as any).THREE = THREE;

        if (!(window as any).VANTA?.CLOUDS) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.body.appendChild(script);
          });
        }

        if ((window as any).VANTA?.CLOUDS && vantaRef.current) {
          vantaEffect = (window as any).VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: !isMobile,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            skyColor: 0x14100c,
            cloudColor: 0x362c22,
            cloudShadowColor: 0x080604,
            sunColor: 0xd4af37,
            sunGlareColor: 0x453218,
            sunlightColor: 0xd4af37,
            speed: isMobile ? 0.08 : 0.15,
          });
        }
      } catch {
        // Fallback to CSS atmosphere
        setIsLowEnd(true);
      }
    };

    loadScript();

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden text-white ${className}`}>
      {/* Vanta 3D Clouds WebGL Canvas Target (Active on capable desktop/tablets) */}
      {!isLowEnd && (
        <div
          ref={vantaRef}
          className="fixed inset-0 z-0 h-full w-full pointer-events-none"
        />
      )}

      {/* Lightweight, Ultra-Smooth 60fps CSS Atmosphere for Low-End Mobile & Fallback */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0908]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(197,160,89,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(217,165,159,0.08),transparent_70%)]" />
      </div>

      {/* Atmospheric Vignette Overlay for High Readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default VantaCloudsBackground;
