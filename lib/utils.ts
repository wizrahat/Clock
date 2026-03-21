import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(totalMinutes: number, type?: 'display') {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  switch (type) {
    case 'display':
      return `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''}`.trim();
    default:
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}

