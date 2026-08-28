import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const songUrl = '/music/Rabito - Un Pacto Con Dios (Audio) - La Mezcla Cristiana (youtube).mp3';
  const TARGET_VOLUME = 0.30; // Max volume 30%
  const FADE_DURATION_MS = 15000; // 15 seconds fade-in
  const FADE_STEPS = 60; // 60 steps for silky smooth transition

  const startFadeIn = (audio: HTMLAudioElement) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    audio.volume = 0;
    const stepTime = FADE_DURATION_MS / FADE_STEPS;
    const volumeIncrement = TARGET_VOLUME / FADE_STEPS;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const newVol = Math.min(TARGET_VOLUME, currentStep * volumeIncrement);
      audio.volume = newVol;

      if (currentStep >= FADE_STEPS || audio.volume >= TARGET_VOLUME) {
        audio.volume = TARGET_VOLUME;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }
    }, stepTime);
  };

  useEffect(() => {
    const audio = new Audio(encodeURI(songUrl));
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;

    const playWithFade = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          startFadeIn(audioRef.current!);
        }).catch(() => {
          // Autoplay blocked by browser policy
        });
      }
    };

    const handleFirstTouch = () => {
      playWithFade();
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
    };

    window.addEventListener('click', handleFirstTouch, { once: true });
    window.addEventListener('touchstart', handleFirstTouch, { once: true });

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
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
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        startFadeIn(audioRef.current!);
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
      title={isPlaying ? 'Pausar música: Rabito - Un Pacto Con Dios' : 'Reproducir música (Volumen 30% con fade-in)'}
    >
      <Music className={`w-3.5 h-3.5 ${isPlaying ? 'text-gold-400 animate-spin' : 'text-white'}`} style={{ animationDuration: '6s' }} />
      <span className="hidden sm:inline">{isPlaying ? 'Un Pacto Con Dios' : 'Música'}</span>
      {isPlaying ? <Volume2 className="w-3.5 h-3.5 text-gold-400" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
    </button>
  );
};

export default MusicPlayer;
