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

export function getTimeTillNext(timeInMinutes: number, currentTime?: Date) {
  const now = currentTime || new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let difference = timeInMinutes - currentMinutes;
  if (difference < 0) {
    difference += 1440;
  }
  return formatTime(difference, 'display');
}
