import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { DataStore } from '../../lib/firebase';
import { AccessPasscode } from '../../types';

gsap.registerPlugin(useGSAP);

interface PasscodeGateProps {
  onSuccess: (isAdmin: boolean, passcode?: AccessPasscode) => void;
  initialStep?: 'intro' | 'passcode';
}

export const PasscodeGate: React.FC<PasscodeGateProps> = ({
  onSuccess,
  initialStep = 'intro',
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [step, setStep] = useState<'intro' | 'passcode'>(initialStep);

  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check URL query parameters for ?code=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code') || urlParams.get('clave');
    if (codeParam) {
      setCode(codeParam);
      setStep('passcode');
    }
  }, []);

  // GSAP Cinematic Entrance Timeline
  useGSAP(
    () => {
      if (step !== 'intro') return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        monogramRef.current,
        { scale: 0.6, opacity: 0, rotation: -20, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: 1.2 }
      )
        .fromTo(
          badgeRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          titleRef.current,
          { y: 25, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.0 },
          '-=0.5'
        )
        .fromTo(
          subtitleRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.6'
        )
        .fromTo(
          dateRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          buttonRef.current,
          { scale: 0.85, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
          '-=0.4'
        );
    },
    { scope: containerRef, dependencies: [step] }
  );

  const handleOpenIntro = () => {
    sound.playWaxSealBreak();
    setStep('passcode');
  };

  const handleGoBackToIntro = () => {
    sound.playClick();
    setError('');
    setStep('intro');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Por favor, introduce tu clave personal de acceso.');
      return;
    }

    setIsVerifying(true);
    setError('');
    sound.playClick();

    try {
      const result = await DataStore.validatePasscode(code);

      if (result.valid) {
        setIsUnlocked(true);
        sound.playCelebration();
        confetti({
          particleCount: 85,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#D4AF37', '#E6CA65', '#C5A059', '#FAF7F2'],
        });

        setTimeout(() => {
          onSuccess(result.isAdmin, result.passcode);
        }, 600);
      } else {
        setError('Clave no válida. Por favor, revisa el código de tu tarjeta de invitación.');
        setIsVerifying(false);
      }
    } catch {
      setError('Error al verificar. Intenta de nuevo.');
      setIsVerifying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white p-4 overflow-y-auto select-none"
    >
      {/* Background Subtle Caustic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-black/90 to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-auto text-center">
        <AnimatePresence mode="wait">
          {step === 'intro' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center py-4"
            >
              {/* Monogram Seal Medallion */}
              <div
                ref={monogramRef}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.25)] mx-auto mb-6 p-4"
              >
                <div
                  className="absolute inset-1.5 rounded-full border border-gold-400/40 border-dashed animate-spin"
                  style={{ animationDuration: '30s' }}
                />

                <div className="text-center text-white flex flex-col items-center">
                  <span className="font-instrument text-3xl sm:text-4xl font-bold text-gold-300 tracking-widest drop-shadow-md">
                    L & J
                  </span>
                  <Heart className="w-4 h-4 fill-gold-400 text-gold-400 mt-1" />
                </div>
              </div>

              {/* Badge */}
              <div ref={badgeRef}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 text-gold-300 text-[11px] tracking-[0.3em] uppercase font-serif mb-3 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
                  Nuestra Boda
                </span>
              </div>

              {/* Title in Instrument Serif */}
              <h1
                ref={titleRef}
                className="font-instrument text-6xl sm:text-7xl text-white font-normal tracking-tight mt-1 mb-2 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
              >
                Luz & Julio
              </h1>

              {/* Subtitle */}
              <p
                ref={subtitleRef}
                className="font-instrument italic text-white/80 text-xl sm:text-2xl max-w-sm mx-auto mb-2 font-light"
              >
                «Unidos por la gracia de Dios para siempre.»
              </p>

              {/* Date & Location */}
              <p
                ref={dateRef}
                className="text-xs uppercase tracking-[0.25em] text-gold-400/80 font-sans mb-8"
              >
                9 de Octubre de 2026 • Paraguay
              </p>

              {/* Interactive CTA */}
              <button
                ref={buttonRef}
                onClick={handleOpenIntro}
                className="inline-flex items-center justify-center gap-3 py-4 px-10 rounded-full bg-white hover:bg-gold-300 text-black font-serif font-bold text-base tracking-wider shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-black text-black" />
                <span>Abrir Invitación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="passcode"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black/90 rounded-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] p-6 sm:p-8 relative backdrop-blur-2xl"
            >
              {/* Back Button to Intro */}
              <button
                type="button"
                onClick={handleGoBackToIntro}
                className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mx-auto mb-4 mt-2 text-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <KeyRound className="w-6 h-6" />
              </div>

              <h2 className="font-instrument text-3xl sm:text-4xl text-white font-normal">
                Acceso a la Invitación
              </h2>
              <p className="font-serif italic text-gold-300 text-sm mt-1 mb-6">
                Boda de Luz & Julio
              </p>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold mb-2 text-left">
                    Ingresa tu clave personal de invitación
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setError('');
                      }}
                      placeholder="Escribe tu clave aquí"
                      autoFocus
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono text-center text-lg uppercase tracking-widest text-white placeholder:text-white/40 transition-all shadow-inner"
                    />
                    <Lock className="w-4 h-4 text-gold-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {error && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-roseDust-300 font-sans mt-2.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-roseDust-400 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !code.trim() || isUnlocked}
                  className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-base font-bold shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{isVerifying ? 'Verificando...' : isUnlocked ? '¡Acceso Concedido!' : 'Entrar a la Invitación'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PasscodeGate;
