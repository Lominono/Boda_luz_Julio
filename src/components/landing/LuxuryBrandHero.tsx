import React, { useState, useEffect } from 'react';
import { Flower2, Heart, Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryBrandHeroProps {
  onOpenInvitation: () => void;
}

export const LuxuryBrandHero: React.FC<LuxuryBrandHeroProps> = ({
  onOpenInvitation,
}) => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (overlayOpen || showStoryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen, showStoryModal]);

  const handleSelectInicio = () => {
    setOverlayOpen(false);
    setShowStoryModal(false);
  };

  const handleSelectNuestraBoda = () => {
    setOverlayOpen(false);
    setShowStoryModal(true);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white select-none overflow-hidden font-sans">
      {/* Background Video (Persists across navbar, menu & hero) */}
      <div
        className={`absolute inset-0 transition-all duration-[1400ms] z-0 ${
          mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '300ms',
        }}
      >
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Subtle Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* NAVBAR (fixed) */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
          {/* Left — logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleSelectInicio(); }}
            className={`flex items-center gap-2 text-white text-xl md:text-2xl font-serif font-semibold tracking-wide z-50 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '0ms' : '0ms',
            }}
          >
            <span className="font-serif">Luz & Julio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          </a>

          {/* Center — desktop only (hidden md:flex) */}
          <button
            onClick={() => setOverlayOpen(!overlayOpen)}
            className={`hidden md:flex px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 items-center gap-2 z-50 cursor-pointer transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '200ms' : '0ms',
            }}
          >
            <span>{overlayOpen ? 'Cerrar' : 'Menú'}</span>
          </button>

          {/* Right — desktop only (hidden md:flex) */}
          <div
            className={`hidden md:flex items-center gap-3 z-50 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '400ms' : '0ms',
            }}
          >
            <span className="text-[11px] uppercase tracking-widest text-white/60 font-sans">
              Hecho por{' '}
              <a
                href="https://github.com/Lominono"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-300 hover:text-white underline underline-offset-2 transition-colors font-medium"
              >
                oreganos
              </a>
            </span>
            <Flower2 className="w-6 h-6 text-gold-400" />
          </div>

          {/* Right — mobile (md:hidden) Hamburger (3 lines) */}
          <button
            onClick={() => setOverlayOpen(!overlayOpen)}
            className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50 cursor-pointer transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '200ms' : '0ms',
            }}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-[2px] bg-white transition-transform duration-500 ${
                overlayOpen ? 'rotate-45 translate-y-[4px]' : ''
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
            />
            <span
              className={`w-6 h-[2px] bg-white transition-transform duration-500 ${
                overlayOpen ? '-rotate-45 -translate-y-[4px]' : ''
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
            />
          </button>
        </div>
      </nav>

      {/* FULL-SCREEN OVERLAY MENU (2 OPTIONS ONLY: INICIO & NUESTRA BODA) */}
      <div
        className={`fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-700 ${
          overlayOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      >
        <div className="flex flex-col items-center justify-center gap-9 text-center px-4">
          <span className="text-[11px] uppercase tracking-[0.35em] text-gold-400 font-serif">
            Menú de Navegación
          </span>

          {/* Option 1: INICIO */}
          <button
            onClick={handleSelectInicio}
            className="text-white font-instrument text-5xl sm:text-6xl md:text-7xl hover:text-gold-300 transition-all duration-500 cursor-pointer"
          >
            INICIO
          </button>

          {/* Option 2: NUESTRA BODA */}
          <button
            onClick={handleSelectNuestraBoda}
            className="text-white font-instrument text-5xl sm:text-6xl md:text-7xl hover:text-gold-300 transition-all duration-500 cursor-pointer"
          >
            NUESTRA BODA
          </button>

          {/* Credits in menu with GitHub link */}
          <div className="mt-12 pt-6 border-t border-white/15 flex flex-col items-center gap-1.5 text-white/60 text-xs font-sans font-light">
            <span>
              Diseñado & creado por{' '}
              <a
                href="https://github.com/Lominono"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-300 hover:text-white underline underline-offset-2 font-medium"
              >
                oreganos
              </a>
            </span>
            <span className="text-[10px] text-gold-400 tracking-wider">9 de Octubre de 2026 • Paraguay</span>
          </div>
        </div>
      </div>

      {/* NUESTRA BODA EXPLANATION MODAL (Shares the same Video Background) */}
      <AnimatePresence>
        {showStoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 select-none"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#12100E]/90 border border-white/20 rounded-3xl p-8 sm:p-10 text-center shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowStoryModal(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mx-auto mb-5 text-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
                <Heart className="w-6 h-6 fill-gold-400 text-gold-400" />
              </div>

              <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold-400 font-serif mb-2">
                Nuestra Boda
              </span>

              <h2 className="font-instrument text-3xl sm:text-4xl text-white font-normal mb-4 leading-tight">
                Luz & Julio
              </h2>

              <div className="space-y-3 font-serif text-white/80 text-base sm:text-lg leading-relaxed font-light mb-8">
                <p>
                  Esta es la carta de invitación digital a nuestra boda.
                </p>
                <p className="italic text-gold-200">
                  «Con la bendición de Dios, nos gustaría tenerte muy cerca en este día tan especial para celebrar y compartir juntos este hermoso momento de nuestras vidas.»
                </p>
                <p className="text-xs font-sans text-white/60 pt-1">
                  Viernes, 9 de Octubre de 2026 • Recepciones Luana Ko'ê Pyta, Paraguay
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowStoryModal(false);
                    onOpenInvitation();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-white hover:bg-gold-300 text-black font-serif font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all active:scale-95 cursor-pointer"
                >
                  <span>Abrir Carta de Invitación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowStoryModal(false)}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-serif text-sm transition-colors cursor-pointer"
                >
                  Volver
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO (full viewport) */}
      <section className="relative z-10 w-full h-screen overflow-hidden flex items-end justify-center">
        {/* Foreground (bottom-centered) */}
        <div className="text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
          {/* Subtle wedding badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-gold-300 text-xs uppercase tracking-[0.25em] font-serif mb-4 transition-all duration-900 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '300ms' : '0ms',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Nuestra Boda</span>
          </div>

          {/* H1 (Instrument Serif) */}
          <h1
            className={`font-instrument text-white text-[2.75rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-4 md:mb-5 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] transition-all duration-900 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '400ms' : '0ms',
            }}
          >
            Una historia de amor<br className="hidden sm:block" /> bendecida para siempre
          </h1>

          {/* Subcopy */}
          <p
            className={`text-white/80 text-base md:text-lg mb-6 md:mb-8 max-w-lg mx-auto font-sans font-light drop-shadow-md transition-all duration-900 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '600ms' : '0ms',
            }}
          >
            Viernes, 9 de Octubre de 2026 • Recepciones Luana Ko'ê Pyta, Paraguay.
          </p>

          {/* CTA */}
          <div
            className={`transition-all duration-900 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '800ms' : '0ms',
            }}
          >
            <button
              onClick={onOpenInvitation}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white hover:bg-gold-300 text-black text-sm md:text-base font-serif font-bold tracking-wide rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-black text-black" />
              <span>Abrir Invitación</span>
            </button>
          </div>

          {/* Footer credit badge on mobile with GitHub link */}
          <div
            className={`mt-6 text-[11px] text-white/60 uppercase tracking-widest font-sans transition-all duration-900 md:hidden ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '1000ms' : '0ms',
            }}
          >
            Hecho por{' '}
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-300 hover:text-white underline underline-offset-2 font-semibold"
            >
              oreganos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryBrandHero;
