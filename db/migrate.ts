import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { db } from './drizzle'
import journal from './migrations/meta/_journal.json'
// @ts-ignore
import m0000 from './migrations/0000_overrated_gateway.sql'

const allMigrations = {
  journal,
  migrations: { m0000 }
}

export async function runMigrations() {
  await migrate(db, allMigrations)
}
