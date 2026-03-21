import { db } from '@/db/drizzle';
import { Alarm, AlarmsTable, AlarmUpdateSchema, type UpdateAlarm } from './../db/schema/alarms';
import { eq } from 'drizzle-orm';
import { SCHEDULE_LABELS } from './constants';
import { addDays } from 'date-fns';

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

function isTomorrow(dayIndex:number){
  const tomorrow = addDays(new Date(),1)
  return dayIndex === tomorrow.getDay()
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

export function formatScheduleLabel(scheduleType: Alarm['scheduleType'], repeatDays: number[]) {
  if (scheduleType === 'once' || repeatDays.length < 1) {
    return SCHEDULE_LABELS.ONCE;
  }
  const presetLabel = PRESET_LABELS[JSON.stringify(repeatDays)];
  if (presetLabel) {
    return presetLabel;
  }
  if(repeatDays.length === 1 && isTomorrow(repeatDays[0]) ){
    return SCHEDULE_LABELS.TOMORROW
  }
  if (repeatDays.length === 1) {
    return DAY_LABELS[repeatDays[0]];
  }
  if (isConsecutive(repeatDays)) {
    return `${DAY_LABELS[repeatDays[0]]} – ${DAY_LABELS[repeatDays[repeatDays.length - 1]]}`;
  }

  return repeatDays.map((v) => DAY_LABELS[v]).join(' | ');
}
