import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const tables = ['users', 'questions', 'interview_sessions', 'answers', 'test_results'];

console.log('--- Database Status ---');

tables.forEach(table => {
    try {
        const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`${table.padEnd(20)}: ${row.count} rows`);
    } catch (err) {
        console.error(`Error querying ${table}:`, err.message);
    }
});

db.close();
