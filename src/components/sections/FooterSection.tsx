import React from 'react';
import { Heart } from 'lucide-react';
import CalendarExport from './CalendarExport';

export const FooterSection: React.FC = () => {
  return (
    <footer className="pt-16 pb-28 px-4 text-center border-t border-white/10 bg-black/90 backdrop-blur-md text-white">
      <div className="max-w-md mx-auto">
        {/* Monogram without solid white box */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          <img
            src="/monograma-lj.png"
            alt="Monograma Luz y Julio"
            className="w-full h-full object-contain invert brightness-200"
          />
        </div>

        <p className="font-instrument text-4xl text-white mb-1 drop-shadow-md">
          Luz & Julio
        </p>

        <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-sans font-medium mb-6">
          9 de Octubre de 2026 • Recepciones Luana Ko'ê Pyta
        </p>

        <div className="my-6">
          <p className="text-xs font-sans text-white/80 mb-2">
            ¿Deseas guardar la fecha en tu calendario?
          </p>
          <CalendarExport />
        </div>

        <div className="w-12 h-[1px] bg-white/20 mx-auto my-6" />

        <p className="text-xs font-sans text-white/70 flex items-center justify-center gap-1.5 font-light mb-3">
          «Cordón de tres dobleces no se rompe pronto» • Eclesiastés 4:12 <Heart className="w-3.5 h-3.5 fill-roseDust-400 text-roseDust-400 inline" />
        </p>

        {/* Discreet Credits with GitHub Link */}
        <div className="pt-3 flex flex-col items-center">
          <div className="text-[11px] text-white/50 uppercase tracking-widest font-sans">
            Hecho por{' '}
            <a
              href="https://github.com/Lominono"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-300 hover:text-white underline underline-offset-2 font-semibold transition-colors"
            >
              oreganos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
