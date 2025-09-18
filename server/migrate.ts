import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

const runMigration = async () => {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/college_erp';
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema });

  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: './migrations' });
  
  console.log('Migrations completed successfully!');
  await sql.end();
  process.exit(0);
};

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});