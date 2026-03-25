import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in the server directory
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

console.log('Connected to SQLite database at:', dbPath);

// Helper to mimic pg's query interface but for SQLite
// Note: pg uses $1, $2... SQLite uses ? or named params.
// For simplicity, we will replace $1, $2 with ? in the helper
export const query = (text, params = []) => {
    try {
        // Convert PG $1 syntax to SQLite ? syntax
        const sqliteSql = text.replace(/\$\d+/g, '?');

        if (sqliteSql.trim().toUpperCase().startsWith('SELECT') || sqliteSql.trim().toUpperCase().includes('RETURNING')) {
            const stmt = db.prepare(sqliteSql);
            const rows = stmt.all(...params);
            return { rows };
        } else {
            const stmt = db.prepare(sqliteSql);
            const result = stmt.run(...params);
            return { rows: [], result };
        }
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
};

// Initialize schema
const schemaPath = path.join(__dirname, '..', 'schema.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('Database schema initialized');
}

export default db;
