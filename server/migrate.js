import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

const columns = [
    { name: 'phone', type: 'TEXT' },
    { name: 'location', type: 'TEXT' },
    { name: 'github_url', type: 'TEXT' },
    { name: 'linkedin_url', type: 'TEXT' },
    { name: 'website_url', type: 'TEXT' }
];

console.log('--- Migrating User Table ---');

columns.forEach(col => {
    try {
        db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
        console.log(`✅ Added column: ${col.name}`);
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log(`ℹ️  Column '${col.name}' already exists.`);
        } else {
            console.error(`❌ Error adding column '${col.name}':`, err.message);
        }
    }
});

console.log('✅ Migration complete!');
db.close();
