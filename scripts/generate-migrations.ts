// scripts/generate-migrations.ts
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const journal = JSON.parse(
  readFileSync(join(__dirname, '../db/migrations/meta/_journal.json'), 'utf-8')
);

const entries = journal.entries as { idx: number; tag: string }[];

const imports = entries
  .map((entry) => `// @ts-ignore\nimport m${String(entry.idx).padStart(4, '0')} from './migrations/${entry.tag}.sql';`)
  .join('\n');

const migrationsObj = entries
  .map((entry) => `m${String(entry.idx).padStart(4, '0')}`)
  .join(', ');

const output = `import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from './drizzle';
import journal from './migrations/meta/_journal.json';
${imports}

const allMigrations = {
  journal,
  migrations: { ${migrationsObj} },
};

export async function runMigrations() {
  await migrate(db, allMigrations);
}
`;

writeFileSync(join(__dirname, '../db/migrate.ts'), output);
console.log('migrate.ts generated successfully');
