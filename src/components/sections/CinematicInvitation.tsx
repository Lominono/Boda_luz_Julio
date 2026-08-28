import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Navigation,
  BookOpen,
  RefreshCw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { getRandomVerse } from '../../data/biblicalVerses';
import { sound } from '../../utils/soundEffects';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CinematicInvitation: React.FC = () => {
  // Wedding Date: 9 de Octubre 2026, 11:30 AM (Paraguay Time)
  const targetDate = new Date('2026-10-09T11:30:00').getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [currentVerse, setCurrentVerse] = useState(() => getRandomVerse());
  const [isChangingVerse, setIsChangingVerse] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleNextVerse = () => {
    sound.playClick();
    setIsChangingVerse(true);
    setTimeout(() => {
      setCurrentVerse(getRandomVerse(currentVerse.id));
      setIsChangingVerse(false);
    }, 200);
  };

  const scrollToRsvp = () => {
    sound.playClick();
    const elem = document.getElementById('rsvp');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen px-4 pt-12 pb-20 max-w-5xl mx-auto flex flex-col items-center select-none text-[#F7F4EE]">
      {/* Top Monogram */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-4"
      >
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-white p-2.5 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] mx-auto">
          <img
            src="/monograma-lj.png"
            alt="Monograma Luz y Julio"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400 font-sans mt-2 font-medium">
          Nuestra Unión Matrimonial
        </p>
      </motion.div>

      {/* Main Names with Instrument Serif Typography */}
      <div className="my-2 text-center">
        <h1 className="font-instrument text-6xl sm:text-8xl md:text-9xl text-white tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          Luz <span className="font-script text-gold-400 text-5xl sm:text-7xl md:text-8xl">&</span> Julio
        </h1>
      </div>

      <p className="font-instrument italic text-white/90 text-xl md:text-2xl text-center max-w-xl mx-auto my-3 leading-relaxed font-light">
        «Con la bendición de Dios y la alegría de nuestros corazones, tenemos el honor de invitarte a celebrar nuestra boda.»
      </p>

      {/* Creative Cutout Presentation of the Couple */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-10 w-full max-w-md mx-auto flex flex-col items-center"
      >
        {/* Soft Golden Aura Backlight */}
        <div className="absolute inset-0 max-w-xs mx-auto h-80 rounded-full bg-gradient-to-b from-gold-400/25 via-gold-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Ambient Halo Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-gold-400/30 border-dashed pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />

        {/* Transparent Couple Cutout */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-64 sm:w-72 md:w-80 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
        >
          <img
            src="/novios-cutout.png"
            alt="Luz y Julio"
            className="w-full h-auto object-contain pointer-events-none"
          />
        </motion.div>

        {/* Romantic Base Caption */}
        <div className="relative z-10 -mt-4 text-center px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
          <p className="font-instrument text-2xl sm:text-3xl text-gold-200">
            Luz & Julio
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/80 font-sans font-light">
            Por Siempre Juntos • 2026
          </p>
        </div>
      </motion.div>

      {/* Direct Event Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-2xl bg-black/75 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-center my-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {/* Date */}
          <div className="flex flex-col items-center justify-center p-2">
            <div className="p-2.5 rounded-full bg-white/5 text-gold-400 mb-2 border border-white/10">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 font-sans font-semibold">
              Fecha
            </span>
            <span className="font-instrument text-2xl font-bold text-white mt-0.5">
              9 de Octubre
            </span>
            <span className="text-xs text-white/60 font-sans">
              Viernes, 2026
            </span>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center justify-center p-2">
            <div className="p-2.5 rounded-full bg-white/5 text-gold-400 mb-2 border border-white/10">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 font-sans font-semibold">
              Hora
            </span>
            <span className="font-instrument text-2xl font-bold text-white mt-0.5">
              11:30 AM
            </span>
            <span className="text-xs text-white/60 font-sans">
              Puntual
            </span>
          </div>

          {/* Venue */}
          <div className="flex flex-col items-center justify-center p-2">
            <div className="p-2.5 rounded-full bg-white/5 text-gold-400 mb-2 border border-white/10">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 font-sans font-semibold">
              Lugar
            </span>
            <span className="font-instrument text-xl font-bold text-white mt-0.5 leading-snug">
              Recepciones Luana
            </span>
            <span className="text-xs text-gold-400 font-sans font-medium">
              Ko'ê Pyta, Paraguay
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Recepciones+Luana+Koe+Pyta+Paraguay"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-95 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Abrir Ubicación en Google Maps</span>
          </a>

          <button
            onClick={scrollToRsvp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-serif font-semibold text-sm transition-all active:scale-95 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-gold-400 fill-gold-400/20" />
            <span>Confirmar Asistencia</span>
          </button>
        </div>
      </motion.div>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full max-w-md my-4 text-center"
      >
        <p className="text-xs uppercase tracking-[0.25em] text-gold-400 font-sans font-semibold mb-3">
          Tiempo Restante para el Gran Día
        </p>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Horas', value: timeLeft.hours },
            { label: 'Minutos', value: timeLeft.minutes },
            { label: 'Segundos', value: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-md flex flex-col items-center"
            >
              <span className="font-instrument text-3xl sm:text-4xl font-bold text-white">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 mt-0.5 font-sans">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Inspiring Biblical Verse Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full max-w-2xl bg-black/60 backdrop-blur-md rounded-3xl border border-white/15 p-6 sm:p-8 text-center my-4 shadow-sm"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-gold-300 text-[11px] tracking-widest uppercase font-serif mb-3">
          <BookOpen className="w-3.5 h-3.5 text-gold-400" />
          Palabra de Bendición
        </div>

        <div className="min-h-[110px] flex flex-col items-center justify-center my-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVerse.id}
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <p className="font-instrument italic text-white/90 text-lg sm:text-xl leading-relaxed font-light">
                «{currentVerse.text}»
              </p>
              <p className="font-serif font-bold text-gold-400 text-sm">
                — {currentVerse.reference}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNextVerse}
          disabled={isChangingVerse}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-serif text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${isChangingVerse ? 'animate-spin' : ''}`} />
          Leer otro versículo bíblico
        </button>
      </motion.div>

      {/* RSVP Deadline Callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="w-full max-w-lg mt-6 p-5 rounded-3xl bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 border border-gold-400/40 text-center shadow-[0_0_30px_rgba(212,175,55,0.2)] backdrop-blur-md"
      >
        <div className="flex items-center justify-center gap-2 text-gold-200 font-instrument font-bold text-lg sm:text-xl">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Confirmar asistencia antes del 15 de Septiembre</span>
        </div>
        <p className="text-xs text-white/70 font-sans mt-1">
          Tu confirmación nos ayuda a preparar cada momento con cariño
        </p>

        <button
          onClick={scrollToRsvp}
          className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold-300 font-sans font-bold hover:text-white cursor-pointer"
        >
          <span>Ir al formulario de confirmación</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
};

export default CinematicInvitation;
