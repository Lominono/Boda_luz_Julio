import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Heart,
  Music,
  Utensils,
  Send,
  Users,
  UserPlus,
  MessageSquareHeart,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Minus,
  Plus,
  MapPin,
  Clock,
  Edit3,
  Wheat,
  Leaf,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { RsvpData, AccessPasscode } from '../../types';
import { DataStore, getUserDeviceId } from '../../lib/firebase';
import { openSmartCalendar, isAppleDevice, WEDDING_MAPS_URL } from '../../utils/calendar';

interface RsvpSectionProps {
  currentPasscode?: AccessPasscode;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ currentPasscode }) => {
  const currentDeviceId = getUserDeviceId();

  const [formData, setFormData] = useState<RsvpData>({
    fullName: '',
    phone: '',
    email: '',
    attending: 'yes',
    additionalGuestsCount: 0,
    totalAttendeesCount: 1,
    companionNames: [],
    dietaryRestrictions: ['Menú Tradicional'],
    dietaryOther: '',
    songRequest: '',
    loveMessage: '',
    passcodeUsed: currentPasscode?.code || 'LUZYJULIO',
    confirmedAt: '',
    userDeviceId: currentDeviceId,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellationNotice, setCancellationNotice] = useState<{ isCancelled: boolean; reason?: string } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      let activeRsvp: RsvpData | null = null;
      const savedRsvp = localStorage.getItem('wedding_rsvp_luz_julio_v2');

      if (savedRsvp) {
        try {
          activeRsvp = JSON.parse(savedRsvp);
        } catch {
          // Ignore
        }
      }

      // If not in local storage, check in DataStore by userDeviceId
      if (!activeRsvp) {
        activeRsvp = await DataStore.getRsvpByUserDevice(currentDeviceId);
      }

      if (activeRsvp) {
        setFormData({ ...activeRsvp, userDeviceId: currentDeviceId });

        // Check if admin cancelled this RSVP
        const cancellation = await DataStore.checkCancellation(
          activeRsvp.phone || activeRsvp.fullName || currentDeviceId
        );
        if (cancellation?.isCancelled) {
          setCancellationNotice(cancellation);
          setSubmitted(false);
        } else {
          setSubmitted(true);
        }
      } else if (currentPasscode?.guestName && currentPasscode.guestName !== 'Invitación General') {
        setFormData((prev) => ({ ...prev, fullName: currentPasscode.guestName }));
      }
    };

    checkStatus();
  }, [currentPasscode, currentDeviceId]);

  // Dietary options handler
  const handleDietaryToggle = (option: string) => {
    sound.playClick();
    setFormData((prev) => {
      let updated: string[];
      if (option === 'Menú Tradicional') {
        updated = ['Menú Tradicional'];
      } else {
        const withoutDefault = prev.dietaryRestrictions.filter((i) => i !== 'Menú Tradicional');
        if (withoutDefault.includes(option)) {
          updated = withoutDefault.filter((i) => i !== option);
          if (updated.length === 0) updated = ['Menú Tradicional'];
        } else {
          updated = [...withoutDefault, option];
        }
      }
      return { ...prev, dietaryRestrictions: updated };
    });
  };

  // Stepper / counter for companions
  const updateGuestsCount = (newCount: number) => {
    if (newCount < 0 || newCount > 5) return;
    sound.playClick();
    const currentNames = [...formData.companionNames];
    const newNames = Array.from({ length: newCount }, (_, i) => currentNames[i] || '');

    setFormData((prev) => ({
      ...prev,
      additionalGuestsCount: newCount,
      totalAttendeesCount: prev.attending === 'yes' ? 1 + newCount : 0,
      companionNames: newNames,
    }));
  };

  const handleCompanionNameChange = (index: number, name: string) => {
    const updated = [...formData.companionNames];
    updated[index] = name;
    setFormData((prev) => ({ ...prev, companionNames: updated }));
  };

  const handleResetForResubmit = () => {
    sound.playClick();
    if (formData.phone || formData.fullName) {
      DataStore.clearCancellation(formData.phone || formData.fullName);
    }
    setCancellationNotice(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    setIsSubmitting(true);
    sound.playClick();

    const rsvpToSave: RsvpData = {
      ...formData,
      totalAttendeesCount: formData.attending === 'yes' ? 1 + formData.additionalGuestsCount : 0,
      companionNames: formData.attending === 'yes' ? formData.companionNames.filter((n) => n.trim().length > 0) : [],
      confirmedAt: new Date().toISOString(),
    };

    try {
      await DataStore.saveRsvp(rsvpToSave);
      localStorage.setItem('wedding_rsvp_luz_julio_v2', JSON.stringify(rsvpToSave));
      setCancellationNotice(null);
      setSubmitted(true);
      setIsSubmitting(false);

      sound.playCelebration();
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C378', '#FAF7F2', '#D9A59F', '#C5A059'],
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  const scrollToGuestbook = () => {
    sound.playClick();
    const elem = document.getElementById('dedicatorias');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="rsvp" className="py-20 px-4 max-w-3xl mx-auto text-white">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-gold-400/30 text-gold-300 text-xs tracking-widest uppercase font-serif mb-3 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          R.S.V.P. Oficial
        </motion.div>

        <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight">
          Confirma tu Asistencia
        </h2>
        <p className="font-serif italic text-white/70 text-base sm:text-lg mt-2 font-light">
          Agradecemos tu confirmación antes del <strong className="text-gold-300 font-semibold">15 de Septiembre de 2026</strong>
        </p>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mx-auto mt-4" />
      </div>

      {/* Notice if previous RSVP was cancelled by admin */}
      {cancellationNotice?.isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-3xl bg-[#1C1210] border border-roseDust-500/50 shadow-2xl text-white"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-roseDust-500/20 text-roseDust-300 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-lg font-bold text-roseDust-200">
                Tu confirmación previa fue cancelada por la administración
              </h4>
              <p className="text-xs sm:text-sm text-white/80 font-sans mt-1">
                <strong>Motivo indicado:</strong> «{cancellationNotice.reason || 'Sin motivo especificado'}»
              </p>
              <p className="text-xs text-white/60 font-sans mt-2">
                Si deseas actualizar tus datos, corregir información o volver a confirmar, puedes completar el formulario nuevamente a continuación.
              </p>
              <button
                type="button"
                onClick={handleResetForResubmit}
                className="mt-4 inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white hover:bg-gold-300 text-black text-xs font-serif font-bold transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a enviar confirmación</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Form Card: Handcrafted luxury editorial paper style */}
      <div className="relative rounded-3xl bg-[#12100E] border border-gold-400/25 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] p-6 sm:p-10 md:p-12 overflow-hidden">
        {/* Subtle decorative gold ambient glow inside card */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {submitted ? (
            /* SUCCESS CARD / TICKET DE CONFIRMACIÓN */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-4 text-center relative z-10"
            >
              {/* Monogram crest */}
              <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-400/40 text-gold-300 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-gold-300" />
              </div>

              <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-sans font-semibold">
                Registro Completado
              </span>

              <h3 className="font-instrument text-3xl sm:text-4xl text-white font-normal mt-1 mb-3">
                {formData.attending === 'yes' ? '¡Tu plaza ha sido confirmada!' : 'Agradecemos tu respuesta'}
              </h3>

              <p className="font-serif text-white/80 text-base max-w-lg mx-auto leading-relaxed font-light">
                {formData.attending === 'yes' ? (
                  <>
                    Estimado/a <strong className="text-gold-200 font-semibold">{formData.fullName}</strong>, Luz & Julio están emocionados de contar con tu presencia para celebrar este gran día.
                  </>
                ) : (
                  <>
                    Estimado/a <strong className="text-gold-200 font-semibold">{formData.fullName}</strong>, lamentamos que no puedas acompañarnos, pero valoramos profundamente que nos lo hayas comunicado.
                  </>
                )}
              </p>

              {/* Reservation summary ticket for attendees */}
              {formData.attending === 'yes' && (
                <div className="my-8 max-w-md mx-auto p-5 rounded-2xl bg-black/50 border border-gold-400/30 text-left shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-gold-400 font-sans font-semibold">
                      Detalle de Reserva
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-300 text-[11px] font-bold">
                      {1 + formData.additionalGuestsCount} {1 + formData.additionalGuestsCount === 1 ? 'Persona' : 'Personas'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-white/80 font-sans">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>Viernes, 9 de Octubre de 2026 • 11:30 AM (Puntual)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>Recepciones Luana — Ko'ê Pyta</span>
                    </div>
                    {formData.companionNames && formData.companionNames.length > 0 && (
                      <div className="pt-2 border-t border-white/10 text-white/70">
                        <span className="text-gold-300 font-medium">Acompañantes: </span>
                        {formData.companionNames.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons: Smart Calendar (Apple on iOS / Google on Android) & Maps */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mt-6">
                {formData.attending === 'yes' && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      openSmartCalendar();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-gold-600" />
                    <span>
                      {isAppleDevice() ? 'Añadir a Apple Calendar (.ics)' : 'Añadir a Google Calendar'}
                    </span>
                  </button>
                )}

                <a
                  href={WEDDING_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-serif text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>Ver Lugar en Maps</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              </div>

              {/* Dedicatorias invite */}
              <div className="mt-8 pt-6 border-t border-white/10 max-w-md mx-auto flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={scrollToGuestbook}
                  className="text-xs text-gold-300 hover:text-white underline font-serif flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  <span>Dejar dedicatoria en el muro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Modificar datos</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* FORMULARIO EDITORIAL INTUITIVO */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 relative z-10"
            >
              {/* PASO 1: ¿Asistirás? (Botones grandes y táctiles de alta papelería) */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold mb-3">
                  1. ¿Nos acompañarás en este día tan especial? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFormData((prev) => ({
                        ...prev,
                        attending: 'yes',
                        totalAttendeesCount: 1 + prev.additionalGuestsCount,
                      }));
                    }}
                    className={`min-h-[56px] p-4 rounded-2xl border flex items-center justify-center gap-3 font-serif text-base transition-all cursor-pointer ${
                      formData.attending === 'yes'
                        ? 'border-gold-400 bg-gold-400/20 text-gold-200 font-bold shadow-[0_0_25px_rgba(212,175,55,0.25)] ring-1 ring-gold-400/50'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${formData.attending === 'yes' ? 'fill-gold-400 text-gold-400' : 'text-white/40'}`} />
                    <span>¡Sí, asistiré con alegría!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFormData((prev) => ({
                        ...prev,
                        attending: 'no',
                        totalAttendeesCount: 0,
                      }));
                    }}
                    className={`min-h-[56px] p-4 rounded-2xl border flex items-center justify-center gap-3 font-serif text-base transition-all cursor-pointer ${
                      formData.attending === 'no'
                        ? 'border-roseDust-400 bg-roseDust-950/40 text-roseDust-200 font-bold shadow-[0_0_25px_rgba(217,165,159,0.25)] ring-1 ring-roseDust-400/50'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span>Con el corazón, no podré</span>
                  </button>
                </div>
              </div>

              {/* PASO 2: Datos Personales */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold mb-2">
                    2. Tu Nombre y Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Escribe tu nombre y apellidos"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400/80 font-serif text-white placeholder:text-white/30 text-base transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold mb-2 flex items-center justify-between">
                    <span>Teléfono móvil / WhatsApp</span>
                    <span className="text-[11px] text-white/40 font-normal lowercase font-sans">
                      (para avisos de mesa y ubicación)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej: 0981 123 456"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400/80 font-serif text-white placeholder:text-white/30 text-base transition-all"
                  />
                </div>
              </div>

              {/* SI ASISTE: SELECTOR TÁCTIL DE PLAZAS Y DETALLES */}
              {formData.attending === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-8 pt-2"
                >
                  {/* Selector Táctil Editorial de Plazas (Anti-IA: sin select box corporativo) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold-400" />
                        3. Total de personas que asistirán contigo
                      </label>
                      <span className="text-xs font-serif text-gold-200 font-bold bg-gold-400/10 px-2.5 py-0.5 rounded-full border border-gold-400/30">
                        {1 + formData.additionalGuestsCount} {1 + formData.additionalGuestsCount === 1 ? 'plaza en total' : 'plazas en total'}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 font-sans mb-3">
                      Selecciona si vendrás solo/a o cuántos acompañantes van contigo:
                    </p>

                    {/* Quick selection pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { count: 0, label: 'Solo yo (1)' },
                        { count: 1, label: '+1 Acompañante' },
                        { count: 2, label: '+2 Acompañantes' },
                        { count: 3, label: '+3 Acompañantes' },
                        { count: 4, label: '+4 Acompañantes' },
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => updateGuestsCount(item.count)}
                          className={`min-h-[48px] px-3 py-2.5 rounded-xl border text-xs font-serif transition-all cursor-pointer flex flex-col items-center justify-center ${
                            formData.additionalGuestsCount === item.count
                              ? 'bg-gold-400/25 border-gold-400 text-gold-200 font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Stepper tactile controls */}
                    <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10">
                      <span className="text-xs text-white/70 font-sans">
                        Ajustar número exacto de plazas:
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateGuestsCount(formData.additionalGuestsCount - 1)}
                          disabled={formData.additionalGuestsCount <= 0}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                          title="Menos plazas"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="font-instrument text-2xl font-bold text-white min-w-[28px] text-center">
                          {1 + formData.additionalGuestsCount}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateGuestsCount(formData.additionalGuestsCount + 1)}
                          disabled={formData.additionalGuestsCount >= 5}
                          className="w-8 h-8 rounded-full bg-gold-400/20 hover:bg-gold-400/30 border border-gold-400/40 flex items-center justify-center text-gold-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                          title="Más plazas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Companion Names Inputs */}
                  {formData.additionalGuestsCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 p-5 rounded-2xl bg-black/40 border border-gold-400/20 shadow-inner"
                    >
                      <label className="block text-xs uppercase tracking-[0.15em] text-gold-300 font-sans font-semibold flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5 text-gold-400" />
                        Nombres de tus acompañantes (para preparar su lugar en la mesa):
                      </label>

                      {Array.from({ length: formData.additionalGuestsCount }).map((_, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-xs font-serif text-gold-200/90 sm:w-32 shrink-0 font-medium">
                            Acompañante {index + 1}:
                          </span>
                          <input
                            type="text"
                            required
                            value={formData.companionNames[index] || ''}
                            onChange={(e) => handleCompanionNameChange(index, e.target.value)}
                            placeholder={`Nombre completo del acompañante ${index + 1}`}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white text-sm placeholder:text-white/30"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* 4. Preferencias de Menú / Alergias */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold mb-2 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-gold-400" />
                      4. Preferencias de Menú o Alergias
                    </label>
                    <p className="text-xs text-white/60 font-sans mb-3">
                      Selecciona si tú o alguno de tus acompañantes requiere atención especial:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'Menú Tradicional', label: 'Menú General', icon: Utensils },
                        { id: 'Celíaco / Sin Gluten', label: 'Celíaco (Sin TACC)', icon: Wheat },
                        { id: 'Vegetariano', label: 'Vegetariano', icon: Leaf },
                        { id: 'Otra Alergia', label: 'Otra Alergia', icon: AlertCircle },
                      ].map((diet) => {
                        const isSelected = formData.dietaryRestrictions.includes(diet.id);
                        const IconComponent = diet.icon;
                        return (
                          <button
                            key={diet.id}
                            type="button"
                            onClick={() => handleDietaryToggle(diet.id)}
                            className={`min-h-[50px] p-3 rounded-xl border text-xs font-serif transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black border-white font-bold shadow-md'
                                : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/10'
                            }`}
                          >
                            <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-black' : 'text-gold-400'}`} />
                            <span>{diet.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {formData.dietaryRestrictions.includes('Otra Alergia') && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          value={formData.dietaryOther || ''}
                          onChange={(e) => setFormData({ ...formData, dietaryOther: e.target.value })}
                          placeholder="Indica qué alergia o requerimiento especial tienen..."
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/30 text-sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* 5. Canción para la fiesta */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-gold-400" />
                        5. ¿Qué canción te pondría a bailar sí o sí?
                      </span>
                      <span className="text-[11px] text-white/40 font-serif">Opcional</span>
                    </label>
                    <input
                      type="text"
                      value={formData.songRequest || ''}
                      onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                      placeholder="Título de la canción o artista favorito..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/30 text-base"
                    />
                  </div>
                </motion.div>
              )}

              {/* Dedicatoria para Luz & Julio (Disponible tanto si asiste como si no asiste) */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-gold-300 font-sans font-semibold mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400/20" />
                    {formData.attending === 'yes'
                      ? 'Dedicatoria para los novios (Opcional)'
                      : 'Mensaje de felicitaciones y bendiciones para los novios'}
                  </span>
                  <span className="text-[11px] text-white/40 font-serif">
                    {formData.attending === 'yes' ? 'Opcional' : 'Cariño sincero'}
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={formData.loveMessage || ''}
                  onChange={(e) => setFormData({ ...formData, loveMessage: e.target.value })}
                  placeholder={
                    formData.attending === 'yes'
                      ? 'Escribe tus bendiciones y mejores deseos para Luz & Julio...'
                      : 'Déjale unas palabras bonitas a los novios para acompañarlos de corazón...'
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/30 text-base"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.fullName.trim()}
                  className="w-full min-h-[56px] py-4 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-base sm:text-lg font-bold shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all disabled:opacity-40 cursor-pointer active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {isSubmitting
                      ? 'Enviando...'
                      : formData.attending === 'yes'
                      ? 'Confirmar mi Asistencia'
                      : 'Enviar mi Mensaje a los Novios'}
                  </span>
                </button>
                <p className="text-[11px] text-center text-white/40 font-sans mt-3">
                  Tus datos se guardarán de forma segura en la base de datos oficial del evento.
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RsvpSection;
