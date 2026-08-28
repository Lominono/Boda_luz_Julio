import React, { useEffect, useRef } from 'react';

interface PrismBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const PrismBackground: React.FC<PrismBackgroundProps> = ({
  children,
  className = '',
  intensity = 1.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.4, targetX: 0.5, targetY: 0.4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / width;
      mouseRef.current.targetY = e.clientY / height;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX / width;
        mouseRef.current.targetY = e.touches[0].clientY / height;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Prism Caustics & Bokeh Particles Simulation
    let time = 0;
    const render = () => {
      time += 0.006;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Base: Velvet dark bronze obsidian
      ctx.fillStyle = '#0B0908';
      ctx.fillRect(0, 0, width, height);

      const centerX = width * mouseRef.current.x;
      const centerY = height * mouseRef.current.y;

      // 1. Warm Ambient Core
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.8
      );
      ambientGrad.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
      ambientGrad.addColorStop(0.25, 'rgba(197, 160, 89, 0.09)');
      ambientGrad.addColorStop(0.6, 'rgba(45, 36, 26, 0.04)');
      ambientGrad.addColorStop(1, 'rgba(11, 9, 8, 0)');

      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Refracting Prism Rays
      const beamCount = 7;
      for (let i = 0; i < beamCount; i++) {
        const angle = (i * Math.PI * 2) / beamCount + Math.sin(time * 0.8 + i) * 0.25;
        const length = Math.max(width, height) * 1.3;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);

        const beamGradient = ctx.createLinearGradient(0, 0, length, 0);
        const alpha = (0.1 + Math.sin(time * 1.5 + i) * 0.035) * intensity;

        if (i % 3 === 0) {
          beamGradient.addColorStop(0, `rgba(230, 202, 101, ${alpha * 1.4})`);
          beamGradient.addColorStop(0.4, `rgba(212, 175, 55, ${alpha * 0.7})`);
        } else if (i % 3 === 1) {
          beamGradient.addColorStop(0, `rgba(217, 165, 159, ${alpha * 1.1})`);
          beamGradient.addColorStop(0.5, `rgba(184, 147, 74, ${alpha * 0.5})`);
        } else {
          beamGradient.addColorStop(0, `rgba(250, 247, 242, ${alpha * 1.3})`);
          beamGradient.addColorStop(0.4, `rgba(197, 160, 89, ${alpha * 0.6})`);
        }
        beamGradient.addColorStop(1, 'rgba(11, 9, 8, 0)');

        ctx.fillStyle = beamGradient;
        ctx.beginPath();
        ctx.moveTo(0, -width * 0.05);
        ctx.lineTo(length, -width * 0.2);
        ctx.lineTo(length, width * 0.2);
        ctx.lineTo(0, width * 0.05);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 3. Bokeh Orbs of Ambient Light
      for (let k = 0; k < 5; k++) {
        const bX = (Math.sin(time * 0.3 + k * 1.8) * 0.4 + 0.5) * width;
        const bY = (Math.cos(time * 0.25 + k * 2.2) * 0.4 + 0.5) * height;
        const bRadius = (Math.sin(time + k) * 30 + 80) * intensity;

        const bokehGrad = ctx.createRadialGradient(bX, bY, 0, bX, bY, bRadius);
        bokehGrad.addColorStop(0, 'rgba(212, 175, 55, 0.06)');
        bokehGrad.addColorStop(0.5, 'rgba(197, 160, 89, 0.02)');
        bokehGrad.addColorStop(1, 'rgba(11, 9, 8, 0)');

        ctx.fillStyle = bokehGrad;
        ctx.beginPath();
        ctx.arc(bX, bY, bRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Floating Gold Dust Embers
      for (let j = 0; j < 30; j++) {
        const pX = (Math.sin(time * 0.4 + j * 1.4) * 0.5 + 0.5) * width;
        const pY = (Math.cos(time * 0.35 + j * 2.1) * 0.5 + 0.5) * height;
        const pSize = Math.sin(time * 1.2 + j) * 1.2 + 1.8;
        const pAlpha = (Math.sin(time * 1.8 + j) * 0.35 + 0.5) * 0.45;

        ctx.fillStyle = j % 2 === 0 ? '#E6CA65' : '#DFC184';
        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[#0B0908] text-[#FAF7F2] ${className}`}>
      {/* Interactive Prism Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      />

      {/* Cinematic Film Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.7'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default PrismBackground;
