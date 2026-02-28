import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('--- Initializing SQLite Database ---');

if (fs.existsSync(dbPath)) {
    console.log('Removing old database...');
    fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('Creating tables...');
db.exec(schema);

console.log('✅ SQLite Database initialized successfully!');
db.close();
