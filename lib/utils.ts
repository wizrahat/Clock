import { type ClassValue, clsx } from "clsx";
import { addDays, differenceInMinutes, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(totalMinutes: number, type?: "display") {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  switch (type) {
    case "display":
      return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""}`.trim()
    default:
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }
}

export function minutesToDate(totalMinutes: number) {
  const date = new Date()
  date.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0)
  return date
}

export function getTimeTillNext(timeInMinutes: number, currentTime?: Date) {
  const date = minutesToDate(timeInMinutes)
  let timeTillNextAlarm = differenceInMinutes(date, currentTime || new Date());
  if (timeTillNextAlarm < 0) {
    timeTillNextAlarm = differenceInMinutes(addDays(date, 1), currentTime || new Date());
  }
  return formatTime(timeTillNextAlarm)
}
