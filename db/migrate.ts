import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from './drizzle';
import journal from './migrations/meta/_journal.json';
// @ts-ignore
import m0000 from './migrations/0000_overrated_gateway.sql';
// @ts-ignore
import m0001 from './migrations/0001_broken_miss_america.sql';
// @ts-ignore
import m0002 from './migrations/0002_far_the_twelve.sql';
// @ts-ignore
import m0003 from './migrations/0003_certain_red_ghost.sql';

const allMigrations = {
  journal,
  migrations: { m0000, m0001, m0002, m0003 },
};

export async function runMigrations() {
  await migrate(db, allMigrations);
}
