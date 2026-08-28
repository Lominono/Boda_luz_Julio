// Global Audio Controller with smooth fade-in and smooth fade-out
type AudioStateListener = (isPlaying: boolean, volume: number) => void;

class WeddingAudioController {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private fadeInterval: number | null = null;
  private listeners: Set<AudioStateListener> = new Set();

  private readonly songUrl = '/music/Rabito - Un Pacto Con Dios (Audio) - La Mezcla Cristiana (youtube).mp3';
  private readonly TARGET_VOLUME = 0.30;
  private readonly FADE_IN_DURATION_MS = 15000; // 15s fade-in
  private readonly FADE_OUT_DURATION_MS = 1200; // 1.2s smooth fade-out

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    const a = new Audio(encodeURI(this.songUrl));
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0;
    this.audio = a;

    // Auto-unlock audio upon first touch/click
    const handleFirstGesture = () => {
      if (this.audio && this.audio.paused && !this.isPlaying) {
        this.play();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.audio?.volume || 0);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const vol = this.audio?.volume || 0;
    this.listeners.forEach((fn) => fn(this.isPlaying, vol));
  }

  public play() {
    this.initAudio();
    if (!this.audio) return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
      this.startFadeIn();
    }).catch((err) => {
      console.warn('Audio play restricted:', err);
    });
  }

  public pause() {
    if (!this.audio) return;
    this.startFadeOut();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private startFadeIn() {
    if (!this.audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    this.audio.volume = 0;
    const steps = 60;
    const stepTime = this.FADE_IN_DURATION_MS / steps;
    const increment = this.TARGET_VOLUME / steps;
    let step = 0;

    this.fadeInterval = window.setInterval(() => {
      if (!this.audio) return;
      step++;
      const nextVol = Math.min(this.TARGET_VOLUME, step * increment);
      this.audio.volume = nextVol;
      this.notify();

      if (step >= steps || this.audio.volume >= this.TARGET_VOLUME) {
        this.audio.volume = this.TARGET_VOLUME;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.notify();
      }
    }, stepTime);
  }

  private startFadeOut() {
    if (!this.audio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVol = this.audio.volume;
    const steps = 24;
    const stepTime = this.FADE_OUT_DURATION_MS / steps;
    const decrement = startVol / steps;
    let step = 0;

    this.fadeInterval = window.setInterval(() => {
      if (!this.audio) return;
      step++;
      const nextVol = Math.max(0, startVol - step * decrement);
      this.audio.volume = nextVol;
      this.notify();

      if (step >= steps || this.audio.volume <= 0.001) {
        this.audio.volume = 0;
        this.audio.pause();
        this.isPlaying = false;
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.notify();
      }
    }, stepTime);
  }
}

export const weddingAudio = new WeddingAudioController();
