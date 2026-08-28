import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
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
      setError('Contraseña de administrador incorrecta. Verifica mayúsculas y minúsculas.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white p-4 select-none overflow-hidden font-sans">
      {/* Cinematic Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-[#0A0908] to-black pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-[#12100E]/95 border border-white/20 rounded-[2rem] p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center"
      >
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        {/* Shimmering Gold Icon */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="w-18 h-18 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/40 flex items-center justify-center mx-auto mb-4 mt-2 text-gold-300 shadow-[0_0_35px_rgba(212,175,55,0.25)]"
        >
          <KeyRound className="w-8 h-8 text-gold-400" />
        </motion.div>

        <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-gold-400 font-serif mb-1">
          Acceso Restringido
        </span>

        <h2 className="font-instrument text-3xl sm:text-4xl text-white font-normal leading-tight">
          Panel de Administración
        </h2>
        <p className="text-xs text-white/60 font-sans mt-1.5 mb-8">
          Boda de Luz & Julio • Gestión de Invitados
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-2">
              Clave de Acceso
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
                placeholder="Escribe la clave maestra"
                autoFocus
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono text-center text-lg text-white placeholder:text-white/30 tracking-widest transition-all shadow-inner"
              />
              <Lock className="w-4 h-4 text-gold-400/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-roseDust-400 font-sans mt-2.5 text-center bg-roseDust-950/40 border border-roseDust-500/30 py-1.5 px-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !password.trim()}
            className="w-full py-4 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-base font-bold shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Verificando...' : 'Entrar al Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
