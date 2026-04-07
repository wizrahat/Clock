import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TimeFormat = '12' | '24';

export function formatTime(totalMinutes: number, type?: 'display', timeFormat: TimeFormat = '12') {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  switch (type) {
    case 'display':
      return `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''}`.trim();
    default:
      if (timeFormat === '12') {
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
      }
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}

export function dateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}
