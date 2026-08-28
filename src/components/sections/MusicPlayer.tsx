import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
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
    <button
      onClick={handleToggle}
      className={`fixed top-5 right-5 z-40 flex items-center gap-2 py-2 px-3.5 rounded-full border transition-all shadow-lg backdrop-blur-md text-xs font-serif cursor-pointer active:scale-95 ${
        isPlaying
          ? 'bg-black/80 border-gold-400 text-gold-300 ring-1 ring-gold-400/50 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
          : 'bg-black/60 border-white/20 text-white/80 hover:bg-black/90'
      }`}
      title={isPlaying ? 'Pausar música con desvanecimiento suave' : 'Reproducir música (Rabito - Un Pacto Con Dios)'}
    >
      <Music
        className={`w-3.5 h-3.5 transition-transform ${isPlaying ? 'text-gold-400 animate-spin' : 'text-white'}`}
        style={{ animationDuration: '6s' }}
      />
      <span className="hidden sm:inline">{isPlaying ? 'Un Pacto Con Dios' : 'Música'}</span>
      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-gold-400" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-white/60" />
      )}
    </button>
  );
};

export default MusicPlayer;
