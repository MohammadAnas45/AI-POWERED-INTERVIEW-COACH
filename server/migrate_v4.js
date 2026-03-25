import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('Running Migration Milestone 4...');

const columns = [
    { name: 'streak_count', type: 'INTEGER DEFAULT 0' },
    { name: 'last_login_date', type: 'TEXT' },
    { name: 'daily_quest_count', type: 'INTEGER DEFAULT 0' },
    { name: 'last_quest_date', type: 'TEXT' }
];

for (const col of columns) {
    try {
        db.prepare(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`).run();
        console.log(`Added column: ${col.name}`);
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log(`Column ${col.name} already exists.`);
        } else {
            console.error(`Error adding ${col.name}:`, err.message);
        }
    }
}

console.log('Migration Completed.');
db.close();
