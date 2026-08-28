import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Send, MessageSquareHeart } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { GuestbookMessage } from '../../types';
import { DataStore } from '../../lib/firebase';

const LIKED_STORAGE_KEY = 'boda_luz_julio_user_likes_v1';

export const GuestbookSection: React.FC = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const loadMessages = async () => {
    const list = await DataStore.getGuestbookMessages();
    setMessages(list);

    // Load liked IDs
    try {
      const stored = localStorage.getItem(LIKED_STORAGE_KEY);
      if (stored) {
        setLikedIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    sound.playClick();

    const colors = ['#C5A059', '#D9A59F', '#A7C0A7', '#DFC184', '#E6CA65'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMessage: GuestbookMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      relation: relation.trim() || 'Invitado',
      message: messageText.trim(),
      likes: 1, // Realistic initial like count
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

  const handleToggleLike = async (id: string) => {
    sound.playClick();
    const isAlreadyLiked = likedIds.has(id);
    const newLiked = new Set(likedIds);

    let delta = 1;
    if (isAlreadyLiked) {
      newLiked.delete(id);
      delta = -1;
    } else {
      newLiked.add(id);
      delta = 1;
    }

    setLikedIds(newLiked);
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(newLiked)));

    // Update in state
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          const updatedLikes = Math.max(0, msg.likes + delta);
          return { ...msg, likes: updatedLikes };
        }
        return msg;
      })
    );

    // Save updated likes to DataStore
    const targetMsg = messages.find((m) => m.id === id);
    if (targetMsg) {
      await DataStore.saveGuestbookMessage({
        ...targetMsg,
        likes: Math.max(0, targetMsg.likes + delta),
      });
    }
  };

  return (
    <section id="dedicatorias" className="py-16 px-4 max-w-4xl mx-auto text-white">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-gold-300 text-xs tracking-widest uppercase font-serif mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Libro de Firmas & Deseos
        </motion.div>

        <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl text-white font-normal">
          Muro de Dedicatorias
        </h2>
        <p className="font-serif italic text-white/70 text-base sm:text-lg mt-2 font-light">
          Palabras de cariño y bendición para Luz & Julio
        </p>
        <div className="w-16 h-[1px] bg-white/20 mx-auto mt-4" />
      </div>

      {/* Button to toggle message form */}
      {!showForm && (
        <div className="text-center mb-8">
          <button
            onClick={() => {
              sound.playClick();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-white hover:bg-gold-300 text-black font-serif font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquareHeart className="w-4 h-4" />
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
            <div className="bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 text-gold-300 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-gold-400" />
                  <h3 className="font-instrument text-2xl text-white font-normal">
                    Escribe tu Mensaje para Luz y Julio
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-white/60 hover:text-white cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleAddMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-1.5">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Familia Morales o Daniel"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-1.5">
                      Parentesco / Relación
                    </label>
                    <input
                      type="text"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      placeholder="Ej: Amigos, Familia, Primos..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold mb-1.5">
                    Tu Mensaje o Bendición *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Escribe aquí tus mejores deseos para los novios..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-serif text-white placeholder:text-white/40 text-sm"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !messageText.trim()}
                    className="py-2.5 px-6 rounded-full bg-white hover:bg-gold-300 text-black disabled:opacity-50 font-serif text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Publicando...' : 'Publicar Dedicatoria'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Feed */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-serif italic text-base">
            <Heart className="w-6 h-6 text-gold-400 mx-auto mb-2 fill-gold-400/20" />
            Aún no hay dedicatorias publicadas. ¡Sé el primero en dejar un mensaje bonito para Luz y Julio!
          </div>
        ) : (
          messages.map((item) => {
            const isLiked = likedIds.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 sm:p-6 rounded-3xl bg-black/75 backdrop-blur-md border border-white/15 shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-black text-sm shadow-sm"
                      style={{ backgroundColor: item.avatarColor }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {item.name}
                      </h4>
                      <span className="text-xs text-gold-300 font-sans font-medium">
                        {item.relation} • <span className="text-white/50 font-normal">{item.createdAt}</span>
                      </span>
                    </div>
                  </div>

                  {/* 1 Like per User Heart Toggle */}
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-90 cursor-pointer ${
                      isLiked
                        ? 'bg-roseDust-950/80 border-roseDust-400 text-roseDust-300 shadow-[0_0_15px_rgba(203,143,143,0.3)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/70'
                    }`}
                    title={isLiked ? 'Quitar like' : 'Dar like a este mensaje'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-roseDust-400 text-roseDust-400' : 'text-white/60'}`} />
                    <span className="text-xs font-sans font-bold">{item.likes}</span>
                  </button>
                </div>

                <div className="mt-3 pl-4 border-l-2 border-gold-400/60">
                  <p className="font-serif italic text-white/90 text-base leading-relaxed font-light">
                    «{item.message}»
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default GuestbookSection;
