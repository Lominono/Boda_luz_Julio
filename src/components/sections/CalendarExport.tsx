import React from 'react';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { openSmartCalendar, isAppleDevice } from '../../utils/calendar';

export const CalendarExport: React.FC = () => {
  const isApple = isAppleDevice();

  const handleCalendarClick = () => {
    sound.playClick();
    openSmartCalendar();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
      <button
        type="button"
        onClick={handleCalendarClick}
        className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-white hover:bg-gold-300 text-black font-serif text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-gold-600" />
        <span>
          {isApple ? 'Añadir a Apple Calendar (.ics)' : 'Añadir a Google Calendar'}
        </span>
        {isApple ? (
          <Download className="w-3.5 h-3.5 opacity-70" />
        ) : (
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        )}
      </button>
    </div>
  );
};

export default CalendarExport;
