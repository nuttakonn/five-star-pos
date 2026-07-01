/**
 * Utilities for Thai Local Time (GMT+7)
 */

export const getThaiDate = (date: Date = new Date()): string => {
  // Returns YYYY-MM-DD in Asia/Bangkok
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const getThaiTimestamp = (date: Date = new Date()): string => {
  // Returns YYYY-MM-DD HH:mm:ss in Asia/Bangkok
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date).replace(',', '');
};

export const getThaiISO = (date: Date = new Date()): string => {
  // Returns an ISO-like string adjusted for GMT+7 for storage
  // e.g., 2024-05-14T10:00:00.000+07:00
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  });
  
  const parts = formatter.formatToParts(date);
  const find = (type: string) => parts.find(p => p.type === type)?.value;
  
  return `${find('year')}-${find('month')}-${find('day')}T${find('hour')}:${find('minute')}:${find('second')}.${find('fractionalSecond')}+07:00`;
};
