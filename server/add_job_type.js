import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('--- Migrating Job Type Column ---');

try {
    db.exec(`ALTER TABLE users ADD COLUMN job_type TEXT;`);
    console.log(`✅ Added column: job_type`);
} catch (err) {
    if (err.message.includes('duplicate column name')) {
        console.log(`ℹ️  Column 'job_type' already exists.`);
    } else {
        console.error(`❌ Error:`, err.message);
    }
}

db.close();
