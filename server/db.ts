import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/college_erp';

// Create connection
const client = postgres(connectionString);

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export a function to close the connection
export const closeConnection = () => client.end();