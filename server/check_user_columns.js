import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

console.log('--- User Table Schema ---');
const info = db.prepare('PRAGMA table_info(users)').all();
info.forEach(col => {
    console.log(`${col.name}: ${col.type}`);
});

db.close();
