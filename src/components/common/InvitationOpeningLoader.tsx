import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvitationOpeningLoaderProps {
  isVisible: boolean;
}

export const InvitationOpeningLoader: React.FC<InvitationOpeningLoaderProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="invitation-opening-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 text-white select-none pointer-events-auto backdrop-blur-xl font-sans"
        >
          {/* Subtle Ambient Radial Gold Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/20 via-black to-black pointer-events-none" />

          {/* Monogram Badge */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
            transition={{
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.4 },
            }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(212,175,55,0.45)]"
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
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative z-10 font-instrument text-2xl sm:text-3xl text-white tracking-widest mt-4"
          >
            Luz & Julio
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative z-10 font-serif italic text-gold-300/80 text-sm mt-1"
          >
            Abriendo la carta...
          </motion.p>

          {/* Subtle Golden Loading Line */}
          <div className="relative z-10 w-36 h-[2px] bg-white/10 rounded-full mt-5 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvitationOpeningLoader;
