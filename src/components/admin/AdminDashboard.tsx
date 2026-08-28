import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  MessageSquareHeart,
  Download,
  Search,
  ArrowLeft,
  Utensils,
  Music,
  RefreshCw,
  Phone,
  Trash2,
  Heart
} from 'lucide-react';
import { DataStore } from '../../lib/firebase';
import { RsvpData, GuestbookMessage } from '../../types';
import { sound } from '../../utils/soundEffects';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'messages'>('rsvps');
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttending, setFilterAttending] = useState<'all' | 'yes' | 'no'>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rsvpsData, messagesData] = await Promise.all([
        DataStore.getRsvps(),
        DataStore.getGuestbookMessages(),
      ]);
      setRsvps(rsvpsData);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteRsvp = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la confirmación de ${name}?`)) {
      sound.playClick();
      await DataStore.deleteRsvp(id);
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Metrics Calculations
  const confirmedRsvps = rsvps.filter((r) => r.attending === 'yes');
  const declinedRsvps = rsvps.filter((r) => r.attending === 'no');

  // Total people = sum of (1 + additionalGuestsCount) for all attending
  const totalAttendeesCount = confirmedRsvps.reduce(
    (sum, r) => sum + (1 + (r.additionalGuestsCount || 0)),
    0
  );

  const totalCompanionsCount = confirmedRsvps.reduce(
    (sum, r) => sum + (r.additionalGuestsCount || 0),
    0
  );

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone && r.phone.includes(searchTerm)) ||
      (r.companionNames && r.companionNames.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())));

    if (filterAttending === 'yes') return matchesSearch && r.attending === 'yes';
    if (filterAttending === 'no') return matchesSearch && r.attending === 'no';
    return matchesSearch;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    sound.playClick();
    const headers = [
      'Nombre Completo',
      'Asistencia',
      'Acompañantes Extra',
      'Total Plazas',
      'Nombres Acompañantes',
      'Teléfono',
      'Alergias/Menú',
      'Canción Pedida',
      'Mensaje/Dedicatoria',
      'Fecha Confirmación',
    ];

    const rows = rsvps.map((r) => [
      `"${r.fullName}"`,
      r.attending === 'yes' ? 'SÍ ASISTIRÁ' : 'NO ASISTIRÁ',
      r.additionalGuestsCount || 0,
      r.attending === 'yes' ? 1 + (r.additionalGuestsCount || 0) : 0,
      `"${(r.companionNames || []).join(', ')}"`,
      `"${r.phone || ''}"`,
      `"${(r.dietaryRestrictions || []).join(', ')}"`,
      `"${r.songRequest || ''}"`,
      `"${(r.loveMessage || '').replace(/"/g, '""')}"`,
      `"${r.confirmedAt ? new Date(r.confirmedAt).toLocaleString('es-PY') : ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Confirmados_Boda_Luz_y_Julio_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-white p-4 sm:p-6 md:p-10 select-none">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white transition-all cursor-pointer"
            title="Volver a la invitación"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-instrument text-3xl sm:text-4xl text-white">
                Panel de Administración
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-[10px] uppercase font-sans font-bold tracking-widest">
                Exclusivo
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Boda de Luz & Julio • Recepciones Luana Ko'ê Pyta, Paraguay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-sans transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 py-2 px-5 rounded-full bg-white hover:bg-gold-300 text-black text-xs font-sans font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar a Excel / CSV</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Plazas Confirmadas */}
          <div className="p-4 sm:p-5 rounded-3xl bg-black/60 border border-gold-400/40 shadow-md">
            <div className="flex items-center justify-between text-gold-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold">
                Plazas Totales
              </span>
              <Users className="w-5 h-5" />
            </div>
            <span className="font-instrument text-4xl sm:text-5xl font-bold text-white">
              {totalAttendeesCount}
            </span>
            <p className="text-[11px] text-white/60 font-sans mt-1">
              Personas confirmadas
            </p>
          </div>

          {/* Card 2: Titulares Confirmados */}
          <div className="p-4 sm:p-5 rounded-3xl bg-black/60 border border-emerald-500/30 shadow-md">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold">
                Asistirán (Sí)
              </span>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="font-instrument text-4xl sm:text-5xl font-bold text-white">
              {confirmedRsvps.length}
            </span>
            <p className="text-[11px] text-white/60 font-sans mt-1">
              +{totalCompanionsCount} acompañantes
            </p>
          </div>

          {/* Card 3: No Asistirán */}
          <div className="p-4 sm:p-5 rounded-3xl bg-black/60 border border-roseDust-400/30 shadow-md">
            <div className="flex items-center justify-between text-roseDust-300 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold">
                No Asistirán
              </span>
              <XCircle className="w-5 h-5" />
            </div>
            <span className="font-instrument text-4xl sm:text-5xl font-bold text-white">
              {declinedRsvps.length}
            </span>
            <p className="text-[11px] text-white/60 font-sans mt-1">
              Respuestas negativas
            </p>
          </div>

          {/* Card 4: Total Dedicatorias */}
          <div className="p-4 sm:p-5 rounded-3xl bg-black/60 border border-white/20 shadow-md">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold">
                Dedicatorias
              </span>
              <MessageSquareHeart className="w-5 h-5 text-gold-400" />
            </div>
            <span className="font-instrument text-4xl sm:text-5xl font-bold text-white">
              {messages.length}
            </span>
            <p className="text-[11px] text-white/60 font-sans mt-1">
              Mensajes recibidos
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-2 px-5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
              activeTab === 'rsvps'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Lista de Confirmaciones ({rsvps.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Muro de Dedicatorias ({messages.length})
          </button>
        </div>

        {/* TAB 1: RSVPs LIST */}
        {activeTab === 'rsvps' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, teléfono o acompañante..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm text-white placeholder:text-white/40"
                />
                <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setFilterAttending('all')}
                  className={`flex-1 sm:flex-none py-2 px-3.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    filterAttending === 'all'
                      ? 'bg-gold-500/20 border border-gold-400 text-gold-300 font-bold'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Todos ({rsvps.length})
                </button>
                <button
                  onClick={() => setFilterAttending('yes')}
                  className={`flex-1 sm:flex-none py-2 px-3.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    filterAttending === 'yes'
                      ? 'bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Confirmados ({confirmedRsvps.length})
                </button>
                <button
                  onClick={() => setFilterAttending('no')}
                  className={`flex-1 sm:flex-none py-2 px-3.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    filterAttending === 'no'
                      ? 'bg-roseDust-950/80 border border-roseDust-400 text-roseDust-300 font-bold'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  No Asisten ({declinedRsvps.length})
                </button>
              </div>
            </div>

            {/* RSVP Cards for Mobile / Table for Desktop */}
            {filteredRsvps.length === 0 ? (
              <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl text-white/50 font-serif italic text-base">
                No se encontraron confirmaciones con el criterio seleccionado.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRsvps.map((rsvp) => (
                  <div
                    key={rsvp.id || rsvp.fullName}
                    className="p-5 rounded-3xl bg-black/75 backdrop-blur-md border border-white/15 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                          {rsvp.fullName}
                        </h3>
                        {rsvp.attending === 'yes' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-sans font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            {1 + (rsvp.additionalGuestsCount || 0)} plaza(s) confirmada(s)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-roseDust-950/80 border border-roseDust-500/50 text-roseDust-300 text-xs font-sans font-semibold">
                            <XCircle className="w-3 h-3" />
                            No podrá asistir
                          </span>
                        )}
                      </div>

                      {/* Companion Names */}
                      {rsvp.companionNames && rsvp.companionNames.length > 0 && (
                        <div className="text-xs text-gold-300/90 font-sans flex items-center gap-1.5 flex-wrap">
                          <Users className="w-3.5 h-3.5 text-gold-400" />
                          <span>Acompañantes:</span>
                          <span className="text-white font-medium">
                            {rsvp.companionNames.join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Dietary and Song */}
                      <div className="flex items-center gap-4 text-xs text-white/60 font-sans flex-wrap pt-0.5">
                        {rsvp.dietaryRestrictions && rsvp.dietaryRestrictions.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Utensils className="w-3.5 h-3.5 text-gold-400" />
                            {rsvp.dietaryRestrictions.join(', ')}
                          </span>
                        )}
                        {rsvp.songRequest && (
                          <span className="flex items-center gap-1">
                            <Music className="w-3.5 h-3.5 text-gold-400" />
                            {rsvp.songRequest}
                          </span>
                        )}
                      </div>

                      {/* Love Message / Dedicatoria */}
                      {rsvp.loveMessage && (
                        <p className="font-serif italic text-white/80 text-sm pt-1 pl-3 border-l-2 border-gold-400/50">
                          «{rsvp.loveMessage}»
                        </p>
                      )}
                    </div>

                    {/* Actions & Phone */}
                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 justify-between md:justify-end">
                      {rsvp.phone && (
                        <a
                          href={`https://wa.me/${rsvp.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-medium transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleDeleteRsvp(rsvp.id!, rsvp.fullName)}
                        className="p-2 rounded-full hover:bg-roseDust-950/60 text-white/40 hover:text-roseDust-400 transition-colors cursor-pointer"
                        title="Eliminar confirmación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl text-white/50 font-serif italic text-base">
                Aún no hay dedicatorias publicadas.
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-black/75 backdrop-blur-md border border-white/15 shadow-md flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-white">
                        {item.name}
                      </h4>
                      <span className="text-xs text-gold-400 font-sans">
                        • {item.relation}
                      </span>
                    </div>
                    <p className="font-serif italic text-white/90 text-base mt-2">
                      «{item.message}»
                    </p>
                    <span className="text-[11px] text-white/40 font-sans mt-1 block">
                      {item.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-roseDust-300 text-xs font-sans">
                    <Heart className="w-3.5 h-3.5 fill-roseDust-400 text-roseDust-400" />
                    <span>{item.likes} likes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
