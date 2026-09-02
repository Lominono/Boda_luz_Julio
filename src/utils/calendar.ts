// Smart Calendar utility: automatically selects Apple Calendar (.ics) for iOS / macOS and Google Calendar for Android / Windows
export const isAppleDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
};

export const weddingEvent = {
  title: 'Boda de Luz & Julio',
  description: 'Celebración de la Boda de Luz & Julio en Recepciones Luana Ko\'ê Pyta.',
  location: 'Recepciones Luana, Ko\'ê Pyta',
  // Viernes 9 de Octubre de 2026 a las 11:30 AM (Hora de Paraguay UTC-3 -> 14:30 UTC)
  startDateUtc: '20261009T143000Z',
  endDateUtc: '20261009T230000Z',
  dateFormatted: 'Viernes, 9 de Octubre de 2026',
  timeFormatted: '11:30 AM (Puntual)',
};

export const openSmartCalendar = () => {
  if (isAppleDevice()) {
    // Generate .ics calendar for iOS / macOS
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Boda Luz y Julio//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:boda-luz-julio-20261009T143000Z@recepcionesluana`,
      `SUMMARY:${weddingEvent.title}`,
      `DESCRIPTION:${weddingEvent.description}`,
      `LOCATION:${weddingEvent.location}`,
      `DTSTART:${weddingEvent.startDateUtc}`,
      `DTEND:${weddingEvent.endDateUtc}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Recordatorio: ${weddingEvent.title} mañana a las ${weddingEvent.timeFormatted}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Boda_Luz_y_Julio.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 2000);
  } else {
    // Google Calendar URL for Android and desktop
    const title = encodeURIComponent(weddingEvent.title);
    const details = encodeURIComponent(weddingEvent.description);
    const location = encodeURIComponent(weddingEvent.location);
    const dates = `${weddingEvent.startDateUtc}/${weddingEvent.endDateUtc}`;
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  }
};
