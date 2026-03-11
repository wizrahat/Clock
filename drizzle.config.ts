import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './database.db'
  },
} satisfies Config;
