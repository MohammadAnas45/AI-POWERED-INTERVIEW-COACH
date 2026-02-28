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

        if (sqliteSql.trim().toUpperCase().startsWith('SELECT')) {
            const stmt = db.prepare(sqliteSql);
            const rows = stmt.all(...params);
            return { rows };
        } else {
            const stmt = db.prepare(sqliteSql);
            const result = stmt.run(...params);
            // Return rows if RETURNING is used (SQLite 3.35+ supports this, but manually here for safety)
            if (text.toUpperCase().includes('RETURNING')) {
                // Mocking RETURNING for older SQLite versions if needed, 
                // but better-sqlite3 handles most things.
                // Let's just return the last inserted ID if it's an INSERT
                if (text.toUpperCase().startsWith('INSERT')) {
                    const lastId = result.lastInsertRowid;
                    const tableMatch = text.match(/INTO\s+([a-zA-Z0-9_]+)/i);
                    const tableName = tableMatch ? tableMatch[1] : null;

                    if (tableName) {
                        const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(lastId);
                        return { rows: row ? [row] : [], result };
                    }
                }
            }
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
