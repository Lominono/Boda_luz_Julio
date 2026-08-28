import React, { useState } from 'react';
import { Lock, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
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
      setError('Contraseña de administrador incorrecta.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white p-4 select-none">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#12100E] border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl text-center">
        {/* Back Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la web</span>
        </button>

        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mx-auto mb-4 mt-4 text-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <Shield className="w-8 h-8" />
        </div>

        <h2 className="font-instrument text-3xl sm:text-4xl text-white font-normal">
          Panel de Administración
        </h2>
        <p className="text-xs text-white/60 font-sans mt-1 mb-6">
          Boda de Luz & Julio • Acceso Privado
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gold-400 font-sans font-semibold mb-2 text-left">
              Clave Maestra de Seguridad
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Ingresa la clave de administrador"
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono text-center text-lg text-white placeholder:text-white/40 transition-all shadow-inner"
              />
              <Lock className="w-4 h-4 text-gold-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {error && (
              <p className="text-xs text-roseDust-400 font-sans mt-2">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || !password.trim()}
            className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-base font-bold shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isVerifying ? 'Validando...' : 'Acceder al Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
