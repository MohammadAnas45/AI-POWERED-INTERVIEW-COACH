import { query } from '../config/db.js';

// @desc    Get available roles
// @route   GET /api/practice/roles
export const getRoles = async (req, res) => {
    const roles = {
        technical: ['Developer', 'Software Engineer', 'Data Analyst', 'Cyber Security'],
        nonTechnical: ['HR', 'Customer Support', 'Project Manager']
    };
    res.json(roles);
};

// @desc    Start practice session and generate questions
// @route   POST /api/practice/start
export const startPractice = async (req, res) => {
    const { role, level } = req.body;
    const userId = req.user.id;

    try {
        console.log('Starting practice for:', { role, level, userId });
        // Find questions for role and level
        const qResult = await query(
            'SELECT id, question_text as "questionText", category FROM questions WHERE role = $1 AND level = $2',
            [role, level]
        );
        const questions = qResult.rows;
        console.log(`Found ${questions.length} questions for ${role} - ${level}`);

        const sessionResult = await query(
            'INSERT INTO interview_sessions (user_id, role, level) VALUES ($1, $2, $3) RETURNING id',
            [userId, role, level]
        );

        if (!sessionResult.rows || sessionResult.rows.length === 0) {
            throw new Error('Failed to create interview session record');
        }

        res.status(201).json({
            sessionId: sessionResult.rows[0].id,
            questions: questions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit an answer for a question
// @route   POST /api/practice/submit-answer
export const submitAnswer = async (req, res) => {
    const { sessionId, questionId, questionText, answerText } = req.body;

    try {
        await query(
            'INSERT INTO answers (session_id, question_id, question_text, answer_text) VALUES ($1, $2, $3, $4)',
            [sessionId, questionId, questionText, answerText]
        );
        res.json({ message: 'Answer saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete the test and generate result
// @route   POST /api/practice/submit-test
export const submitTest = async (req, res) => {
    const { sessionId } = req.body;

    try {
        // Get session info
        const sResult = await query('SELECT * FROM interview_sessions WHERE id = $1', [sessionId]);
        const session = sResult.rows[0];

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Get total answers count
        const aResult = await query('SELECT COUNT(*) FROM answers WHERE session_id = $1', [sessionId]);
        const totalAnswers = parseInt(aResult.rows[0].count);

        // Basic scoring logic
        const score = Math.floor(Math.random() * 41) + 60;

        // Update session
        await query(
            'UPDATE interview_sessions SET status = $1, score = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            ['completed', score, sessionId]
        );

        // Create test result
        const resultInsert = await query(
            'INSERT INTO test_results (user_id, session_id, role, level, score, total_questions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [session.user_id, sessionId, session.role, session.level, score, totalAnswers]
        );

        res.json({
            ...resultInsert.rows[0],
            attemptDate: resultInsert.rows[0].attempt_date // Match frontend expectation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's progress/history
// @route   GET /api/practice/progress
export const getProgress = async (req, res) => {
    const userId = req.user.id;

    try {
        const history = await query(
            'SELECT id as "_id", role, level, score, total_questions as "totalQuestions", attempt_date as "attemptDate" FROM test_results WHERE user_id = $1 ORDER BY attempt_date DESC',
            [userId]
        );
        res.json(history.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
