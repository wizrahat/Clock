import { db } from '@/db/drizzle';
import { AlarmsTable, AlarmUpdateSchema, type UpdateAlarm } from './../db/schema/alarms';
import { eq } from 'drizzle-orm';

export async function updateAlarm(id: string, changes: UpdateAlarm) {
  const result = AlarmUpdateSchema.safeParse(changes);
  if (!result.success) {
    throw new Error(`Insert failed: ${JSON.stringify(result.error.issues)}`);
  }

  return db.update(AlarmsTable)
    .set(result.data as any)
    .where(eq(AlarmsTable.id, id));
}
