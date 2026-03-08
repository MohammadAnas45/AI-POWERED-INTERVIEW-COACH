-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- Nullable for OAuth users
    provider TEXT DEFAULT 'local', -- 'local', 'google', 'github'
    provider_id TEXT,
    role TEXT DEFAULT 'user',
    resume_path TEXT,
    professional_role TEXT,
    experience_level TEXT,
    skills TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    level TEXT NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT, -- Added to store the ideal answer
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    level TEXT NOT NULL,
    status TEXT DEFAULT 'started', -- 'started', 'completed'
    score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Answers Table
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    question_text TEXT,
    answer_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
    role TEXT,
    level TEXT,
    score INTEGER,
    total_questions INTEGER,
    attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
