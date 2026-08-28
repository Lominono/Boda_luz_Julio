import React, { useState } from 'react';
import { HeartHandshake, MessageSquareHeart, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface FloatingNavProps {
  onBackToCover?: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onBackToCover }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const scrollTo = (id: string) => {
    sound.playClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm bg-[#14110E]/95 backdrop-blur-xl rounded-full border border-gold-400/40 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(212,175,55,0.2)] py-2 px-3 flex items-center justify-around text-[#FAF7F2]">
      {/* Step Back to Cover */}
      {onBackToCover && (
        <button
          onClick={() => {
            sound.playClick();
            onBackToCover();
          }}
          className="flex flex-col items-center gap-0.5 text-gold-300 hover:text-gold-200 transition-colors p-1 cursor-pointer"
          title="Volver a la portada de entrada"
        >
          <ArrowLeft className="w-4 h-4 text-gold-400" />
          <span className="text-[10px] font-serif uppercase tracking-wider">Portada</span>
        </button>
      )}

      {/* Main RSVP action button */}
      <button
        onClick={() => scrollTo('rsvp')}
        className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 font-serif text-xs font-bold shadow-md transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <HeartHandshake className="w-4 h-4" />
        <span>Confirmar</span>
      </button>

      <button
        onClick={() => scrollTo('dedicatorias')}
        className="flex flex-col items-center gap-0.5 text-gold-300 hover:text-gold-200 transition-colors p-1 cursor-pointer"
        title="Dedicatorias"
      >
        <MessageSquareHeart className="w-4 h-4 text-gold-400" />
        <span className="text-[10px] font-serif uppercase tracking-wider">Mensajes</span>
      </button>

      <button
        onClick={handleToggleSound}
        className="flex flex-col items-center gap-0.5 text-gold-300 hover:text-gold-200 transition-colors p-1 cursor-pointer"
        title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos de sonido'}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-gold-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-gray-500" />
        )}
        <span className="text-[10px] font-serif uppercase tracking-wider">
          {soundEnabled ? 'Sonido' : 'Mudo'}
        </span>
      </button>
    </nav>
  );
};

export default FloatingNav;
