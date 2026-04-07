import { db } from '@/db/drizzle';
import { Alarm, AlarmsTable, AlarmUpdateSchema, type UpdateAlarm } from './../db/schema/alarms';
import { eq } from 'drizzle-orm';
import { SCHEDULE_LABELS } from './constants';
import { addDays, Day, format, getMonth, getYear, nextDay, parseISO } from 'date-fns';
import { dateToMinutes } from './utils';

const PRESET_LABELS: Record<string, string> = {
  [JSON.stringify([0, 1, 2, 3, 4, 5, 6])]: SCHEDULE_LABELS.EVERY_DAY,
  [JSON.stringify([1, 2, 3, 4, 5])]: SCHEDULE_LABELS.WEEKDAYS,
  [JSON.stringify([0, 6])]: SCHEDULE_LABELS.WEEKENDS,
};
const DAY_LABELS: Record<number, string> = {
  0: 'Su',
  1: 'Mo',
  2: 'Tu',
  3: 'We',
  4: 'Th',
  5: 'Fr',
  6: 'Sa',
};

function combineDateTime(date: Date, timeInMinutes: number): Date {
  const result = new Date(date);
  result.setHours(Math.floor(timeInMinutes / 60));
  result.setMinutes(timeInMinutes % 60);
  result.setSeconds(0);
  result.setMilliseconds(0);
  return result;
}

function isDayTomorrow(dayIndex: number) {
  const tomorrow = addDays(new Date(), 1);
  return dayIndex === tomorrow.getDay();
}

function isDateTomorrow(date: Date) {
  const tomorrow = addDays(new Date(), 1);
  return format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
}

function isDateToday(date: Date) {
  return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
}

function isConsecutive(arr: number[]) {
  return arr.every((v, i) => i === arr.length - 1 || v + 1 === arr[i + 1]);
}

export async function updateAlarm(id: string, changes: UpdateAlarm) {
  const result = AlarmUpdateSchema.safeParse(changes);
  if (!result.success) {
    throw new Error(`Insert failed: ${JSON.stringify(result.error.issues)}`);
  }

  return db
    .update(AlarmsTable)
    .set(result.data as any)
    .where(eq(AlarmsTable.id, id));
}

export function formatScheduleLabel(
  scheduleType: Alarm['scheduleType'],
  repeatDays: number[],
  customDates: string[],
  time: number
) {
  const formattedDates = customDates.map((date) => {
    return parseISO(date);
  });
  const presetLabel = PRESET_LABELS[JSON.stringify(repeatDays)];

  if (scheduleType === 'once' || (repeatDays.length < 1 && formattedDates.length < 1)) {
    return SCHEDULE_LABELS.ONCE;
  }
  if (scheduleType === 'custom') {
    const startDate = formattedDates[0];
    const endDate = formattedDates[formattedDates.length - 1];
    const currentYear = getYear(new Date());
    const startYear = getYear(startDate);
    const endYear = getYear(endDate);
    const isSameYear = startYear === currentYear && endYear === currentYear;
    const isSameMonth = getMonth(startDate) === getMonth(endDate) && startYear === endYear;
    if (formattedDates.length === 1) {
      if (isDateTomorrow(startDate)) return SCHEDULE_LABELS.TOMORROW;
      if (isDateToday(startDate)) {
        const currentMinutes = dateToMinutes(new Date());
        if (currentMinutes < time) return SCHEDULE_LABELS.TODAY;
      }
      return format(startDate, isSameYear ? 'MMM d' : 'MMM d, yyyy');
    }
    if (isSameMonth && isSameYear) {
      // Mar 12 – 27
      return `${format(startDate, 'MMM d')} – ${format(endDate, 'd')}`;
    } else if (isSameMonth && startYear !== currentYear) {
      // Mar 12 – 27, 2027
      return `${format(startDate, 'MMM d')} – ${format(endDate, 'd, yyyy')}`;
    } else if (isSameYear) {
      // Mar 25 – Apr 2
      return `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d')}`;
    } else if (startYear === endYear) {
      // Mar 25 – Apr 2, 2027
      return `${format(startDate, 'MMM d')} – ${format(endDate, 'MMM d, yyyy')}`;
    } else {
      // Dec 25, 2026 – Jan 5, 2027
      return `${format(startDate, 'MMM d, yyyy')} – ${format(endDate, 'MMM d, yyyy')}`;
    }
  }
  if (presetLabel) {
    return presetLabel;
  }
  if (repeatDays.length === 1) {
    if (isDayTomorrow(repeatDays[0])) return SCHEDULE_LABELS.TOMORROW;
    if (repeatDays[0] === new Date().getDay()) {
      const currentMinutes = dateToMinutes(new Date());
      if (currentMinutes < time) return SCHEDULE_LABELS.TODAY;
    }
    return format(addDays(new Date(2024, 0, 7), repeatDays[0]), 'EEEE');
  }
  if (isConsecutive(repeatDays)) {
    return `${DAY_LABELS[repeatDays[0]]} – ${DAY_LABELS[repeatDays[repeatDays.length - 1]]}`;
  }

  return repeatDays.map((v) => DAY_LABELS[v]).join(' | ');
}

// export function getTimeTillNext(timeInMinutes: number, currentTime?: Date) {
//   const now = currentTime || new Date();
//   const currentMinutes = now.getHours() * 60 + now.getMinutes();
//   let difference = timeInMinutes - currentMinutes;
//   if (difference < 0) {
//     difference += 1440;
//   }
//   return formatTime(difference, 'display');
// }

export function formatCountdown(next: Date, now: Date = new Date()): string {
  const diffMs = next.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  if (diffHours < 24) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  if (diffDays === 1) {
    return SCHEDULE_LABELS.TOMORROW;
  }

  if (diffDays < 7) {
    return `In ${diffDays} days`;
  }

  const currentYear = getYear(now);
  const nextYear = getYear(next);
  return format(next, currentYear === nextYear ? 'MMM d' : 'MMM d, yyyy');
}

export function getNextOccurrence(alarm: Alarm): Date | null {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const currentMinutes = dateToMinutes(now);

  if (alarm.scheduleType === 'once') {
    const next = combineDateTime(today, alarm.time);
    if (next > now) return next;
    return combineDateTime(addDays(today, 1), alarm.time);
  }

  if (alarm.scheduleType === 'custom') {
    const dates = (alarm.customDates as string[]).map((date) => {
      return parseISO(date);
    });
    for (const date of dates) {
      const next = combineDateTime(date, alarm.time);
      if (next > now) return next;
    }
    return null;
  }

  if (alarm.scheduleType === 'repeat') {
    const todayDay = today.getDay();

    const nextDates = alarm.repeatDays.map((day) => {
      // if today is this day and time hasn't passed → use today
      if (day === todayDay && currentMinutes < alarm.time) {
        return combineDateTime(today, alarm.time);
      }
      // otherwise find the next date that falls on this day
      return combineDateTime(nextDay(today, day as Day), alarm.time);
    });

    // sort and return the earliest one
    return nextDates.sort((a, b) => a.getTime() - b.getTime())[0];
  }

  return null;
}

// Understand the AUTO code and try to make it mine/better later
// see samsung and googles functionalities later(e.g. single date,once,repeat) later
