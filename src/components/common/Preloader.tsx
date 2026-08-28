import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onLoaded: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smart preloader: preloads critical assets or times out smoothly after 1.2s max
    const startTime = Date.now();

    const preloadAssets = async () => {
      try {
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
        // Ignore fallback
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 900 - elapsed);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onLoaded, 500);
        }, remaining);
      }
    };

    preloadAssets();
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white select-none pointer-events-auto"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/20 via-black to-black pointer-events-none" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.5 },
            }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]"
          >
            <img
              src="/monograma-lj.png"
              alt="Luz & Julio"
              className="w-full h-full object-contain invert brightness-200"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 font-instrument text-2xl sm:text-3xl text-white tracking-widest mt-4"
          >
            Luz & Julio
          </motion.p>

          <div className="relative z-10 w-32 h-[1.5px] bg-white/10 rounded-full mt-4 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
