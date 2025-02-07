import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../src/lib/db/schema';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the database file in the project root
const sqlite = new Database(path.join(__dirname, '../../sqlite.db'));
export const db = drizzle(sqlite, { schema });