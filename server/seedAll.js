import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

const seed = async () => {
    try {
        console.log('--- Comprehensive Data Seeding ---');

        // 1. Ensure we have at least one test user
        const users = db.prepare('SELECT id FROM users').all();
        let userId;
        if (users.length === 0) {
            console.log('Seeding test user...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            const result = db.prepare('INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)').run(
                'Demo User', 'demo@example.com', hashedPassword, 'user'
            );
            userId = result.lastInsertRowid;
        } else {
            userId = users[0].id;
        }
        console.log('Using User ID:', userId);

        // 2. Questions check
        const qCount = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;
        console.log(`Current questions in table: ${qCount}`);

        // 3. Mock Sessions
        console.log('Seeding mock interview history...');

        const mockSessions = [
            { role: 'Developer', level: 'Beginner', score: 85, date: '2024-02-20' },
            { role: 'Data Analyst', level: 'Beginner', score: 72, date: '2024-02-22' },
            { role: 'HR', level: 'Beginner', score: 90, date: '2024-02-25' },
        ];

        for (const session of mockSessions) {
            console.log(`Inserting session for ${session.role}...`);
            // Create Session
            const sRes = db.prepare('INSERT INTO interview_sessions (user_id, role, level, status, score, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
                userId, session.role, session.level, 'completed', session.score, session.date
            );
            const sessionId = sRes.lastInsertRowid;
            console.log('Created Session ID:', sessionId);

            // Create some mock answers
            const questions = db.prepare('SELECT id, question_text FROM questions WHERE role = ? LIMIT 3').all(session.role);
            console.log(`Found ${questions.length} questions for role ${session.role}`);

            for (const q of questions) {
                console.log(`Inserting answer for question ID: ${q.id}`);
                db.prepare('INSERT INTO answers (session_id, question_id, question_text, answer_text) VALUES (?, ?, ?, ?)').run(
                    sessionId, q.id, q.question_text, 'This is a mock answer for ' + q.question_text
                );
            }

            // Create Test Result
            console.log('Inserting test result...');
            db.prepare('INSERT INTO test_results (user_id, session_id, role, level, score, total_questions, attempt_date) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
                userId, sessionId, session.role, session.level, session.score, questions.length, session.date
            );
        }

        console.log('✅ Successfully stored mock data in tables!');
        db.close();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        db.close();
    }
};

seed();
