import {drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from '@/db/schema/index';
const expoDb = openDatabaseSync("database.db", { enableChangeListener: true });
const db = drizzle(expoDb,{schema});

export  type Database = typeof db;
export const initialize = (): Promise<Database> => {
  return Promise.resolve(db);
};
