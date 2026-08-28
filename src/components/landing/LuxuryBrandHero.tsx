import React, { useState, useEffect } from 'react';
import { Flower2, Heart, Sparkles, Shield } from 'lucide-react';

interface LuxuryBrandHeroProps {
  onOpenInvitation: () => void;
  onOpenAdmin?: () => void;
}

export const LuxuryBrandHero: React.FC<LuxuryBrandHeroProps> = ({
  onOpenInvitation,
  onOpenAdmin,
}) => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

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
    if (overlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen]);

  const navLinks = [
    { label: 'Inicio', action: () => setOverlayOpen(false) },
    { label: 'Nuestra Boda', action: () => { setOverlayOpen(false); onOpenInvitation(); } },
    { label: 'Confirmar Asistencia', action: () => { setOverlayOpen(false); onOpenInvitation(); } },
    { label: 'Dedicatorias', action: () => { setOverlayOpen(false); onOpenInvitation(); } },
  ];

  return (
    <div className="relative w-full h-screen bg-black text-white select-none overflow-hidden font-sans">
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
            onClick={(e) => { e.preventDefault(); setOverlayOpen(false); }}
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
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-white/60 hover:text-gold-300 transition-colors font-sans"
              title="GitHub de oreganos"
            >
              Hecho por oreganos
            </a>
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

      {/* FULL-SCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-700 ${
          overlayOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      >
        <div className="flex flex-col items-center justify-center gap-7 text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-400 font-serif mb-2">
            Invitación de Boda
          </span>

          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                link.action();
              }}
              className={`text-white font-instrument text-4xl md:text-6xl hover:text-gold-300 transition-all duration-600 ${
                overlayOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
                transitionDelay: overlayOpen ? `${150 + index * 80}ms` : '0ms',
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Optional Admin Link */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                setOverlayOpen(false);
                onOpenAdmin();
              }}
              className="mt-2 text-xs uppercase tracking-widest text-white/40 hover:text-gold-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Panel de Control</span>
            </button>
          )}

          {/* Credits in menu with GitHub link */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-1 text-white/60 text-xs font-sans font-light">
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
            <span className="text-[10px] text-gold-400">9 de Octubre de 2026 • Paraguay</span>
          </div>
        </div>
      </div>

      {/* HERO (full viewport) */}
      <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
        {/* Background video */}
        <div
          className={`absolute inset-0 transition-all duration-[1400ms] ${
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
        </div>

        {/* Foreground (bottom-centered) */}
        <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
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

          {/* Footer credit badge on mobile */}
          <div
            className={`mt-6 text-[11px] text-white/50 uppercase tracking-widest font-sans transition-all duration-900 md:hidden ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '1000ms' : '0ms',
            }}
          >
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-300"
            >
              Hecho por oreganos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryBrandHero;
