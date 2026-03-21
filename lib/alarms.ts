import { db } from '@/db/drizzle';
import { Alarm, AlarmsTable, AlarmUpdateSchema, type UpdateAlarm } from './../db/schema/alarms';
import { eq } from 'drizzle-orm';
import { SCHEDULE_LABELS } from './constants';
import { addDays, format, getDay, getMonth, getYear, parseISO } from 'date-fns';
import { formatTime } from './utils';
import { CaseSensitive } from 'lucide-react-native';

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

function isDayTomorrow(dayIndex: number) {
  const tomorrow = addDays(new Date(), 1);
  return dayIndex === tomorrow.getDay();
}

function isDateTomorrow(date: Date) {
  const tomorrow = addDays(new Date(), 1);
  return format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
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
  specificDates: string[]
) {
  const formattedDates = specificDates.map((date) => {
    return parseISO(date);
  });
  const presetLabel = PRESET_LABELS[JSON.stringify(repeatDays)];

  if (scheduleType === 'once' || (repeatDays.length < 1 && formattedDates.length < 1)) {
    return SCHEDULE_LABELS.ONCE;
  }
  if (scheduleType === 'specific') {
    const startDate = formattedDates[0];
    const endDate = formattedDates[formattedDates.length - 1];
    const currentYear = getYear(new Date());
    const startYear = getYear(startDate);
    const endYear = getYear(endDate);
    const isSameYear = startYear === currentYear && endYear === currentYear;
    const isSameMonth = getMonth(startDate) === getMonth(endDate) && startYear === endYear;
    if (formattedDates.length === 1) {
      if (isDateTomorrow(startDate)) {
        return SCHEDULE_LABELS.TOMORROW;
      }
      //  Mar 23  |  Mar 23, 2027
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
    if (isDayTomorrow(repeatDays[0])) {
      return SCHEDULE_LABELS.TOMORROW;
    }
    return format(addDays(new Date(2024, 0, 7), repeatDays[0]), 'EEEE');
  }
  if (isConsecutive(repeatDays)) {
    return `${DAY_LABELS[repeatDays[0]]} – ${DAY_LABELS[repeatDays[repeatDays.length - 1]]}`;
  }

  return repeatDays.map((v) => DAY_LABELS[v]).join(' | ');
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

// Understand this code later
// see samsung and googles single date later
// Today cases
// Today passed cases

// ? Header cases
// scheduleType === "repeat"

// Today, time hasn't passed → time difference in minutes → threshold display
// Today, time has passed, today is only day → next occurrence is 7 days away → In 7 days or date
// Today, time has passed, other days in repeatDays → find next day in repeatDays after today → compute difference → threshold display
// Today not in repeatDays → find next upcoming day in repeatDays from today → compute difference → threshold display
// Every day → always today or tomorrow depending on time → compute difference → threshold display

// scheduleType === "specific"

// Single date, today, time hasn't passed → compute hours/minutes until time → threshold display
// Single date, today, time has passed → defer
// Single date, tomorrow → Tomorrow or hours if within 24h
// Single date, within 7 days → In X days
// Single date, 7+ days, this year → Mar 25
// Single date, 7+ days, different year → Mar 25, 2027
// Date range → find first date in range that hasn't passed → same threshold logic
// Past date entirely → defer

// scheduleType === "once"

// Today, time hasn't passed → compute hours/minutes → threshold display
// Today, time has passed → defer
// Tomorrow → Tomorrow or hours if within 24h
// Within 7 days → In X days
// 7+ days this year → Mar 25
// 7+ days different year → Mar 25, 2027
// Past → defer

// Threshold display rules:

// Under 60 minutes → 45m
// Under 24 hours → 9h 47m
// Exactly 1 day → Tomorrow
// 2–6 days → In X days
// 7+ days → Mar 25 or Mar 25, 2027

// No active alarms:

// Hide header entirely or show "No active alarms"

// ? extra cases
// Next alarm selection needs to use getNextOccurrence instead of sorting by time
// specific and once need to combine specificDates date + time field for full timestamp and ease of use
// will solve these problems if i do above
// Has time passed — compare full timestamp against now, simple and accurate
// Next occurrence — for specific and once you just compare the full timestamp directly, no day arithmetic needed
// Sorting — sorting active alarms by next occurrence becomes trivial, just sort by timestamp
// Countdown — difference between now and the timestamp gives you exact minutes for the threshold display
// once date problem solved — store the target date in specificDates as a single entry, combine with time, now once has a full datetime
// Expired detection — if the full timestamp is in the past, the alarm is expired. Easy to flag or hide
