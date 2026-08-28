import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Send, MessageSquareHeart } from 'lucide-react';
import { MagnetButton } from '../reactbits/MagnetButton';
import { sound } from '../../utils/soundEffects';
import { GuestbookMessage } from '../../types';
import { DataStore } from '../../lib/firebase';

export const GuestbookSection: React.FC = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadMessages = async () => {
    const list = await DataStore.getGuestbookMessages();
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    sound.playClick();

    const colors = ['#EBD8AF', '#DEB3B3', '#CBDBCB', '#DFC184', '#D9A59F'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMessage: GuestbookMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      relation: relation.trim() || 'Invitado',
      message: messageText.trim(),
      likes: 1,
      createdAt: 'Justo ahora',
      avatarColor: randomColor,
    };

    await DataStore.saveGuestbookMessage(newMessage);
    setMessages((prev) => [newMessage, ...prev]);
    setName('');
    setRelation('');
    setMessageText('');
    setIsSubmitting(false);
    setShowForm(false);

    sound.playCelebration();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#E6CA65', '#DEB3B3'],
    });
  };

  const handleLike = (id: string) => {
    sound.playClick();
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          return { ...msg, likes: msg.likes + 1 };
        }
        return msg;
      })
    );
  };

  return (
    <section id="dedicatorias" className="py-16 px-4 max-w-4xl mx-auto text-[#FAF7F2]">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs tracking-widest uppercase font-serif mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Libro de Firmas & Deseos
        </motion.div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FAF7F2] font-medium">
          Muro de Dedicatorias
        </h2>
        <p className="font-serif italic text-gold-300/80 text-base sm:text-lg mt-2">
          Palabras de cariño y bendición para Luz & Julio
        </p>
        <div className="w-16 h-[1.5px] bg-gold-400/50 mx-auto mt-4" />
      </div>

      {/* Button to toggle message form */}
      {!showForm && (
        <div className="text-center mb-8">
          <button
            onClick={() => {
              sound.playClick();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-gold-300 border border-gold-400/40 font-serif font-semibold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquareHeart className="w-4 h-4 text-gold-400" />
            <span>Dejar un mensaje o bendición para los novios</span>
          </button>
        </div>
      )}

      {/* Form Card */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-[#14110E]/90 backdrop-blur-xl rounded-3xl border border-gold-400/30 shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 text-gold-300 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-gold-400" />
                  <h3 className="font-serif text-xl text-[#FAF7F2] font-medium">
                    Escribe tu Mensaje para Luz y Julio
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-gold-400/60 hover:text-gold-300 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleAddMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-sans font-semibold mb-1.5">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Familia Morales o Daniel"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold-400/30 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-[#FAF7F2] placeholder:text-gray-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-400 font-sans font-semibold mb-1.5">
                      Parentesco / Relación
                    </label>
                    <input
                      type="text"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      placeholder="Ej: Amigos, Familia, Primos..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold-400/30 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-[#FAF7F2] placeholder:text-gray-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-400 font-sans font-semibold mb-1.5">
                    Tu Mensaje o Bendición *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Escribe aquí tus mejores deseos para los novios..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold-400/30 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-[#FAF7F2] placeholder:text-gray-500 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <MagnetButton
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !messageText.trim()}
                    className="py-2.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 disabled:opacity-50 font-serif text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Publicando...' : 'Publicar Dedicatoria'}
                    </span>
                  </MagnetButton>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Feed */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-white/5 border border-gold-400/20 text-gold-300/60 font-serif italic text-base">
            <Heart className="w-6 h-6 text-gold-400 mx-auto mb-2 fill-gold-400/20" />
            Aún no hay dedicatorias publicadas. ¡Sé el primero en dejar un mensaje bonito para Luz y Julio!
          </div>
        ) : (
          messages.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-2xl bg-[#14110E]/80 backdrop-blur-md border border-gold-400/30 shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-charcoal-950 text-sm shadow-sm"
                    style={{ backgroundColor: item.avatarColor }}
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#FAF7F2]">
                      {item.name}
                    </h4>
                    <span className="text-xs text-gold-400 font-sans font-medium">
                      {item.relation} • <span className="text-gray-400 font-normal">{item.createdAt}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-roseDust-950/40 hover:bg-roseDust-900/60 border border-roseDust-400/30 text-roseDust-300 transition-all active:scale-90 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-roseDust-400 text-roseDust-400" />
                  <span className="text-xs font-sans font-bold">{item.likes}</span>
                </button>
              </div>

              <div className="mt-3 pl-4 border-l-2 border-gold-400/60">
                <p className="font-serif italic text-ivory-100 text-base leading-relaxed font-light">
                  «{item.message}»
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default GuestbookSection;
