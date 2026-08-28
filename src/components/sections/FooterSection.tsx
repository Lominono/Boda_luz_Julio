import React from 'react';
import { Heart } from 'lucide-react';
import CalendarExport from './CalendarExport';

export const FooterSection: React.FC = () => {
  return (
    <footer className="pt-16 pb-28 px-4 text-center border-t border-white/10 bg-black/90 backdrop-blur-md text-white">
      <div className="max-w-md mx-auto">
        {/* Monogram */}
        <div className="w-16 h-16 rounded-full border border-white/20 bg-white p-2.5 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] mx-auto mb-4">
          <img
            src="/monograma-lj.png"
            alt="Monograma Luz y Julio"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="font-instrument text-4xl text-white mb-1 drop-shadow-md">
          Luz & Julio
        </p>

        <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-sans font-medium mb-6">
          9 de Octubre de 2026 • Paraguay
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

        {/* Small Discreet Credits */}
        <div className="pt-2 text-[11px] text-white/40 uppercase tracking-widest font-sans">
          Diseñado & Creado con amor por <span className="text-white/70 font-semibold">JuanFe</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
