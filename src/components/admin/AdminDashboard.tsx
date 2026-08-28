import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CheckCircle,
  XCircle,
  MessageSquareHeart,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Search,
  ArrowLeft,
  Utensils,
  Music,
  Sparkles,
  RefreshCw,
  Phone
} from 'lucide-react';
import { DataStore } from '../../lib/firebase';
import { RsvpData, AccessPasscode } from '../../types';
import { sound } from '../../utils/soundEffects';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'rsvps' | 'passcodes' | 'messages'>('rsvps');
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);
  const [passcodes, setPasscodes] = useState<AccessPasscode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttending, setFilterAttending] = useState<'all' | 'yes' | 'no'>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // New Passcode Form State
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeText, setNewCodeText] = useState('');
  const [newCodeMaxGuests, setNewCodeMaxGuests] = useState(2);
  const [newCodeNotes, setNewCodeNotes] = useState('');
  const [isCreatingCode, setIsCreatingCode] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rsvpsData, passcodesData] = await Promise.all([
        DataStore.getRsvps(),
        DataStore.getPasscodes(),
      ]);
      setRsvps(rsvpsData);
      setPasscodes(passcodesData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Metrics Calculation
  const attendingRsvps = rsvps.filter((r) => r.attending === 'yes');
  const notAttendingRsvps = rsvps.filter((r) => r.attending === 'no');
  const totalAttendeesSum = attendingRsvps.reduce(
    (sum, r) => sum + (r.totalAttendeesCount || (1 + (r.additionalGuestsCount || 0))),
    0
  );
  const totalWithLoveMessages = rsvps.filter((r) => r.loveMessage && r.loveMessage.trim().length > 0);

  // Dietary counts summary for catering
  const dietarySummary: Record<string, number> = {};
  attendingRsvps.forEach((r) => {
    (r.dietaryRestrictions || []).forEach((d) => {
      dietarySummary[d] = (dietarySummary[d] || 0) + 1;
    });
  });

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.companionNames || []).some((name) => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.phone || '').includes(searchTerm);

    if (filterAttending === 'yes') return matchesSearch && r.attending === 'yes';
    if (filterAttending === 'no') return matchesSearch && r.attending === 'no';
    return matchesSearch;
  });

  // Create Passcode
  const handleCreatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) return;

    sound.playClick();
    const finalCode = (newCodeText.trim() || `BODA-${Math.random().toString(36).substring(2, 7)}`).toUpperCase();

    await DataStore.createPasscode({
      code: finalCode,
      guestName: newCodeName.trim(),
      maxCompanions: newCodeMaxGuests,
      notes: newCodeNotes.trim() || undefined,
    });

    setNewCodeName('');
    setNewCodeText('');
    setNewCodeNotes('');
    setIsCreatingCode(false);
    await loadData();
    sound.playCelebration();
  };

  // Delete Passcode
  const handleDeletePasscode = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este código de acceso?')) {
      sound.playClick();
      await DataStore.deletePasscode(id);
      await loadData();
    }
  };

  // Delete RSVP
  const handleDeleteRsvp = async (id?: string) => {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar esta confirmación?')) {
      sound.playClick();
      await DataStore.deleteRsvp(id);
      await loadData();
    }
  };

  // Copy shareable WhatsApp link with code
  const handleCopyLink = (code: string, id: string) => {
    sound.playClick();
    const baseUrl = window.location.origin + window.location.pathname;
    const directLink = `${baseUrl}?code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(directLink);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Export to CSV for catering
  const handleExportCsv = () => {
    sound.playClick();
    const headers = [
      'Nombre Principal',
      'Asistencia',
      'Total Asistentes',
      'Acompañantes',
      'Teléfono',
      'Alergias / Menú',
      'Canción Fiesta',
      'Mensaje Bonito',
      'Clave Usada',
      'Fecha Confirmación',
    ];

    const rows = rsvps.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'SÍ' : 'NO',
      r.attending === 'yes' ? (r.totalAttendeesCount || (1 + (r.additionalGuestsCount || 0))) : 0,
      `"${(r.companionNames || []).join(', ').replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      `"${(r.dietaryRestrictions || []).join(', ').replace(/"/g, '""')}"`,
      `"${(r.songRequest || '').replace(/"/g, '""')}"`,
      `"${(r.loveMessage || '').replace(/"/g, '""')}"`,
      `"${r.passcodeUsed || ''}"`,
      `"${new Date(r.confirmedAt).toLocaleDateString('es-ES')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invitados_Boda_Luz_y_Julio_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal-900 font-sans pb-20">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold-300/50 shadow-sm py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-ivory-100 hover:bg-gold-50 border border-gold-300/50 text-gold-700 transition-all active:scale-95 cursor-pointer"
              title="Volver a la invitación"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                  Panel de Gestión • Boda Luz & Julio
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-800 text-[11px] font-mono font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-charcoal-800/60 font-sans">
                Control de invitados, claves de acceso y dedicatorias
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white hover:bg-gold-50 border border-gold-300 text-gold-800 text-xs font-serif font-semibold shadow-sm transition-all"
              title="Recargar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-serif font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel / CSV</span>
            </button>

            <button
              onClick={onExit}
              className="py-2 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-serif font-semibold shadow-sm transition-all"
            >
              Ver Invitación
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-gold-300/50 shadow-sm">
            <div className="flex items-center justify-between text-gold-600 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold text-gold-800">
                Total Personas Confirmadas
              </span>
              <Users className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {totalAttendeesSum}
            </div>
            <p className="text-[11px] text-charcoal-800/60 mt-1">
              Sumando titulares ({attendingRsvps.length}) + acompañantes
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gold-300/50 shadow-sm">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold text-emerald-800">
                Respuestas 'Sí, asistiré'
              </span>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-700">
              {attendingRsvps.length}
            </div>
            <p className="text-[11px] text-charcoal-800/60 mt-1">
              Confirmaciones positivas
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gold-300/50 shadow-sm">
            <div className="flex items-center justify-between text-roseDust-600 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold text-roseDust-700">
                No podrán asistir
              </span>
              <XCircle className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-roseDust-700">
              {notAttendingRsvps.length}
            </div>
            <p className="text-[11px] text-charcoal-800/60 mt-1">
              Bajas notificadas
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gold-300/50 shadow-sm">
            <div className="flex items-center justify-between text-gold-600 mb-2">
              <span className="text-xs uppercase tracking-wider font-sans font-semibold text-gold-800">
                Dedicatorias / Mensajes
              </span>
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {totalWithLoveMessages.length}
            </div>
            <p className="text-[11px] text-charcoal-800/60 mt-1">
              Mensajes bonitos recibidos
            </p>
          </div>
        </div>

        {/* Dietary Summary Banner */}
        {Object.keys(dietarySummary).length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-ivory-100 border border-gold-300/60 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gold-800 font-serif font-bold text-sm">
              <Utensils className="w-4 h-4 text-gold-600" />
              <span>Resumen para Catering / Cocina:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dietarySummary).map(([diet, count]) => (
                <span
                  key={diet}
                  className="px-3 py-1 rounded-full bg-white border border-gold-300 text-xs font-sans font-semibold text-charcoal-900 shadow-sm"
                >
                  {diet}: <strong className="text-gold-700">{count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gold-300/60 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-2.5 px-5 rounded-xl font-serif text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'rsvps'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'bg-white text-charcoal-800 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lista de Invitados ({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('passcodes')}
            className={`py-2.5 px-5 rounded-xl font-serif text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'passcodes'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'bg-white text-charcoal-800 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Creador de Claves ({passcodes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2.5 px-5 rounded-xl font-serif text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'bg-white text-charcoal-800 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Muro de Dedicatorias ({totalWithLoveMessages.length})</span>
          </button>
        </div>

        {/* TAB 1: RSVPS LIST */}
        {activeTab === 'rsvps' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gold-300/50">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por nombre, acompañante o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-ivory-50 border border-gold-300/70 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <Search className="w-4 h-4 text-gold-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-charcoal-800/60 font-sans font-medium">Filtrar:</span>
                <button
                  onClick={() => setFilterAttending('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all ${
                    filterAttending === 'all'
                      ? 'bg-gold-500 text-white'
                      : 'bg-ivory-100 text-charcoal-800 hover:bg-gold-50'
                  }`}
                >
                  Todos ({rsvps.length})
                </button>
                <button
                  onClick={() => setFilterAttending('yes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all ${
                    filterAttending === 'yes'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-ivory-100 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  Asisten ({attendingRsvps.length})
                </button>
                <button
                  onClick={() => setFilterAttending('no')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif font-semibold transition-all ${
                    filterAttending === 'no'
                      ? 'bg-roseDust-600 text-white'
                      : 'bg-ivory-100 text-roseDust-800 hover:bg-roseDust-50'
                  }`}
                >
                  No ({notAttendingRsvps.length})
                </button>
              </div>
            </div>

            {/* RSVPs Table */}
            <div className="bg-white rounded-2xl border border-gold-300/50 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-ivory-100/80 border-b border-gold-200 text-gold-900 font-serif font-bold text-sm">
                    <tr>
                      <th className="py-3.5 px-4">Invitado Principal</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Total Asistentes</th>
                      <th className="py-3.5 px-4">Acompañantes</th>
                      <th className="py-3.5 px-4">Alergias / Menú</th>
                      <th className="py-3.5 px-4">Canción</th>
                      <th className="py-3.5 px-4">Mensaje</th>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-100">
                    {filteredRsvps.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-charcoal-800/50 font-serif italic text-base">
                          No se encontraron confirmaciones con ese criterio.
                        </td>
                      </tr>
                    ) : (
                      filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-gold-50/40 transition-colors">
                          {/* Name & Phone */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-charcoal-900 text-sm font-serif">{rsvp.fullName}</div>
                            {rsvp.phone && (
                              <div className="text-[11px] text-charcoal-800/60 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-gold-600" />
                                {rsvp.phone}
                              </div>
                            )}
                            {rsvp.passcodeUsed && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-gold-100 text-gold-800 font-mono text-[10px]">
                                Clave: {rsvp.passcodeUsed}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {rsvp.attending === 'yes' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-serif font-bold text-xs">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Asiste
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-roseDust-100 text-roseDust-800 font-serif font-bold text-xs">
                                <XCircle className="w-3.5 h-3.5" />
                                No asiste
                              </span>
                            )}
                          </td>

                          {/* Total Attendees */}
                          <td className="py-3.5 px-4 text-center">
                            {rsvp.attending === 'yes' ? (
                              <span className="font-serif font-bold text-base text-gold-800 bg-gold-400/15 px-3 py-1 rounded-lg">
                                {rsvp.totalAttendeesCount || (1 + (rsvp.additionalGuestsCount || 0))} pers.
                              </span>
                            ) : (
                              <span className="text-charcoal-800/40">—</span>
                            )}
                          </td>

                          {/* Companions */}
                          <td className="py-3.5 px-4 max-w-[200px]">
                            {rsvp.companionNames && rsvp.companionNames.length > 0 ? (
                              <ul className="list-disc list-inside text-charcoal-800 space-y-0.5">
                                {rsvp.companionNames.map((cName, idx) => (
                                  <li key={idx} className="truncate">{cName}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-charcoal-800/40">Sin acompañantes</span>
                            )}
                          </td>

                          {/* Dietary */}
                          <td className="py-3.5 px-4 max-w-[180px]">
                            {rsvp.dietaryRestrictions && rsvp.dietaryRestrictions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {rsvp.dietaryRestrictions.map((d, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-roseDust-100 text-roseDust-800 text-[10px] font-medium">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-charcoal-800/40">Estándar</span>
                            )}
                          </td>

                          {/* Song Request */}
                          <td className="py-3.5 px-4 max-w-[160px]">
                            {rsvp.songRequest ? (
                              <span className="text-charcoal-800 italic flex items-center gap-1 truncate">
                                <Music className="w-3 h-3 text-gold-600 flex-shrink-0" />
                                {rsvp.songRequest}
                              </span>
                            ) : (
                              <span className="text-charcoal-800/40">—</span>
                            )}
                          </td>

                          {/* Message */}
                          <td className="py-3.5 px-4 max-w-[200px]">
                            {rsvp.loveMessage ? (
                              <p className="italic text-gold-900 line-clamp-2" title={rsvp.loveMessage}>
                                «{rsvp.loveMessage}»
                              </p>
                            ) : (
                              <span className="text-charcoal-800/40">—</span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-charcoal-800/60 whitespace-nowrap">
                            {new Date(rsvp.confirmedAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteRsvp(rsvp.id)}
                              className="p-1.5 rounded-lg hover:bg-roseDust-100 text-roseDust-600 transition-colors"
                              title="Eliminar confirmación"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASSCODES GENERATOR */}
        {activeTab === 'passcodes' && (
          <div className="space-y-6">
            {/* Header & Create Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gold-300/50">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
                  <Key className="w-6 h-6 text-gold-600" />
                  Creador de Claves para Invitados
                </h3>
                <p className="text-xs text-charcoal-800/70 font-sans mt-1">
                  Crea claves únicas para cada familia o grupo de amigos, y comparte su enlace directo con 1 clic.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingCode(!isCreatingCode)}
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-serif font-semibold text-sm shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingCode ? 'Cancelar' : 'Nueva Clave de Acceso'}</span>
              </button>
            </div>

            {/* Create Passcode Form Modal / Card */}
            <AnimatePresence>
              {isCreatingCode && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreatePasscode}
                  className="bg-ivory-100 p-6 rounded-2xl border border-gold-300 space-y-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-gold-800 font-serif font-bold text-lg border-b border-gold-300/60 pb-2">
                    <Sparkles className="w-5 h-5 text-gold-600" />
                    <span>Configurar Nueva Clave de Invitado</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-800 font-sans font-semibold mb-1.5">
                        Nombre del Invitado o Familia *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Familia Morales o Carlos & Elena"
                        value={newCodeName}
                        onChange={(e) => setNewCodeName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-800 font-sans font-semibold mb-1.5">
                        Código de Acceso (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: FAMILIA-MORALES (o se generará uno)"
                        value={newCodeText}
                        onChange={(e) => setNewCodeText(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-800 font-sans font-semibold mb-1.5">
                        Máximo de Acompañantes
                      </label>
                      <select
                        value={newCodeMaxGuests}
                        onChange={(e) => setNewCodeMaxGuests(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-500"
                      >
                        <option value={0}>Solo 1 persona (sin acompañante)</option>
                        <option value={1}>1 acompañante (2 plazas)</option>
                        <option value={2}>2 acompañantes (3 plazas)</option>
                        <option value={3}>3 acompañantes (4 plazas)</option>
                        <option value={5}>Familia numerosa (6 plazas)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-800 font-sans font-semibold mb-1.5">
                      Notas Internas para los Novios
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Mesa presidencial, amigos del colegio..."
                      value={newCodeNotes}
                      onChange={(e) => setNewCodeNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gold-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCode(false)}
                      className="py-2 px-4 rounded-xl bg-white hover:bg-gold-50 border border-gold-300 text-charcoal-800 text-xs font-serif"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-6 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-serif font-bold shadow-md transition-all active:scale-95"
                    >
                      Guardar y Crear Clave
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Passcodes List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {passcodes.map((p) => {
                const isCopied = copiedCodeId === p.id;

                return (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-2xl border border-gold-300/60 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-serif text-lg font-bold text-charcoal-900 block">
                            {p.guestName}
                          </span>
                          <span className="text-[11px] text-charcoal-800/60 font-sans">
                            Máx. {p.maxCompanions + 1} persona(s) • Creado {new Date(p.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeletePasscode(p.id)}
                          className="p-1.5 rounded-lg hover:bg-roseDust-100 text-roseDust-600 transition-colors"
                          title="Eliminar clave"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Code Badge */}
                      <div className="my-3 p-3 rounded-xl bg-gold-50 border border-gold-300/40 flex items-center justify-between">
                        <span className="font-mono text-base font-bold text-gold-900 tracking-wider">
                          {p.code}
                        </span>
                        <span className="text-[11px] font-sans text-gold-700 bg-white px-2 py-0.5 rounded-full border border-gold-200">
                          {p.usedCount} usos
                        </span>
                      </div>

                      {p.notes && (
                        <p className="text-xs text-charcoal-800/70 font-sans italic mb-3">
                          📝 {p.notes}
                        </p>
                      )}
                    </div>

                    {/* Copy Shareable Link Button */}
                    <div className="pt-3 border-t border-gold-100 flex gap-2">
                      <button
                        onClick={() => handleCopyLink(p.code, p.id)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-serif font-semibold transition-all ${
                          isCopied
                            ? 'bg-sage-600 text-white'
                            : 'bg-ivory-100 hover:bg-gold-100 text-gold-800 border border-gold-300 active:scale-95'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? '¡Enlace Copiado!' : 'Copiar Enlace WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LOVE MESSAGES / GUESTBOOK */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gold-300/50">
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
                <MessageSquareHeart className="w-6 h-6 text-gold-600" />
                Muro de Dedicatorias y Deseos de los Invitados
              </h3>
              <p className="text-xs text-charcoal-800/70 font-sans mt-1">
                Todas las palabras de cariño enviadas por vuestros seres queridos al confirmar o en el libro de firmas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {totalWithLoveMessages.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-gold-200">
                  <p className="font-serif italic text-charcoal-800/60 text-lg">
                    Aún no se han recibido mensajes bonitos.
                  </p>
                </div>
              ) : (
                totalWithLoveMessages.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-6 rounded-2xl border border-gold-300/60 shadow-sm flex flex-col justify-between relative"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gold-200 text-gold-900 font-serif font-bold text-sm flex items-center justify-center">
                            {r.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-serif text-base font-bold text-charcoal-900 block">
                              {r.fullName}
                            </span>
                            <span className="text-[11px] text-charcoal-800/50 font-sans">
                              {new Date(r.confirmedAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {r.attending === 'yes' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-serif text-[11px] font-bold">
                            Asistirá ({r.totalAttendeesCount || (1 + (r.additionalGuestsCount || 0))} pers.)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-roseDust-100 text-roseDust-800 font-serif text-[11px] font-bold">
                            No asiste
                          </span>
                        )}
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-ivory-50 border-l-4 border-gold-400">
                        <p className="font-serif italic text-charcoal-900 text-base leading-relaxed">
                          «{r.loveMessage}»
                        </p>
                      </div>
                    </div>

                    {r.songRequest && (
                      <div className="mt-4 pt-3 border-t border-gold-100 flex items-center gap-1.5 text-xs text-gold-800 font-sans">
                        <Music className="w-3.5 h-3.5 text-gold-600" />
                        <span>Canción sugerida: <strong>{r.songRequest}</strong></span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
