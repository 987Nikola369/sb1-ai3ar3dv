import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This will automatically run needed migrations on the database
migrate(db, {
  migrationsFolder: path.join(__dirname, '../../drizzle'),
});

console.log('Migrations complete!');