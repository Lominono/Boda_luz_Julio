import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsVerifying(true);
    setError('');

    // Master Admin Password: f32ZSJNr
    if (password.trim() === 'f32ZSJNr') {
      sound.playCelebration();
      sessionStorage.setItem('wedding_admin_session_auth', 'true');
      onSuccess();
    } else {
      setTimeout(() => {
        setError('Contraseña incorrecta. Por favor verifica mayúsculas y minúsculas.');
        setIsVerifying(false);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white p-4 select-none overflow-hidden font-sans">
      {/* Background Visual Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1C1814] via-[#0D0B09] to-black pointer-events-none" />
      
      {/* Ambient Gold Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-400/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Editorial Watermark Image in Background */}
      <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 opacity-15 pointer-events-none flex items-center justify-center overflow-hidden">
        <img
          src="/wedding-rings.png"
          alt="Alianzas de Boda"
          className="w-full h-full object-contain filter grayscale contrast-125 translate-x-12 scale-110"
        />
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg bg-[#14110E]/90 border border-white/15 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gold-400/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-gold-400/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-gold-400/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gold-400/40 rounded-br-lg pointer-events-none" />

        {/* Back Button */}
        <button
          onClick={() => {
            sound.playClick();
            onCancel();
          }}
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="font-serif">Volver</span>
        </button>

        {/* Monogram Badge */}
        <div className="text-center pt-3 sm:pt-0">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400/20 via-white/5 to-transparent border border-gold-400/40 mx-auto mb-4 shadow-[0_0_35px_rgba(212,175,55,0.2)] p-2"
          >
            <img
              src="/monograma-lj.png"
              alt="Luz & Julio"
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
            />
          </motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-gold-300 text-[10px] tracking-[0.25em] uppercase font-sans font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-gold-400" />
            Acceso Exclusivo • Novios & Admin
          </div>

          <h2 className="font-instrument text-3xl sm:text-4xl text-white font-normal leading-tight">
            Panel de Administración
          </h2>
          <p className="font-serif italic text-white/60 text-sm mt-1 mb-7">
            Luz & Julio • Control de Asistencia & Mural
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2">
              Clave de Seguridad
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Ingresa la clave maestra"
                autoFocus
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-black/60 border border-white/20 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/40 font-mono text-center text-lg text-white placeholder:text-white/30 tracking-wider transition-all shadow-inner"
              />
              <Lock className="w-4 h-4 text-gold-400/80 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowPassword(!showPassword);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-xs text-roseDust-300 font-sans mt-3 text-center bg-roseDust-950/70 border border-roseDust-500/40 py-2 px-4 rounded-xl"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={isVerifying || !password.trim()}
            className="w-full py-4 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-base font-bold shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Verificando...' : 'Acceder al Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
