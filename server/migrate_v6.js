import Database from 'better-sqlite3';
import path from 'path';

// Use path relative to root where server is run
const dbPath = path.join('server', 'database.sqlite');
const db = new Database(dbPath);

function migrateV6() {
    console.log("Running Migration Milestone 6 (User Table Expansion)...");

    const columnsToAdd = [
        { name: 'phone', type: 'TEXT' },
        { name: 'location', type: 'TEXT' },
        { name: 'github_url', type: 'TEXT' },
        { name: 'linkedin_url', type: 'TEXT' },
        { name: 'website_url', type: 'TEXT' },
        { name: 'job_type', type: 'TEXT' },
        { name: 'last_quest_date', type: 'TEXT' },
        { name: 'daily_quest_count', type: 'INTEGER DEFAULT 0' },
        { name: 'streak_count', type: 'INTEGER DEFAULT 0' },
        { name: 'last_login_date', type: 'TEXT' },
        { name: 'provider', type: 'TEXT DEFAULT "local"' },
        { name: 'provider_id', type: 'TEXT' }
    ];

    for (const column of columnsToAdd) {
        try {
            db.prepare(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`).run();
            console.log(`Added column ${column.name} to users table.`);
        } catch (err) {
            if (err.message.includes('duplicate column name')) {
                console.log(`Column ${column.name} already exists.`);
            } else {
                console.error(`Error adding column ${column.name}:`, err);
            }
        }
    }

    console.log("Migration Milestone 6 Completed.");
}

migrateV6();
