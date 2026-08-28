import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songUrl = '/music/Rabito - Un Pacto Con Dios (Audio) - La Mezcla Cristiana (youtube).mp3';

  useEffect(() => {
    const audio = new Audio(encodeURI(songUrl));
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Handle user interaction to auto-start if allowed
    const handleFirstTouch = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Browser prevented autoplay
        });
      }
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };

    window.addEventListener('click', handleFirstTouch, { once: true });
    window.addEventListener('touchstart', handleFirstTouch, { once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };
  }, []);

  const toggleMusic = () => {
    sound.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className={`fixed top-5 right-5 z-40 flex items-center gap-2 py-2 px-3.5 rounded-full border transition-all shadow-lg backdrop-blur-md text-xs font-serif cursor-pointer ${
        isPlaying
          ? 'bg-black/80 border-gold-400 text-gold-300 ring-1 ring-gold-400/50'
          : 'bg-black/60 border-white/20 text-white/80 hover:bg-black/90'
      }`}
      title={isPlaying ? 'Pausar música: Rabito - Un Pacto Con Dios' : 'Reproducir música: Rabito - Un Pacto Con Dios'}
    >
      <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-gold-400 animate-spin' : 'text-white'}`} style={{ animationDuration: '6s' }} />
      <span className="hidden sm:inline">{isPlaying ? 'Un Pacto Con Dios' : 'Música'}</span>
      {isPlaying ? <Volume2 className="w-3.5 h-3.5 text-gold-400" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
    </button>
  );
};

export default MusicPlayer;
