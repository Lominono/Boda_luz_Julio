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
  HeartHandshake,
  MessageSquareHeart,
  ArrowDown,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { RsvpData, AccessPasscode } from '../../types';
import { DataStore } from '../../lib/firebase';

interface RsvpSectionProps {
  currentPasscode?: AccessPasscode;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ currentPasscode }) => {
  const [formData, setFormData] = useState<RsvpData>({
    fullName: '',
    phone: '',
    email: '',
    attending: 'yes',
    additionalGuestsCount: 0,
    totalAttendeesCount: 1,
    companionNames: [],
    dietaryRestrictions: [],
    dietaryOther: '',
    songRequest: '',
    loveMessage: '',
    passcodeUsed: currentPasscode?.code || 'LUZYJULIO',
    confirmedAt: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellationNotice, setCancellationNotice] = useState<{ isCancelled: boolean; reason?: string } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const savedRsvp = localStorage.getItem('wedding_rsvp_luz_julio_v2');
      if (savedRsvp) {
        try {
          const parsed = JSON.parse(savedRsvp);
          setFormData(parsed);

          // Check if admin cancelled this RSVP
          const cancellation = await DataStore.checkCancellation(parsed.phone || parsed.fullName);
          if (cancellation?.isCancelled) {
            setCancellationNotice(cancellation);
            setSubmitted(false);
          } else {
            setSubmitted(true);
          }
        } catch {
          // Ignore
        }
      } else if (currentPasscode?.guestName && currentPasscode.guestName !== 'Invitación General') {
        setFormData((prev) => ({ ...prev, fullName: currentPasscode.guestName }));
      }
    };

    checkStatus();
  }, [currentPasscode]);

  const handleDietaryToggle = (option: string) => {
    sound.playClick();
    setFormData((prev) => {
      const exists = prev.dietaryRestrictions.includes(option);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter((item) => item !== option)
          : [...prev.dietaryRestrictions, option],
      };
    });
  };

  const handleAdditionalGuestsChange = (count: number) => {
    sound.playClick();
    const currentNames = [...formData.companionNames];
    const newNames = Array.from({ length: count }, (_, i) => currentNames[i] || '');

    setFormData({
      ...formData,
      additionalGuestsCount: count,
      totalAttendeesCount: formData.attending === 'yes' ? 1 + count : 0,
      companionNames: newNames,
    });
  };

  const handleCompanionNameChange = (index: number, name: string) => {
    const updated = [...formData.companionNames];
    updated[index] = name;
    setFormData({ ...formData, companionNames: updated });
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
      companionNames: formData.companionNames.filter((n) => n.trim().length > 0),
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
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#E6CA65', '#CBDBCB', '#DEB3B3', '#FAF7F2'],
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
    <section id="rsvp" className="py-16 px-4 max-w-3xl mx-auto text-white">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-gold-300 text-xs tracking-widest uppercase font-serif mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Confirmación de Asistencia
        </motion.div>

        <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl text-white font-normal">
          Confirma tu Presencia
        </h2>
        <p className="font-serif italic text-white/70 text-base sm:text-lg mt-2 font-light">
          Por favor confirmar antes del <strong className="text-gold-300 font-semibold">15 de Septiembre de 2026</strong>
        </p>
        <div className="w-16 h-[1px] bg-white/20 mx-auto mt-4" />
      </div>

      {/* Notice if previous RSVP was cancelled by admin */}
      {cancellationNotice?.isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-3xl bg-[#1F1210] border border-roseDust-500/50 shadow-2xl text-white"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-roseDust-500/20 text-roseDust-300 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-lg font-bold text-roseDust-200">
                Tu confirmación anterior fue cancelada por los administradores
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

      <div className="bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-instrument text-3xl sm:text-4xl text-white font-normal mb-2">
                {formData.attending === 'yes' ? '¡Tu asistencia ha sido confirmada!' : 'Gracias por avisarnos'}
              </h3>

              <p className="font-sans text-white/70 text-sm max-w-md mx-auto mb-6 font-light leading-relaxed">
                {formData.attending === 'yes'
                  ? `Hemos registrado tu plaza para un total de ${1 + formData.additionalGuestsCount} persona(s). ¡Luz y Julio están muy felices de compartir este gran día contigo en Recepciones Luana!`
                  : 'Agradecemos que nos lo hayas comunicado. Te tendremos muy presentes en nuestras oraciones y corazón.'}
              </p>

              {/* Callout to leave a message in the guestbook */}
              <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-gold-400/25 to-gold-500/15 border border-gold-400/30 text-center">
                <p className="text-sm font-serif text-gold-200 font-bold mb-1 flex items-center justify-center gap-1.5">
                  <MessageSquareHeart className="w-4 h-4 text-gold-400" />
                  ¿Te gustaría dedicarle unas palabras a los novios?
                </p>
                <p className="text-xs text-white/70 font-sans mb-3">
                  Comparte tus bendiciones y felicitaciones en el Muro de Dedicatorias.
                </p>
                <button
                  type="button"
                  onClick={scrollToGuestbook}
                  className="inline-flex items-center gap-1.5 py-2 px-5 rounded-full bg-white hover:bg-gold-300 text-black text-xs font-serif font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <span>Ir al Muro de Dedicatorias</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 max-w-md mx-auto mt-4">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-serif text-sm transition-all cursor-pointer"
                >
                  Modificar datos de mi respuesta
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Attendance Toggle */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-3">
                  ¿Nos acompañarás en la boda? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFormData({
                        ...formData,
                        attending: 'yes',
                        totalAttendeesCount: 1 + formData.additionalGuestsCount,
                      });
                    }}
                    className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-serif text-base transition-all cursor-pointer ${
                      formData.attending === 'yes'
                        ? 'border-gold-400 bg-gold-400/20 text-gold-200 font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${formData.attending === 'yes' ? 'fill-gold-400 text-gold-400' : 'text-gray-500'}`} />
                    ¡Sí, asistiré con alegría!
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFormData({
                        ...formData,
                        attending: 'no',
                        totalAttendeesCount: 0,
                      });
                    }}
                    className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-serif text-base transition-all cursor-pointer ${
                      formData.attending === 'no'
                        ? 'border-roseDust-400 bg-roseDust-950/40 text-roseDust-300 font-bold shadow-[0_0_20px_rgba(217,165,159,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Con pena, no podré asistir
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2">
                  Tu Nombre y Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej: Laura Benítez"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-base"
                />
              </div>

              {/* Attending Specific Fields */}
              {formData.attending === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2">
                        Teléfono de Contacto
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+595 981 000 000"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-base"
                      />
                    </div>

                    {/* Additional Guests Selector */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold-400" />
                        Acompañantes adicionales contigo
                      </label>
                      <select
                        value={formData.additionalGuestsCount}
                        onChange={(e) => handleAdditionalGuestsChange(Number(e.target.value))}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#141210] border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white text-base cursor-pointer"
                      >
                        <option value={0}>0 adicionales (asisto solo yo)</option>
                        <option value={1}>+1 acompañante</option>
                        <option value={2}>+2 acompañantes</option>
                        <option value={3}>+3 acompañantes</option>
                        <option value={4}>+4 acompañantes</option>
                        <option value={5}>+5 acompañantes</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary Banner of attendees calculation */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/15 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-gold-400" />
                      <span className="text-xs font-serif text-white/90 font-bold">
                        Total de personas confirmadas:
                      </span>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-white text-black font-serif font-bold text-sm">
                      {1 + formData.additionalGuestsCount} {1 + formData.additionalGuestsCount === 1 ? 'persona' : 'personas'}
                    </span>
                  </div>

                  {/* Dynamic Companion Names Inputs */}
                  {formData.additionalGuestsCount > 0 && (
                    <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5 text-gold-400" />
                        Nombres de las personas adicionales que van contigo:
                      </label>

                      {Array.from({ length: formData.additionalGuestsCount }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-xs font-serif text-white/70 w-28 flex-shrink-0">
                            Acompañante {index + 1}:
                          </span>
                          <input
                            type="text"
                            required
                            value={formData.companionNames[index] || ''}
                            onChange={(e) => handleCompanionNameChange(index, e.target.value)}
                            placeholder={`Nombre y apellido del acompañante ${index + 1}`}
                            className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white text-sm placeholder:text-white/40"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dietary Requirements (Simplified to 2 options: Celíaco or Otra Alergia) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-gold-400" />
                      Requerimientos de Menú / Alergias (Opcional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {/* Option 1: Celíaco */}
                      <button
                        type="button"
                        onClick={() => handleDietaryToggle('Celíaco / Sin Gluten')}
                        className={`p-3 rounded-xl border text-left text-xs font-sans transition-all flex items-center gap-2 cursor-pointer ${
                          formData.dietaryRestrictions.includes('Celíaco / Sin Gluten')
                            ? 'bg-white text-black border-white font-bold shadow-md'
                            : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${formData.dietaryRestrictions.includes('Celíaco / Sin Gluten') ? 'bg-black border-black' : 'border-white/50'}`} />
                        <span>Celíaco / Sin Gluten</span>
                      </button>

                      {/* Option 2: Otra Alergia */}
                      <button
                        type="button"
                        onClick={() => handleDietaryToggle('Otra Alergia / Menú Especial')}
                        className={`p-3 rounded-xl border text-left text-xs font-sans transition-all flex items-center gap-2 cursor-pointer ${
                          formData.dietaryRestrictions.includes('Otra Alergia / Menú Especial')
                            ? 'bg-white text-black border-white font-bold shadow-md'
                            : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 ${formData.dietaryRestrictions.includes('Otra Alergia / Menú Especial') ? 'bg-black border-black' : 'border-white/50'}`} />
                        <span>Otra Alergia o Requerimiento</span>
                      </button>
                    </div>

                    {/* Especificar Alergia si se selecciona Otra */}
                    {formData.dietaryRestrictions.includes('Otra Alergia / Menú Especial') && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2.5"
                      >
                        <input
                          type="text"
                          value={formData.dietaryOther || ''}
                          onChange={(e) => setFormData({ ...formData, dietaryOther: e.target.value })}
                          placeholder="Especifica tu requerimiento (Ej: Lactosa, mariscos, vegetariano, etc.)"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Song Request */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-gold-400" />
                      ¿Qué canción te gustaría escuchar en la fiesta? (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.songRequest || ''}
                      onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                      placeholder="Título y artista"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-base"
                    />
                  </div>
                </motion.div>
              )}

              {/* Optional Love Message / Dedicatoria */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400/20" />
                    Dedicatoria o Mensaje Bonito para Luz y Julio (Opcional)
                  </span>
                  <span className="text-[11px] text-white/50 font-serif">
                    Opcional
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={formData.loveMessage || ''}
                  onChange={(e) => setFormData({ ...formData, loveMessage: e.target.value })}
                  placeholder="Escribe tus bendiciones, felicitaciones o un mensaje especial para los novios..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-base"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.fullName.trim()}
                  className="w-full py-4 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Asistencia'}
                  </span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RsvpSection;
