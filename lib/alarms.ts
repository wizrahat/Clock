// lib/alarms.ts
import { db } from '@/db/drizzle'
import { AlarmsTable } from '@/db/schema'
import { useAlarmStore } from '@/store/alarms'
import type { NewAlarm, UpdateAlarm } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const loadAlarms = async () => {
  const alarms = db.select().from(AlarmsTable).all()
  useAlarmStore.getState().setAlarms(alarms)
}

export const addAlarm = async (alarm: NewAlarm) => {
  const inserted = db.insert(AlarmsTable).values(alarm as any).returning().get()
  useAlarmStore.getState().addAlarm(inserted)
}

export const updateAlarm = async (id: string, changes: UpdateAlarm) => {
  useAlarmStore.getState().updateAlarm(id, changes)
  await db.update(AlarmsTable).set(changes as any).where(eq(AlarmsTable.id, id))
}

export const deleteAlarm = async (id: string) => {
  useAlarmStore.getState().deleteAlarm(id)
  await db.delete(AlarmsTable).where(eq(AlarmsTable.id, id))
}
