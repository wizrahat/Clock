import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Database, initialize } from "./drizzle";
import { runMigrations } from "./migrate";
import { db } from "./drizzle";
import { AlarmsTable } from "./schema";
import { addDays, format } from "date-fns";

type ContextType = { db: Database | null };

export const DatabaseContext = React.createContext<ContextType>({ db: null });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [database, setDatabase] = useState<Database | null>(null);

  useEffect(() => {
    if (database) return;
    initialize().then(async (newDb) => {
      await runMigrations();

      const existing = await db.select().from(AlarmsTable);
      if (existing.length === 0) {
await db.insert(AlarmsTable).values([
  {
    label: "Wake Up",
    time: 420,
    isActive: true,
    scheduleType: "repeat",
    repeatDays: [1, 2, 3, 4, 5],
    specificDates: [],
  },
  {
    label: "Gym",
    time: 360,
    isActive: false,
    scheduleType: "repeat",
    repeatDays: [1, 3, 5],
    specificDates: [],
  },
  {
    label: "Alarm",
    time: 540,
    isActive: false,
    scheduleType: "repeat",
    repeatDays: [0],
    specificDates: [],
  },
  // Tomorrow repeat
  {
    label: "Tomorrow Repeat",
    time: 480,
    isActive: true,
    scheduleType: "repeat",
    repeatDays: [new Date(Date.now() + 86400000).getDay()],
    specificDates: [],
  },
  // Single date - today's year
  {
    label: "Single Date This Year",
    time: 600,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2026-06-15"],
  },
  // Single date - different year
  {
    label: "Single Date Next Year",
    time: 600,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2027-06-15"],
  },
  // Tomorrow specific date
  {
    label: "Tomorrow Specific",
    time: 700,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: [format(addDays(new Date(), 1), 'yyyy-MM-dd')],
  },
  // Same month range this year
  {
    label: "Same Month Range",
    time: 480,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2026-06-01", "2026-06-15"],
  },
  // Same month range different year
  {
    label: "Same Month Range Next Year",
    time: 480,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2027-06-01", "2027-06-15"],
  },
  // Different month range this year
  {
    label: "Different Month Range",
    time: 480,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2026-06-15", "2026-08-20"],
  },
  // Different month same non-current year
  {
    label: "Different Month Next Year",
    time: 480,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2027-03-15", "2027-08-20"],
  },
  // Spans across years
  {
    label: "Cross Year Range",
    time: 480,
    isActive: true,
    scheduleType: "specific",
    repeatDays: [],
    specificDates: ["2026-12-25", "2027-01-05"],
  },
]);
      }

      setDatabase(newDb);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db: database }}>
      {children}
    </DatabaseContext.Provider>
  );
}
