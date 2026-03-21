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
            time: 420, // 07:00
            isActive: true,
            scheduleType: "repeat",
            repeatDays: [1, 2, 3, 4, 5],
            specificDates: [],
          },
          {
            label: "Gym",
            time: 360, // 06:00
            isActive: false,
            scheduleType: "repeat",
            repeatDays: [1, 3, 5],
            specificDates: [],
          },
          {
            label: "Alarm",
            time: 540, // 09:00
            isActive: false,
            scheduleType: "repeat",
            repeatDays: [0],
            specificDates: [],
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
