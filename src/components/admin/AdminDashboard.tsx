import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart,
  AlertTriangle,
  X,
  Info
} from 'lucide-react';
import { DataStore } from '../../lib/firebase';
import { RsvpData, GuestbookMessage } from '../../types';
import { sound } from '../../utils/soundEffects';
import { weddingAudio } from '../../utils/audioController';

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
  const [dbStatus, setDbStatus] = useState<{
    status: 'checking' | 'connected' | 'permission-denied' | 'error' | 'unconfigured';
    details?: string;
  }>({ status: 'checking' });

  // Deletion Modal with Reason State
  const [deletingRsvp, setDeletingRsvp] = useState<RsvpData | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<GuestbookMessage | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Capacidad de plazas ajustada');
  const [customReason, setCustomReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rsvpsData, messagesData, status] = await Promise.all([
        DataStore.getRsvps(),
        DataStore.getGuestbookMessages(),
        DataStore.checkConnection(),
      ]);
      setRsvps(rsvpsData);
      setMessages(messagesData);
      setDbStatus(status);
    } catch (err) {
      console.error('Error refreshing admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Silence music completely inside admin panel
    weddingAudio.disablePlayback();

    setIsLoading(true);
    DataStore.checkConnection().then(setDbStatus);

    const unsubscribeRsvps = DataStore.subscribeToRsvps((list) => {
      setRsvps(list);
      setIsLoading(false);
    });

    const unsubscribeMessages = DataStore.subscribeToGuestbook((list) => {
      setMessages(list);
    });

    return () => {
      unsubscribeRsvps();
      unsubscribeMessages();
    };
  }, []);

  const handleOpenDeleteModal = (rsvp: RsvpData) => {
    sound.playClick();
    setDeletingRsvp(rsvp);
    setCancellationReason('Capacidad de plazas ajustada');
    setCustomReason('');
  };

  const handleConfirmDeleteRsvp = async () => {
    if (!deletingRsvp) return;
    setIsDeleting(true);
    sound.playClick();

    const finalReason = cancellationReason === 'Otro' ? customReason.trim() || 'Cancelado por administración' : cancellationReason;

    await DataStore.deleteRsvp(deletingRsvp.id!, finalReason, {
      fullName: deletingRsvp.fullName,
      phone: deletingRsvp.phone,
    });

    setRsvps((prev) => prev.filter((r) => r.id !== deletingRsvp.id));
    setIsDeleting(false);
    setDeletingRsvp(null);
  };

  const handleConfirmDeleteMessage = async () => {
    if (!deletingMessage) return;
    setIsDeleting(true);
    sound.playClick();
    await DataStore.deleteGuestbookMessage(deletingMessage.id);
    setMessages((prev) => prev.filter((m) => m.id !== deletingMessage.id));
    setIsDeleting(false);
    setDeletingMessage(null);
  };

  // Metrics Calculations
  const confirmedRsvps = rsvps.filter((r) => r.attending === 'yes');
  const declinedRsvps = rsvps.filter((r) => r.attending === 'no');

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

  // Export to Excel / CSV Function (Formato Limpio y Profesional)
  const exportToCSV = () => {
    sound.playClick();
    const exportDate = new Date().toLocaleString('es-PY');

    const metaHeader = [
      `"REPORTE OFICIAL DE CONFIRMACIONES - BODA DE LUZ Y JULIO"`,
      `"Fecha del Evento: Viernes, 9 de Octubre de 2026 • 11:30 AM (Puntual)"`,
      `"Lugar: Recepciones Luana — Ko'ê Pyta"`,
      `"Fecha de Generación: ${exportDate}"`,
      `"Total Plazas Confirmadas: ${totalAttendeesCount} (Titulares: ${confirmedRsvps.length} + Acompañantes: ${totalCompanionsCount})"`,
      `"No Asistirán: ${declinedRsvps.length}"`,
      `""`,
    ];

    const columnHeaders = [
      'Nº',
      'Nombre Completo',
      'Estado Asistencia',
      'Total Plazas',
      'Acompañantes Extras',
      'Nombres Acompañantes',
      'Teléfono Contacto',
      'Enlace Directo WhatsApp',
      'Requerimientos Menú / Alergias',
      'Detalle Alergias',
      'Canción Solicitada',
      'Mensaje para los Novios',
      'Fecha y Hora de Confirmación',
    ];

    const dataRows = rsvps.map((r, index) => {
      const cleanPhone = (r.phone || '').replace(/[^0-9]/g, '');
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : 'N/A';
      const dietary = (r.dietaryRestrictions || []).join(', ') || 'Estándar';
      const dietaryDetail = r.dietaryOther || 'Ninguno';
      const companions = (r.companionNames || []).join(', ') || 'Ninguno';
      const confirmedDate = r.confirmedAt ? new Date(r.confirmedAt).toLocaleString('es-PY') : 'Sin fecha';

      return [
        index + 1,
        `"${r.fullName.replace(/"/g, '""')}"`,
        r.attending === 'yes' ? '"SÍ ASISTIRÁ"' : '"NO ASISTIRÁ"',
        r.attending === 'yes' ? 1 + (r.additionalGuestsCount || 0) : 0,
        r.additionalGuestsCount || 0,
        `"${companions.replace(/"/g, '""')}"`,
        `"${r.phone || 'No indicado'}"`,
        `"${waLink}"`,
        `"${dietary.replace(/"/g, '""')}"`,
        `"${dietaryDetail.replace(/"/g, '""')}"`,
        `"${(r.songRequest || 'Ninguna').replace(/"/g, '""')}"`,
        `"${(r.loveMessage || 'Sin mensaje').replace(/"/g, '""')}"`,
        `"${confirmedDate}"`,
      ];
    });

    const csvLines = [
      ...metaHeader,
      columnHeaders.join(';'),
      ...dataRows.map((row) => row.join(';')),
    ];

    // UTF-8 BOM for perfect Excel accent support
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvLines.join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Invitados_Boda_Luz_y_Julio_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-white p-4 sm:p-6 md:p-10 select-none font-sans">
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-white/60 font-sans">
                Boda de Luz & Julio • Recepciones Luana Ko'ê Pyta
              </p>
              <span className="text-white/30">•</span>
              {dbStatus.status === 'connected' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase Cloud Activo
                </span>
              )}
              {dbStatus.status === 'permission-denied' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-medium">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Firebase: Reglas Pendientes
                </span>
              )}
              {dbStatus.status === 'checking' && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/20 text-white/50 text-[11px]">
                  Verificando conexión...
                </span>
              )}
            </div>
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

      {/* Permission Denied Alert Banner if Firebase Rules are locked */}
      {dbStatus.status === 'permission-denied' && (
        <div className="max-w-6xl mx-auto mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed font-sans">
            <p className="font-semibold text-amber-300 text-sm">
              Acción requerida en Firebase Console: Publicar Reglas de Firestore
            </p>
            <p className="mt-1">
              Las credenciales de tu proyecto <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">kairo-3d31d</code> son correctas, pero las reglas de seguridad de Firestore están bloqueando el acceso público.
            </p>
            <p className="mt-1">
              <strong>Solución (1 minuto):</strong> Entra a <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-bold text-white hover:text-amber-300">Firebase Console</a> ➔ selecciona tu proyecto ➔ <strong>Firestore Database</strong> ➔ pestaña <strong>Reglas (Rules)</strong> ➔ pega <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono">allow read, write: if true;</code> y haz clic en <strong>Publicar</strong>.
            </p>
          </div>
        </div>
      )}

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
              Mensajes en el mural
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

                      {/* Phone Display */}
                      {rsvp.phone && (
                        <p className="text-xs text-gold-300 font-mono font-medium">
                          Teléfono: {rsvp.phone}
                        </p>
                      )}

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
                            {rsvp.dietaryOther && ` (${rsvp.dietaryOther})`}
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

                    {/* Actions: Admin WhatsApp + Delete with Reason */}
                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 justify-between md:justify-end">
                      {rsvp.phone && (
                        <a
                          href={`https://wa.me/${rsvp.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-medium transition-all cursor-pointer"
                          title="Enviar mensaje de WhatsApp al invitado"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenDeleteModal(rsvp)}
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full bg-roseDust-950/60 hover:bg-roseDust-900 border border-roseDust-500/40 text-roseDust-300 text-xs font-sans transition-colors cursor-pointer"
                        title="Cancelar y eliminar confirmación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MESSAGES / DEDICATIONS */}
        {activeTab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl text-white/50 font-serif italic text-base">
                Aún no hay dedicatorias publicadas.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10, transition: { duration: 0.25 } }}
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

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-roseDust-300 text-xs font-sans">
                        <Heart className="w-3.5 h-3.5 fill-roseDust-400 text-roseDust-400" />
                        <span>{item.likes}</span>
                      </div>

                      {/* Admin Delete Message Button */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          setDeletingMessage(item);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-roseDust-950/80 hover:bg-roseDust-900 border border-roseDust-500/40 text-roseDust-300 text-xs font-sans transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        title="Eliminar este mensaje del mural"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {/* DELETE MESSAGE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#161311] border border-roseDust-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setDeletingMessage(null)}
                className="absolute top-5 right-5 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-roseDust-500/20 text-roseDust-300 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="font-instrument text-2xl text-white text-center font-normal">
                Eliminar Mensaje del Mural
              </h3>
              <p className="text-xs text-white/70 font-sans text-center mt-1">
                ¿Deseas eliminar permanentemente la dedicatoria de{' '}
                <strong className="text-white font-bold">{deletingMessage.name}</strong> del mural público?
              </p>

              <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-serif italic text-sm">
                «{deletingMessage.message}»
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingMessage(null)}
                  className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDeleteMessage}
                  className="py-2.5 px-5 rounded-full bg-roseDust-600 hover:bg-roseDust-500 text-white font-sans font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar del Mural'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CANCELLATION REASON MODAL */}
      <AnimatePresence>
        {deletingRsvp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#161311] border border-roseDust-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setDeletingRsvp(null)}
                className="absolute top-5 right-5 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-roseDust-500/20 text-roseDust-300 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="font-instrument text-2xl text-white text-center font-normal">
                Eliminar Confirmación
              </h3>
              <p className="text-xs text-white/70 font-sans text-center mt-1 mb-5">
                Invitado: <strong className="text-white">{deletingRsvp.fullName}</strong>
              </p>

              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-sans font-semibold">
                  Selecciona el motivo de cancelación:
                </label>
                <select
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-sans text-white text-sm cursor-pointer"
                >
                  <option value="Capacidad de plazas ajustada">Capacidad de plazas ajustada</option>
                  <option value="Cancelación solicitada por el invitado">Cancelación solicitada por el invitado</option>
                  <option value="Datos incorrectos o registro duplicado">Datos incorrectos o registro duplicado</option>
                  <option value="Otro">Otro (especificar)</option>
                </select>

                {cancellationReason === 'Otro' && (
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Escribe el motivo personalizado..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-400 font-sans text-white text-sm"
                  />
                )}

                <p className="text-[11px] text-white/50 font-sans pt-1 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>Este motivo se le mostrará al invitado si vuelve a consultar el enlace para que conozca la razón y pueda volver a confirmar si corresponde.</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingRsvp(null)}
                  className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting || (cancellationReason === 'Otro' && !customReason.trim())}
                  onClick={handleConfirmDeleteRsvp}
                  className="py-2.5 px-5 rounded-full bg-roseDust-600 hover:bg-roseDust-500 text-white font-sans font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
