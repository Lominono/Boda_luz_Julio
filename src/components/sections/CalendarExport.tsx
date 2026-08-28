import React from 'react';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const CalendarExport: React.FC = () => {
  const eventDetails = {
    title: 'Boda Luz & Julio',
    description: 'Celebración de la Sagrada Unión de Luz y Julio en Finca Los Olivos, Madrid.',
    location: 'Finca Los Olivos, Camino Real de la Vega 28, Madrid',
    startDate: '20261024T160000Z', // 18:00 CEST (UTC+2) -> 16:00 UTC
    endDate: '20261025T040000Z',
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventDetails.title
  )}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(
    eventDetails.description
  )}&location=${encodeURIComponent(eventDetails.location)}`;

  const downloadIcsFile = () => {
    sound.playClick();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Boda Luz y Julio//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
DTSTART:${eventDetails.startDate}
DTEND:${eventDetails.endDate}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Boda_Luz_y_Julio.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sound.playClick()}
        className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-white/90 hover:bg-gold-50 border border-gold-300/50 text-gold-700 font-serif text-xs shadow-sm transition-all cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-gold-600" />
        Añadir a Google Calendar
        <ExternalLink className="w-3 h-3 text-gold-500" />
      </a>

      <button
        type="button"
        onClick={downloadIcsFile}
        className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-white/90 hover:bg-gold-50 border border-gold-300/50 text-gold-700 font-serif text-xs shadow-sm transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-gold-600" />
        Apple / Outlook (.ics)
      </button>
    </div>
  );
};

export default CalendarExport;
