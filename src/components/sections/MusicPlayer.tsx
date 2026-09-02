import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { weddingAudio } from '../../utils/audioController';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(weddingAudio.getIsPlaying());

  useEffect(() => {
    const unsubscribe = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    sound.playClick();
    weddingAudio.toggle();
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={{ scale: 0.92 }}
      className={`fixed top-5 right-5 z-40 flex items-center gap-2.5 py-2 px-4 rounded-full border transition-all duration-300 shadow-xl backdrop-blur-xl text-xs font-serif cursor-pointer ${
        isPlaying
          ? 'bg-black/85 border-gold-400/70 text-gold-200 ring-2 ring-gold-400/30 shadow-[0_0_25px_rgba(212,175,55,0.35)]'
          : 'bg-black/70 border-white/20 text-white/60 hover:border-white/40 hover:text-white hover:bg-black/85 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
      }`}
      title={isPlaying ? 'Silenciar música' : 'Reproducir música (Rabito - Un Pacto Con Dios)'}
      aria-label={isPlaying ? 'Silenciar música' : 'Reproducir música'}
    >
      {/* Equalizer / Audio Waves Visualizer */}
      <div className="flex items-center gap-[2.5px] h-3.5 w-4 justify-center">
        {isPlaying ? (
          <>
            <motion.span
              animate={{ scaleY: [0.3, 1, 0.4, 0.9, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              className="w-[2.5px] h-full bg-gold-400 rounded-full origin-bottom"
            />
            <motion.span
              animate={{ scaleY: [0.9, 0.3, 1, 0.5, 0.9] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              className="w-[2.5px] h-full bg-gold-300 rounded-full origin-bottom"
            />
            <motion.span
              animate={{ scaleY: [0.4, 0.85, 0.2, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              className="w-[2.5px] h-full bg-gold-400 rounded-full origin-bottom"
            />
          </>
        ) : (
          <div className="flex items-center gap-[2px]">
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        )}
      </div>

      {/* Label with Instant Status Confirmation */}
      <span className="hidden sm:inline font-sans text-[11px] font-medium tracking-wide transition-colors">
        {isPlaying ? 'Un Pacto Con Dios' : 'Música en pausa'}
      </span>

      {/* Instant State Icon with Clear Indicator */}
      <div className="flex items-center justify-center">
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-roseDust-300" />
        )}
      </div>
    </motion.button>
  );
};

export default MusicPlayer;
