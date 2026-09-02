import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onLoaded: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(15);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    // Incremental progress simulation for smooth user perception
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const inc = Math.floor(Math.random() * 8) + 4;
        return Math.min(90, prev + inc);
      });
    }, 180);

    const prepareExperience = async () => {
      try {
        // 1. Wait for webfonts to be ready
        if ('fonts' in document) {
          await document.fonts.ready;
        }

        // 2. Preload critical imagery
        const imagesToLoad = ['/monograma-lj.png', '/novios-cutout.png'];
        await Promise.all(
          imagesToLoad.map(
            (src) =>
              new Promise<void>((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
          )
        );
      } catch {
        // Safe fallback
      } finally {
        if (!isMounted) return;
        clearInterval(progressInterval);
        setProgress(100);

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 1100 - elapsed);

        setTimeout(() => {
          if (!isMounted) return;
          setIsDone(true);
          setTimeout(() => {
            if (isMounted) onLoaded();
          }, 450);
        }, remainingDelay);
      }
    };

    prepareExperience();

    // Failsafe timeout so low-end devices never get stuck
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isDone) {
        setProgress(100);
        setIsDone(true);
        onLoaded();
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
      clearTimeout(safetyTimer);
    };
  }, [onLoaded, isDone]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0908] text-white select-none pointer-events-auto font-sans"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-[#0A0908] to-[#0A0908] pointer-events-none" />

          {/* Monogram */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: [0.95, 1.03, 0.95], opacity: 1 }}
            transition={{
              scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.5 },
            }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-[0_0_25px_rgba(212,175,55,0.45)]"
          >
            <img
              src="/monograma-lj.png"
              alt="Luz & Julio"
              className="w-full h-full object-contain invert brightness-200"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10 font-instrument text-2xl sm:text-3xl text-white tracking-widest mt-4"
          >
            Luz & Julio
          </motion.p>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 text-[10px] uppercase tracking-[0.3em] text-gold-300/80 font-sans mt-1"
          >
            Nuestra Boda • 9 de Octubre 2026
          </motion.span>

          {/* Luxury Progress Bar with Real Progress Indicator */}
          <div className="relative z-10 w-40 sm:w-48 mt-6">
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-500 via-gold-300 to-white transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/40 font-mono mt-2 px-0.5">
              <span className="tracking-wider">Cargando experiencia</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
