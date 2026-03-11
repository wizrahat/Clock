import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Database, initialize } from "./drizzle";

type ContextType = { db: Database | null };

export const DatabaseContext = React.createContext<ContextType>({ db: null });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    if (db) return;
    initialize().then((newDb) => {
      setDb(newDb);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}
