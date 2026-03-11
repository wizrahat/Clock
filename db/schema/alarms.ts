
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
export const AlarmsTable = sqliteTable("alarms", {
  id: text()
    .$defaultFn(() => createId())
    .notNull(),
  label: text().$default(()=>"Alarm").notNull(),
  isActive: integer({
    mode: "boolean",
  }).default(false).notNull(),
  createdAt: integer({mode:"timestamp"}).$defaultFn(() => new Date()).notNull(),
  time: text().notNull(),
  specificDates: text().$type<string[]>().default([]).notNull(),
  scheduleType: text().$type<"once" | "repeat" | "specific">().default("once").notNull(),
  repeatDays: text({ mode: "json" }).$type<number[]>().default([]).notNull(),
});

export const AlarmSelectSchema = createSelectSchema(AlarmsTable)
export const AlarmInsertSchema = createInsertSchema(AlarmsTable)
export const AlarmUpdateSchema = createUpdateSchema(AlarmsTable)

export type Alarm = z.infer<typeof AlarmSelectSchema>
export type NewAlarm = z.infer<typeof AlarmInsertSchema>
export type UpdateAlarm = z.infer<typeof AlarmUpdateSchema>
