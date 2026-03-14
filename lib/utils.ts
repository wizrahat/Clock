import { type ClassValue, clsx } from "clsx";
import { addDays, differenceInMinutes, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function convertMinutesToHoursMinutes (totalMinutes: number) {
  const hours = Math.floor(totalMinutes /60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}
 export function getTimeTillNext(nextTime:string,currentTime?:Date)   {
    let timeTillNextAlarm = differenceInMinutes(new Date(parse(nextTime, "HH:mm", new Date())), new Date());
  if (timeTillNextAlarm < 0) {
    timeTillNextAlarm = differenceInMinutes(addDays(new Date(parse(nextTime, "HH:mm", new Date())), 1), new Date());
  }
  return convertMinutesToHoursMinutes(timeTillNextAlarm)
 }
