// Smart Calendar utility: automatically selects Apple Calendar (.ics) for iOS / macOS and Google Calendar for Android / Windows
export const isAppleDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
};

export const WEDDING_MAPS_URL =
  'https://www.google.com/maps/place/Recepciones+Luana/@-24.1906273,-56.4706531,17z/data=!3m1!4b1!4m6!3m5!1s0x946093bc06296d7b:0xb4f73d4c443fdcc2!8m2!3d-24.190631!4d-56.4687241!16s%2Fg%2F11rdz7qt9j?entry=tts&skid=ab75a54a-ee70-4ee3-ae93-368283b9243a';

export const weddingEvent = {
  title: 'Boda de Luz & Julio',
  description: 'Celebración de la Boda de Luz & Julio en Recepciones Luana Ko\'ê Pyta.',
  location: 'Recepciones Luana, Ko\'ê Pyta',
  mapsUrl: WEDDING_MAPS_URL,
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
