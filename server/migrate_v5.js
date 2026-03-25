import Database from 'better-sqlite3';

// Use path relative to root where server is run
const db = new Database('database.sqlite');

function migrateV5() {
    console.log("Running Migration Milestone 5 (Proctoring)...");

    try {
        // Add violation_reason to interview_sessions
        db.prepare("ALTER TABLE interview_sessions ADD COLUMN violation_reason TEXT").run();
        console.log("Added violation_reason column to interview_sessions.");
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log("Column violation_reason already exists.");
        } else {
            console.error("Error adding column:", err);
        }
    }

    try {
        // Create proctoring_logs table
        db.prepare(`
            CREATE TABLE IF NOT EXISTS proctoring_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
                violation_type TEXT,
                description TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
        console.log("Created proctoring_logs table.");
    } catch (err) {
        console.error("Error creating table:", err);
    }

    console.log("Migration Completed.");
}

migrateV5();
